import { StateCoordinator } from '../core/StateCoordinator.js';
import { formatMoney } from '../core/Utils.js';

class PayslipsModuleClass {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Add payslip button listener
    const addPayslipBtn = document.getElementById('add-payslip-btn');
    if (addPayslipBtn) {
      addPayslipBtn.addEventListener('click', () => this.openPayslipModal());
    }

    // Modal submit binding
    const payslipForm = document.getElementById('payslip-form');
    if (payslipForm) {
      payslipForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Modal close binds
    const closePayslipModalBtn = document.getElementById('close-payslip-modal');
    if (closePayslipModalBtn) closePayslipModalBtn.addEventListener('click', () => this.closePayslipModal());

    const cancelPayslipModalBtn = document.getElementById('cancel-payslip-modal');
    if (cancelPayslipModalBtn) cancelPayslipModalBtn.addEventListener('click', () => this.closePayslipModal());

    this.initialized = true;
  }

  render(state) {
    this.init();

    const container = document.getElementById('payslips-container');
    if (!container) return;
    container.innerHTML = '';

    if (!state.payslips || state.payslips.length === 0) {
      container.innerHTML = `
        <div class="glass-panel empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-file-invoice-dollar"></i>
          <p class="empty-state-title">Aucune fiche de paie</p>
          <p class="empty-state-desc">Consignez vos revenus récurrents et suivez le montant net perçu pour estimer vos rentrées d'argent mensuelles.</p>
          <button class="glass-button primary" id="empty-state-add-payslip-btn">
            Enregistrer une paie
          </button>
        </div>
      `;
      const btn = document.getElementById('empty-state-add-payslip-btn');
      if (btn) btn.addEventListener('click', () => this.openPayslipModal());
      return;
    }

    state.payslips.forEach(pay => {
      const card = document.createElement('div');
      card.className = 'glass-panel payslip-card';

      card.innerHTML = `
        <div class="payslip-header">
          <div>
            <div class="payslip-date">${pay.month} ${pay.year}</div>
            <div class="payslip-employer">${pay.employer}</div>
          </div>
          <button class="action-btn delete delete-payslip-btn" data-id="${pay.id}" title="Supprimer">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>

        <div class="payslip-row">
          <span>Salaire Brut :</span>
          <span>${formatMoney(pay.gross)}</span>
        </div>
        <div class="payslip-row">
          <span>Impôt à la source :</span>
          <span class="text-danger">- ${formatMoney(pay.tax)}</span>
        </div>
        <div class="payslip-row">
          <span>Temps déclaré :</span>
          <span>${pay.hours} h</span>
        </div>
        
        <div class="payslip-row net">
          <span>Net perçu :</span>
          <span>${formatMoney(pay.net)}</span>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.delete-payslip-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deletePayslip(id);
      });
    });
  }

  openPayslipModal() {
    const payslipModal = document.getElementById('payslip-modal');
    const payslipForm = document.getElementById('payslip-form');
    if (!payslipModal || !payslipForm) return;

    payslipForm.reset();
    document.getElementById('payslip-id').value = '';
    
    // Set default month to current
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const currentMonth = months[new Date().getMonth()];
    
    document.getElementById('payslip-month').value = currentMonth;
    document.getElementById('payslip-year').value = new Date().getFullYear();

    payslipModal.classList.add('active');
  }

  closePayslipModal() {
    const payslipModal = document.getElementById('payslip-modal');
    if (payslipModal) payslipModal.classList.remove('active');
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const month = document.getElementById('payslip-month').value;
    const year = parseInt(document.getElementById('payslip-year').value);
    const employer = document.getElementById('payslip-employer').value.trim();
    const gross = parseFloat(document.getElementById('payslip-gross').value) || 0;
    const net = parseFloat(document.getElementById('payslip-net').value) || 0;
    const tax = parseFloat(document.getElementById('payslip-tax').value) || 0;
    const hours = parseFloat(document.getElementById('payslip-hours').value) || 151.67;

    StateCoordinator.updateState(state => {
      const newPayslip = {
        id: 'pay-' + Date.now(),
        month,
        year,
        employer,
        gross,
        net,
        tax,
        hours
      };
      
      if (!state.payslips) state.payslips = [];
      state.payslips.unshift(newPayslip);
      StateCoordinator.logActivity('finance', `Fiche de paie de ${month} ${year} (${employer}) enregistrée.`);

      // Rule 5: Interconnect finance and payslips (crediting bank account)
      // Automatically credit the bank account representing salary, if one exists (like Boursorama)
      const salaryAccount = state.finances.find(f => f.type === 'bank');
      if (salaryAccount) {
        salaryAccount.balance = parseFloat(salaryAccount.balance || 0) + net;
        salaryAccount.lastUpdated = new Date().toISOString();
        StateCoordinator.logActivity('finance', `Salaire net de ${formatMoney(net)} crédité sur le compte ${salaryAccount.name}.`);
      }
    });

    this.closePayslipModal();
  }

  deletePayslip(id) {
    const pay = StateCoordinator.state.payslips.find(p => p.id === id);
    if (pay && confirm(`Retirer la fiche de paie de ${pay.month} ${pay.year} ?`)) {
      StateCoordinator.updateState(state => {
        state.payslips = state.payslips.filter(p => p.id !== id);
        StateCoordinator.logActivity('finance', `Fiche de paie de ${pay.month} ${pay.year} retirée.`);
      });
    }
  }
}

export const PayslipsModule = new PayslipsModuleClass();
