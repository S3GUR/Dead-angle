import { formatMoney } from '../core/Utils.js';

class DashboardModuleClass {
  constructor() {
    this.financialDistributionChartInstance = null;
  }

  render(state) {
    // Calcul de la valeur nette (fortune brute)
    const netWorth = state.finances.reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);
    const netWorthEl = document.getElementById('stat-net-worth');
    if (netWorthEl) netWorthEl.innerText = formatMoney(netWorth);

    // Projet Actifs (en cours)
    const activeProjectsCount = state.projects.filter(p => p.status === 'in-progress').length;
    const notStartedProjectsCount = state.projects.filter(p => p.status === 'not-started').length;
    const activeProjectsEl = document.getElementById('stat-active-projects');
    if (activeProjectsEl) activeProjectsEl.innerText = activeProjectsCount;
    
    const projectsCompletionEl = document.getElementById('stat-projects-completion');
    if (projectsCompletionEl) projectsCompletionEl.innerText = `${notStartedProjectsCount} non commencé(s)`;

    // Temps total
    const totalHours = state.projects.reduce((acc, curr) => acc + parseFloat(curr.timeSpent || 0), 0);
    const totalHoursEl = document.getElementById('stat-total-hours');
    if (totalHoursEl) totalHoursEl.innerText = `${totalHours.toFixed(1)} h`;

    // Épargne totale (comptes épargne + investissements)
    const savingsAmount = state.finances
      .filter(f => f.type === 'savings' || f.type === 'investment')
      .reduce((acc, curr) => acc + parseFloat(curr.balance || 0), 0);
    
    const savingsEl = document.getElementById('stat-savings');
    if (savingsEl) savingsEl.innerText = formatMoney(savingsAmount);
    
    const savingsPercentage = netWorth > 0 ? ((savingsAmount / netWorth) * 100).toFixed(0) : 0;
    const savingsPercentageEl = document.getElementById('stat-savings-percentage');
    if (savingsPercentageEl) savingsPercentageEl.innerText = `${savingsPercentage}% du patrimoine total`;

    // Trend calculation simple mock (diff vs last pay slips)
    const worthTrendEl = document.getElementById('stat-worth-trend');
    if (worthTrendEl) {
      if (state.payslips && state.payslips.length > 0) {
        const lastNetPay = parseFloat(state.payslips[0].net || 0);
        const pct = netWorth > 0 ? ((lastNetPay / netWorth) * 100).toFixed(1) : 0;
        worthTrendEl.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> +${pct}%`;
        worthTrendEl.className = "stat-trend up";
      } else {
        worthTrendEl.innerHTML = `<i class="fa-solid fa-minus"></i> stable`;
        worthTrendEl.className = "stat-trend";
      }
    }

    // Render activity list
    const activityContainer = document.getElementById('dashboard-activity-list');
    if (activityContainer) {
      activityContainer.innerHTML = '';
      
      if (!state.activities || state.activities.length === 0) {
        activityContainer.innerHTML = '<div class="text-muted" style="font-size:0.85rem; text-align:center; padding:12px;">Aucune activité récente.</div>';
      } else {
        state.activities.slice(0, 5).forEach(act => {
          const item = document.createElement('div');
          item.className = `activity-item ${act.type}`;
          
          const iconClass = act.type === 'project' ? 'fa-list-check' : 'fa-wallet';
          
          item.innerHTML = `
            <div class="activity-dot">
              <i class="fa-solid ${iconClass}"></i>
            </div>
            <div class="activity-details">
              <span class="activity-text">${act.text}</span>
              <span class="activity-time">${act.time}</span>
            </div>
          `;
          activityContainer.appendChild(item);
        });
      }
    }

    // Load distribution charts
    this.renderCharts(state);
  }

  renderCharts(state) {
    const ctx = document.getElementById('financialDistributionChart');
    if (!ctx) return;

    if (this.financialDistributionChartInstance) {
      this.financialDistributionChartInstance.destroy();
      this.financialDistributionChartInstance = null;
    }

    // Group finances by categories
    const categories = { bank: 0, savings: 0, investment: 0, asset: 0, other: 0 };
    state.finances.forEach(item => {
      if (categories[item.type] !== undefined) {
        categories[item.type] += parseFloat(item.balance || 0);
      } else {
        categories.other += parseFloat(item.balance || 0);
      }
    });

    const labels = ['Comptes courants', 'Épargne récurrente', 'Investissements', 'Biens matériels', 'Autres'];
    const data = [categories.bank, categories.savings, categories.investment, categories.asset, categories.other];

    const total = data.reduce((a, b) => a + b, 0);
    if (total === 0) {
      const canvasCtx = ctx.getContext('2d');
      canvasCtx.clearRect(0, 0, ctx.width, ctx.height);
      canvasCtx.fillStyle = '#9ca3af';
      canvasCtx.font = '13px Inter';
      canvasCtx.textAlign = 'center';
      canvasCtx.textBaseline = 'middle';
      canvasCtx.fillText('Aucun actif à analyser', ctx.clientWidth / 2, ctx.clientHeight / 2);
      return;
    }
    const backgroundColors = [
      'rgba(6, 182, 212, 0.65)',  // Cyan
      'rgba(16, 185, 129, 0.65)', // Green
      'rgba(157, 78, 221, 0.65)', // Purple
      'rgba(245, 158, 11, 0.65)',  // Orange/Amber
      'rgba(107, 114, 128, 0.65)'  // Gray
    ];
    const borderColors = [
      '#06b6d4',
      '#10b981',
      '#9d4edd',
      '#f59e0b',
      '#6b7280'
    ];

    this.financialDistributionChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverOffset: 12
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#f3f4f6',
              font: {
                family: 'Inter',
                size: 11
              },
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(10, 9, 22, 0.95)',
            titleColor: '#fff',
            bodyColor: '#f3f4f6',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: function(context) {
                let value = context.raw || 0;
                return ' ' + context.label + ' : ' + formatMoney(value);
              }
            }
          }
        },
        cutout: '65%'
      }
    });
  }
}

export const DashboardModule = new DashboardModuleClass();
