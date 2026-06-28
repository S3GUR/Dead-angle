import { formatMoney } from '../core/Utils.js';

class RatesModuleClass {
  constructor() {
    this.ratesComparisonChartInstance = null;
    this.initialized = false;
    this.interestRatesData = {
      regulated: [
        { name: "LEP (Livret d'Épargne Populaire)", rate: 2.50, limit: 10000, description: "Réservé aux revenus modestes. Rendement net imbattable et 100% sécurisé." },
        { name: "Livret A", rate: 1.50, limit: 22950, description: "Disponible à tout moment et exonéré d'impôts. Limité à un livret par personne." },
        { name: "LDDS (Dév. Durable & Solidaire)", rate: 1.50, limit: 12000, description: "Exonéré d'impôts, fonctionne de la même manière que le Livret A." }
      ],
      commercial: [
        { name: "Distingo Bank", rate: 2.00, promoRate: 4.50, promoDuration: 3, limit: 1000000, description: "Offre promo de 4,50% brut pendant 3 mois, puis 2,00% brut de base." },
        { name: "Trade Republic", rate: 2.00, limit: 50000, description: "Rémunération de 2,00% brut versée mensuellement sur les espèces." },
        { name: "BoursoBank (Bourso+)", rate: 2.00, limit: 1000000, description: "Livret d'épargne Bourso Bank rémunéré à 2,00% brut de base." },
        { name: "Fortuneo (Livret +)", rate: 2.00, limit: 1000000, description: "Taux de base de 2,00% brut de base. Sans frais de versement ou retrait." }
      ]
    };
  }

  init() {
    if (this.initialized) return;

    // Bind inputs
    const simulateInput = document.getElementById('rates-simulate-amount');
    const applyTaxCheckbox = document.getElementById('rates-apply-tax');
    
    if (simulateInput) {
      simulateInput.addEventListener('input', () => this.render());
    }
    if (applyTaxCheckbox) {
      applyTaxCheckbox.addEventListener('change', () => this.render());
    }

    this.initialized = true;
  }

  render(state = null) {
    this.init();

    const amountInput = document.getElementById('rates-simulate-amount');
    const applyTaxCheckbox = document.getElementById('rates-apply-tax');
    
    if (!amountInput) return;
    
    const simulateAmount = parseFloat(amountInput.value) || 0;
    const applyTax = applyTaxCheckbox ? applyTaxCheckbox.checked : true;
    const taxRate = 0.30; // Flat tax 30%

    // 1. Render Regulated rates
    const regulatedContainer = document.getElementById('regulated-rates-list');
    if (regulatedContainer) {
      regulatedContainer.innerHTML = '';
    }
    
    const chartLabels = [];
    const chartEarnings = [];
    const chartColors = [];

    this.interestRatesData.regulated.forEach(item => {
      const principal = Math.min(item.limit, simulateAmount);
      const earnings = principal * (item.rate / 100);
      
      const row = document.createElement('div');
      row.className = 'finance-item-row';
      
      row.innerHTML = `
        <div class="finance-item-info">
          <div class="finance-item-icon savings">
            <i class="fa-solid fa-building-shield"></i>
          </div>
          <div class="finance-item-details">
            <span class="finance-item-name">${item.name}</span>
            <span class="finance-item-meta" style="max-width: 320px;">Taux : <strong>${item.rate.toFixed(2)}% net</strong> • Plafond : ${formatMoney(item.limit)}<br>${item.description}</span>
          </div>
        </div>
        <div class="finance-item-value-area" style="text-align: right; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span style="font-size:0.75rem; color:var(--text-muted);">Intérêts (1 an)</span>
          <span class="finance-item-value positive">+ ${formatMoney(earnings)}</span>
        </div>
      `;
      if (regulatedContainer) regulatedContainer.appendChild(row);
      
      chartLabels.push(item.name.split(' ')[0]);
      chartEarnings.push(earnings);
      chartColors.push('rgba(6, 182, 212, 0.65)'); // Cyan
    });

    // 2. Render Commercial rates
    const commercialContainer = document.getElementById('commercial-rates-list');
    if (commercialContainer) {
      commercialContainer.innerHTML = '';
    }

    this.interestRatesData.commercial.forEach(item => {
      let blendedRate = item.rate;
      if (item.promoRate && item.promoDuration) {
        blendedRate = (item.promoRate * (item.promoDuration / 12)) + (item.rate * ((12 - item.promoDuration) / 12));
      }
      
      const displayRate = applyTax ? blendedRate * (1 - taxRate) : blendedRate;
      const principal = Math.min(item.limit, simulateAmount);
      const earnings = principal * (displayRate / 100);
      
      const row = document.createElement('div');
      row.className = 'finance-item-row';
      
      let rateBadgeText = `${blendedRate.toFixed(2)}% brut`;
      if (item.promoRate) {
        rateBadgeText = `${item.promoRate.toFixed(2)}% (3m) puis ${item.rate.toFixed(2)}%`;
      }
      
      row.innerHTML = `
        <div class="finance-item-info">
          <div class="finance-item-icon investment">
            <i class="fa-solid fa-percent"></i>
          </div>
          <div class="finance-item-details">
            <span class="finance-item-name">${item.name}</span>
            <span class="finance-item-meta" style="max-width: 320px;">Taux : <strong>${rateBadgeText}</strong> ${applyTax ? `• Net : <strong>${displayRate.toFixed(2)}%</strong>` : ''}<br>${item.description}</span>
          </div>
        </div>
        <div class="finance-item-value-area" style="text-align: right; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span style="font-size:0.75rem; color:var(--text-muted);">${applyTax ? 'Intérêts nets' : 'Intérêts bruts'}</span>
          <span class="finance-item-value positive">+ ${formatMoney(earnings)}</span>
        </div>
      `;
      if (commercialContainer) commercialContainer.appendChild(row);
      
      chartLabels.push(item.name.split(' ')[0] === 'Distingo' ? 'Distingo' : item.name.split(' ')[0] + ' ' + (item.name.split(' ')[1] || ''));
      chartEarnings.push(earnings);
      chartColors.push('rgba(157, 78, 221, 0.65)'); // Purple
    });

    // 3. Render Comparison Chart
    const ctx = document.getElementById('ratesComparisonChart');
    if (!ctx) return;
    
    if (this.ratesComparisonChartInstance) {
      this.ratesComparisonChartInstance.destroy();
    }
    
    this.ratesComparisonChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartEarnings,
          backgroundColor: chartColors,
          borderColor: chartColors.map(c => c.replace('0.65', '1.0')),
          borderWidth: 1.5,
          borderRadius: 6
        }]
      },
      options: {
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
              display: false
            },
            ticks: {
              color: '#f3f4f6',
              font: {
                family: 'Inter',
                size: 10
              }
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 10
              }
            }
          }
        }
      }
    });
  }
}

export const RatesModule = new RatesModuleClass();
