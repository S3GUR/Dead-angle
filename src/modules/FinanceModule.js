import { StateCoordinator } from '../core/StateCoordinator.js';
import { formatMoney } from '../core/Utils.js';

class FinanceModuleClass {
  constructor() {
    this.currentFinanceCategory = 'all';
    this.financeBreakdownChartInstance = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Bind finance category buttons
    const financeCategoryButtons = document.querySelectorAll('.finance-nav-btn');
    financeCategoryButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        financeCategoryButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFinanceCategory = btn.getAttribute('data-category');
        this.render(StateCoordinator.state);
      });
    });

    // Add finance trigger
    const addFinanceBtn = document.getElementById('add-finance-btn');
    if (addFinanceBtn) {
      addFinanceBtn.addEventListener('click', () => {
        if (this.currentFinanceCategory === 'flows') {
          this.openFlowModal();
        } else {
          this.openFinanceModal();
        }
      });
    }

    // Modal submit bindings
    const financeForm = document.getElementById('finance-form');
    if (financeForm) {
      financeForm.addEventListener('submit', (e) => this.handleFinanceSubmit(e));
    }

    const flowForm = document.getElementById('flow-form');
    if (flowForm) {
      flowForm.addEventListener('submit', (e) => this.handleFlowSubmit(e));
    }

    // Modal close binds
    const closeFinanceModalBtn = document.getElementById('close-finance-modal');
    if (closeFinanceModalBtn) closeFinanceModalBtn.addEventListener('click', () => this.closeFinanceModal());

    const cancelFinanceModalBtn = document.getElementById('cancel-finance-modal');
    if (cancelFinanceModalBtn) cancelFinanceModalBtn.addEventListener('click', () => this.closeFinanceModal());

    const closeFlowModalBtn = document.getElementById('close-flow-modal');
    if (closeFlowModalBtn) closeFlowModalBtn.addEventListener('click', () => this.closeFlowModal());

    const cancelFlowModalBtn = document.getElementById('cancel-flow-modal');
    if (cancelFlowModalBtn) cancelFlowModalBtn.addEventListener('click', () => this.closeFlowModal());

    this.initialized = true;
  }

  render(state) {
    this.init();

    const container = document.getElementById('finances-container');
    if (!container) return;
    container.innerHTML = '';

    // Total patrimoine left panel
    const totalAssets = state.finances.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);
    const totalAssetsValueEl = document.getElementById('total-assets-value');
    if (totalAssetsValueEl) totalAssetsValueEl.innerText = formatMoney(totalAssets);

    // Update main button label
    const addBtn = document.getElementById('add-finance-btn');
    if (addBtn) {
      if (this.currentFinanceCategory === 'flows') {
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter un flux';
      } else {
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter un actif';
      }
    }

    if (this.currentFinanceCategory === 'flows') {
      this.renderRecurringFlows(state, container);
      return;
    }

    let filtered = state.finances || [];
    if (this.currentFinanceCategory !== 'all') {
      filtered = state.finances.filter(f => f.type === this.currentFinanceCategory);
    }

    const icons = {
      bank: 'fa-building-columns',
      savings: 'fa-piggy-bank',
      investment: 'fa-chart-line',
      asset: 'fa-laptop-code',
      other: 'fa-box-open'
    };

    const typeLabels = {
      bank: 'Compte courant',
      savings: 'Épargne de réserve',
      investment: 'Investissement',
      asset: 'Bien Matériel',
      other: 'Autre possession'
    };

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-wallet"></i>
          <p class="empty-state-title">Aucun actif financier</p>
          <p class="empty-state-desc">Enregistrez vos comptes en banque, épargnes et possessions pour calculer votre valeur nette.</p>
        </div>
      `;
      this.renderFinanceCharts(state);
      return;
    }

    filtered.forEach(item => {
      const row = document.createElement('div');
      row.className = 'finance-item-row';
      
      row.innerHTML = `
        <div class="finance-item-info">
          <div class="finance-item-icon ${item.type}">
            <i class="fa-solid ${icons[item.type] || 'fa-coins'}"></i>
          </div>
          <div class="finance-item-details">
            <span class="finance-item-name">${item.name}</span>
            <span class="finance-item-meta">${typeLabels[item.type]} • Mise à jour : ${new Date(item.lastUpdated || Date.now()).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>

        <div class="finance-item-value-area">
          <span class="finance-item-value">${formatMoney(item.balance)}</span>
          <div class="project-actions">
            <button class="action-btn edit-fin-btn" data-id="${item.id}" title="Modifier">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-btn delete delete-fin-btn" data-id="${item.id}" title="Supprimer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(row);
    });

    // Bind event handlers inside container
    container.querySelectorAll('.edit-fin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openFinanceModal(id);
      });
    });

    container.querySelectorAll('.delete-fin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteFinanceItem(id);
      });
    });

    // Render bar chart
    this.renderFinanceCharts(state);
  }

  renderRecurringFlows(state, container) {
    const flows = state.recurringFlows || [];
    
    // Normalization helper to monthly value
    function getMonthlyEquivalent(flow) {
      const val = parseFloat(flow.amount);
      if (flow.frequency === 'weekly') return val * 4.333;
      if (flow.frequency === 'yearly') return val / 12;
      return val; // monthly
    }
    
    const totalInflows = flows.filter(f => f.type === 'inflow').reduce((acc, curr) => acc + getMonthlyEquivalent(curr), 0);
    const totalOutflows = flows.filter(f => f.type === 'outflow').reduce((acc, curr) => acc + getMonthlyEquivalent(curr), 0);
    const netSavingsCapacity = totalInflows - totalOutflows;
    
    // Generate flow summary layout
    const summaryCard = document.createElement('div');
    summaryCard.className = 'glass-panel';
    summaryCard.style.padding = '20px';
    summaryCard.style.marginBottom = '20px';
    summaryCard.style.display = 'flex';
    summaryCard.style.flexDirection = 'column';
    summaryCard.style.gap = '12px';
    
    const expenseRatio = totalInflows > 0 ? Math.min(100, Math.round((totalOutflows / totalInflows) * 100)) : 0;
    
    summaryCard.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align:center;">
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Revenus Mensuels</span>
          <h4 style="font-family:'Outfit'; font-size:1.25rem; color:var(--success); font-weight:700; margin-top:4px;">+ ${formatMoney(totalInflows)}</h4>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Dépenses Mensuelles</span>
          <h4 style="font-family:'Outfit'; font-size:1.25rem; color:var(--accent-pink); font-weight:700; margin-top:4px;">- ${formatMoney(totalOutflows)}</h4>
        </div>
        <div>
          <span style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Capacité d'Épargne</span>
          <h4 style="font-family:'Outfit'; font-size:1.25rem; color:${netSavingsCapacity >= 0 ? 'var(--accent-cyan)' : 'var(--danger)'}; font-weight:700; margin-top:4px;">${formatMoney(netSavingsCapacity)}</h4>
        </div>
      </div>
      
      <div style="border-top:1px dashed var(--border-glass); padding-top:12px; display:flex; flex-direction:column; gap:6px;">
        <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted);">
          <span>Taux d'engagement des revenus</span>
          <span>${expenseRatio}% des revenus</span>
        </div>
        <div class="progress-bar-container" style="height:6px;">
          <div class="progress-bar-fill" style="width: ${expenseRatio}%; background: ${expenseRatio > 80 ? 'var(--danger)' : 'linear-gradient(90deg, var(--secondary), var(--primary))'};"></div>
        </div>
      </div>
    `;
    
    container.appendChild(summaryCard);
    
    if (flows.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = `
        <i class="fa-solid fa-money-bill-transfer"></i>
        <p class="empty-state-title">Aucun flux récurrent enregistré</p>
        <p class="empty-state-desc">Entrez vos charges fixes (loyer, abonnements) et vos rentrées régulières pour visualiser votre capacité d'épargne réelle.</p>
      `;
      container.appendChild(empty);
      return;
    }
    
    const frequencies = { weekly: 'Hebdomadaire', monthly: 'Mensuel', yearly: 'Annuel' };
    
    flows.forEach(flow => {
      const row = document.createElement('div');
      row.className = `finance-item-row ${flow.type}`;
      
      const icon = flow.type === 'inflow' ? 'fa-arrow-trend-up' : 'fa-arrow-trend-down';
      
      row.innerHTML = `
        <div class="finance-item-info">
          <div class="finance-item-icon ${flow.type}">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div class="finance-item-details">
            <span class="finance-item-name">${flow.name}</span>
            <span class="finance-item-meta">${frequencies[flow.frequency]} • Équivalent : ${formatMoney(getMonthlyEquivalent(flow))}/mois</span>
          </div>
        </div>

        <div class="finance-item-value-area">
          <span class="finance-item-value">${flow.type === 'inflow' ? '+' : '-'} ${formatMoney(flow.amount)}</span>
          <div class="project-actions">
            <button class="action-btn edit-flow-btn" data-id="${flow.id}" title="Modifier">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-btn delete delete-flow-btn" data-id="${flow.id}" title="Supprimer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
      container.appendChild(row);
    });
    
    // Bind flow listeners
    container.querySelectorAll('.edit-flow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openFlowModal(id);
      });
    });
    
    container.querySelectorAll('.delete-flow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteFlow(id);
      });
    });
  }

  renderFinanceCharts(state) {
    const ctx = document.getElementById('financeBreakdownChart');
    if (!ctx) return;

    if (this.financeBreakdownChartInstance) {
      this.financeBreakdownChartInstance.destroy();
      this.financeBreakdownChartInstance = null;
    }

    const categories = { bank: 0, savings: 0, investment: 0, asset: 0, other: 0 };
    state.finances.forEach(item => {
      if (categories[item.type] !== undefined) {
        categories[item.type] += parseFloat(item.balance || 0);
      } else {
        categories.other += parseFloat(item.balance || 0);
      }
    });

    const labels = ['Comptes', 'Épargne', 'Bourse/Crypto', 'Possessions', 'Autres'];
    const data = [categories.bank, categories.savings, categories.investment, categories.asset, categories.other];

    const total = data.reduce((a, b) => a + b, 0);
    if (total === 0) {
      const canvasCtx = ctx.getContext('2d');
      canvasCtx.clearRect(0, 0, ctx.width, ctx.height);
      canvasCtx.fillStyle = '#9ca3af';
      canvasCtx.font = '12px Inter';
      canvasCtx.textAlign = 'center';
      canvasCtx.textBaseline = 'middle';
      canvasCtx.fillText('Aucune donnée à afficher', ctx.clientWidth / 2, ctx.clientHeight / 2);
      return;
    }

    this.financeBreakdownChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: 'rgba(157, 78, 221, 0.45)',
          borderColor: '#9d4edd',
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(10, 9, 22, 0.95)',
            callbacks: {
              label: function(context) {
                return ' ' + formatMoney(context.raw);
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 9
              }
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#f3f4f6',
              font: {
                family: 'Inter',
                size: 10
              }
            }
          }
        }
      }
    });
  }

  // Finance Modals
  openFinanceModal(id = null) {
    const financeModal = document.getElementById('finance-modal');
    const financeForm = document.getElementById('finance-form');
    if (!financeModal || !financeForm) return;

    financeForm.reset();
    document.getElementById('finance-id').value = '';
    document.getElementById('finance-modal-title').innerText = "Ajouter un élément financier";

    if (id) {
      const item = StateCoordinator.state.finances.find(f => f.id === id);
      if (item) {
        document.getElementById('finance-id').value = item.id;
        document.getElementById('finance-name').value = item.name;
        document.getElementById('finance-type').value = item.type;
        document.getElementById('finance-balance').value = item.balance;
        document.getElementById('finance-modal-title').innerText = "Modifier l'élément financier";
      }
    }
    financeModal.classList.add('active');
  }

  closeFinanceModal() {
    const financeModal = document.getElementById('finance-modal');
    if (financeModal) financeModal.classList.remove('active');
  }

  handleFinanceSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('finance-id').value;
    const name = document.getElementById('finance-name').value.trim();
    const type = document.getElementById('finance-type').value;
    const balance = parseFloat(document.getElementById('finance-balance').value) || 0;

    StateCoordinator.updateState(state => {
      if (id) {
        // Edit
        const idx = state.finances.findIndex(f => f.id === id);
        if (idx !== -1) {
          state.finances[idx] = { ...state.finances[idx], name, type, balance, lastUpdated: new Date().toISOString() };
          StateCoordinator.logActivity('finance', `Solde de '${name}' mis à jour.`);
        }
      } else {
        // Add
        const newItem = {
          id: 'fin-' + Date.now(),
          name,
          type,
          balance,
          lastUpdated: new Date().toISOString()
        };
        state.finances.push(newItem);
        StateCoordinator.logActivity('finance', `Actif financier '${name}' ajouté.`);
      }
    }, ['finances']);

    this.closeFinanceModal();
  }

  deleteFinanceItem(id) {
    const item = StateCoordinator.state.finances.find(f => f.id === id);
    if (item && confirm(`Voulez-vous vraiment retirer l'actif "${item.name}" ?`)) {
      StateCoordinator.updateState(state => {
        state.finances = state.finances.filter(f => f.id !== id);
        StateCoordinator.logActivity('finance', `Retrait de l'actif '${item.name}'.`);
      }, ['finances']);
    }
  }

  // Flows Modals
  openFlowModal(id = null) {
    const flowModal = document.getElementById('flow-modal');
    const flowForm = document.getElementById('flow-form');
    if (!flowModal || !flowForm) return;

    flowForm.reset();
    document.getElementById('flow-id').value = '';
    document.getElementById('flow-modal-title').innerText = "Ajouter un flux récurrent";

    if (id) {
      const flow = StateCoordinator.state.recurringFlows.find(f => f.id === id);
      if (flow) {
        document.getElementById('flow-id').value = flow.id;
        document.getElementById('flow-name').value = flow.name;
        document.getElementById('flow-type').value = flow.type;
        document.getElementById('flow-frequency').value = flow.frequency;
        document.getElementById('flow-amount').value = flow.amount;
        document.getElementById('flow-modal-title').innerText = "Modifier le flux récurrent";
      }
    }
    flowModal.classList.add('active');
  }

  closeFlowModal() {
    const flowModal = document.getElementById('flow-modal');
    if (flowModal) flowModal.classList.remove('active');
  }

  handleFlowSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('flow-id').value;
    const name = document.getElementById('flow-name').value.trim();
    const type = document.getElementById('flow-type').value;
    const frequency = document.getElementById('flow-frequency').value;
    const amount = parseFloat(document.getElementById('flow-amount').value) || 0;

    StateCoordinator.updateState(state => {
      if (!state.recurringFlows) state.recurringFlows = [];

      if (id) {
        // Edit
        const idx = state.recurringFlows.findIndex(f => f.id === id);
        if (idx !== -1) {
          state.recurringFlows[idx] = { ...state.recurringFlows[idx], name, type, frequency, amount };
          StateCoordinator.logActivity('finance', `Flux récurrent '${name}' mis à jour.`);
        }
      } else {
        // Add
        const newFlow = {
          id: 'flow-' + Date.now(),
          name,
          type,
          frequency,
          amount
        };
        state.recurringFlows.push(newFlow);
        StateCoordinator.logActivity('finance', `Flux récurrent '${name}' enregistré.`);
      }
    }, ['recurringFlows']);

    this.closeFlowModal();
  }

  deleteFlow(id) {
    const flow = StateCoordinator.state.recurringFlows.find(f => f.id === id);
    if (flow && confirm(`Voulez-vous vraiment retirer le flux récurrent "${flow.name}" ?`)) {
      StateCoordinator.updateState(state => {
        state.recurringFlows = state.recurringFlows.filter(f => f.id !== id);
        StateCoordinator.logActivity('finance', `Retrait du flux récurrent '${flow.name}'.`);
      }, ['recurringFlows']);
    }
  }
}

export const FinanceModule = new FinanceModuleClass();
