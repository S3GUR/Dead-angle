// Wink Application Logic
// Stored in J:\Wink\app.js

document.addEventListener('DOMContentLoaded', () => {
  // Default/Initial mock data
  const DEFAULT_STATE = {
    projects: [
      {
        id: 'proj-1',
        name: 'Aménager le bureau de mes rêves',
        description: 'Acheter un bureau assis-debout, installer des étagères et un éclairage LED personnalisé pour optimiser ma productivité.',
        status: 'in-progress',
        progress: 33,
        timeSpent: 12.0,
        deadline: '2026-08-15',
        budget: 1200,
        tasks: [
          { id: 't1', name: 'Acheter un bureau assis-debout', completed: true, priority: 'high' },
          { id: 't2', name: 'Installer des étagères', completed: false, priority: 'medium' },
          { id: 't3', name: 'Configurer l\'éclairage LED', completed: false, priority: 'low' }
        ]
      },
      {
        id: 'proj-2',
        name: 'Créer un tracker personnel (Wink)',
        description: 'Développer une interface web élégante en verre dépoli (glassmorphism) pour centraliser le suivi des projets de vie et de mon patrimoine financier.',
        status: 'in-progress',
        progress: 67,
        timeSpent: 24.5,
        deadline: '2026-07-10',
        budget: 0,
        tasks: [
          { id: 't4', name: 'Établir la maquette visuelle', completed: true, priority: 'high' },
          { id: 't5', name: 'Développer le HTML et le CSS', completed: true, priority: 'medium' },
          { id: 't6', name: 'Écrire la logique JS et connecter le LocalStorage', completed: false, priority: 'high' }
        ]
      },
      {
        id: 'proj-3',
        name: 'Objectif Semi-Marathon',
        description: 'Programme de course de 12 semaines pour courir 21km sous la barre symbolique des 2 heures. Achat de chaussures neuves inclus.',
        status: 'not-started',
        progress: 50,
        timeSpent: 4.0,
        deadline: '2026-10-18',
        budget: 150,
        tasks: [
          { id: 't7', name: 'Trouver un plan d\'entraînement', completed: true, priority: 'high' },
          { id: 't8', name: 'Acheter de nouvelles baskets', completed: false, priority: 'medium' }
        ]
      }
    ],
    finances: [
      {
        id: 'fin-1',
        name: 'Compte Courant Boursorama',
        type: 'bank',
        balance: 1845.20,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fin-2',
        name: 'Livret A (Épargne Secours)',
        type: 'savings',
        balance: 8500.00,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fin-3',
        name: 'Portefeuille Actions (PEA)',
        type: 'investment',
        balance: 3200.00,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'fin-4',
        name: 'Setup Informatique (PC & Écrans)',
        type: 'asset',
        balance: 2200.00,
        lastUpdated: new Date().toISOString()
      }
    ],
    payslips: [
      {
        id: 'pay-1',
        month: 'Mai',
        year: 2026,
        employer: 'Alpha Solutions Corp',
        gross: 3450.00,
        net: 2680.00,
        tax: 195.00,
        hours: 151.67
      },
      {
        id: 'pay-2',
        month: 'Avril',
        year: 2026,
        employer: 'Alpha Solutions Corp',
        gross: 3450.00,
        net: 2680.00,
        tax: 195.00,
        hours: 151.67
      }
    ],
    recurringFlows: [
      {
        id: 'flow-1',
        name: 'Salaire CDI',
        type: 'inflow',
        amount: 2680.00,
        frequency: 'monthly'
      },
      {
        id: 'flow-2',
        name: 'Loyer & Charges',
        type: 'outflow',
        amount: 750.00,
        frequency: 'monthly'
      },
      {
        id: 'flow-3',
        name: 'Abonnement Netflix',
        type: 'outflow',
        amount: 13.49,
        frequency: 'monthly'
      },
      {
        id: 'flow-4',
        name: 'Assurance Voiture',
        type: 'outflow',
        amount: 450.00,
        frequency: 'yearly'
      },
      {
        id: 'flow-5',
        name: 'Freelancing Mobile App',
        type: 'inflow',
        amount: 150.00,
        frequency: 'weekly'
      }
    ],
    steamConfig: {
      apiKey: "",
      steamId: ""
    },
    games: [
      {
        id: 'game-1',
        name: 'Counter-Strike 2',
        appId: '730',
        playtime: 1250,
        peakElo: '15,400 ELO (Premier)',
        achievementsUnlocked: 1,
        achievementsTotal: 1
      },
      {
        id: 'game-2',
        name: 'Elden Ring',
        appId: '1245620',
        playtime: 145,
        peakElo: 'Boss de Fin Battu (100%)',
        achievementsUnlocked: 36,
        achievementsTotal: 42
      }
    ],
    activities: [
      {
        id: 'act-1',
        type: 'project',
        text: "Création du projet 'Créer un tracker personnel (Wink)'",
        time: 'Il y a 2 jours'
      },
      {
        id: 'act-2',
        type: 'finance',
        text: "Ajout du compte 'Compte Courant Boursorama'",
        time: 'Il y a 3 jours'
      },
      {
        id: 'act-3',
        type: 'finance',
        text: "Fiche de paie de Mai enregistrée",
        time: 'Il y a 5 jours'
      }
    ]
  };

  // State initialization
  let state = {};
  
  // Charts tracker instances
  let financialDistributionChartInstance = null;
  let financeBreakdownChartInstance = null;
  let ratesComparisonChartInstance = null;

  // Load from local storage or set default
  function loadState() {
    const saved = localStorage.getItem('wink_state');
    if (saved) {
      try {
        state = JSON.parse(saved);
        if (!state.recurringFlows) {
          state.recurringFlows = JSON.parse(JSON.stringify(DEFAULT_STATE.recurringFlows));
        }
        if (!state.games) {
          state.games = JSON.parse(JSON.stringify(DEFAULT_STATE.games));
        }
        if (!state.steamConfig) {
          state.steamConfig = { apiKey: "", steamId: "" };
        }
        state.projects.forEach(p => {
          if (!p.tasks) p.tasks = [];
        });
      } catch (e) {
        console.error("Erreur de lecture du localStorage, chargement des données par défaut", e);
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      }
    } else {
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveState();
    }
  }

  function saveState() {
    localStorage.setItem('wink_state', JSON.stringify(state));
  }

  function logActivity(type, text) {
    const newActivity = {
      id: 'act-' + Date.now(),
      type: type,
      text: text,
      time: 'À l\'instant'
    };
    state.activities.unshift(newActivity);
    // Keep max 10 activities
    if (state.activities.length > 10) {
      state.activities.pop();
    }
    saveState();
  }

  // --- Helper utility for money formatting
  function formatMoney(amount) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  }

  // ==============================================
  // NAVIGATION & VIEW SWITCHING
  // ==============================================
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanels = document.querySelectorAll('.tab-panel');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const headerActionBtn = document.getElementById('header-action-btn');

  const tabConfigs = {
    dashboard: {
      title: "Tableau de Bord",
      subtitle: "Voici l'état d'avancement général de votre vie",
      btnText: "Nouveau Projet",
      btnAction: () => openProjectModal()
    },
    projects: {
      title: "Gestion de Projets",
      subtitle: "Vos objectifs personnels, barres de progression et investissement temporel",
      btnText: "Ajouter un Projet",
      btnAction: () => openProjectModal()
    },
    finances: {
      title: "Finances & Patrimoine",
      subtitle: "Épargne, investissements, comptes bancaires et possessions matérielles",
      btnText: "Ajouter un Actif",
      btnAction: () => openFinanceModal()
    },
    payslips: {
      title: "Mes Fiches de Paie",
      subtitle: "Historique de vos salaires et relevés de revenus récurrents",
      btnText: "Enregistrer une Paie",
      btnAction: () => openPayslipModal()
    },
    rates: {
      title: "Comparateur d'Épargne & Taux",
      subtitle: "Simulez vos placements et découvrez les meilleurs rendements des banques françaises",
      btnText: "Nouveau Projet",
      btnAction: () => openProjectModal()
    },
    games: {
      title: "Suivi Gaming & Steam",
      subtitle: "Suivez votre temps de jeu, vos pics d'Elo, vos succès et synchronisez-vous à Steam",
      btnText: "Ajouter un Jeu",
      btnAction: () => openGameModal()
    },
    settings: {
      title: "Paramètres & Données",
      subtitle: "Sauvegardez vos données localement ou importez un fichier externe",
      btnText: "Exporter les Données",
      btnAction: () => exportData()
    }
  };

  function switchTab(tabId) {
    // Update active class on nav
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update active panel
    tabPanels.forEach(panel => {
      if (panel.id === `tab-${tabId}`) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    // Update Header Content
    const config = tabConfigs[tabId];
    if (config) {
      pageTitle.innerText = config.title;
      pageSubtitle.innerText = config.subtitle;
      
      // Update action button
      if (headerActionBtn) {
        if (tabId === 'rates' || tabId === 'settings') {
          headerActionBtn.style.display = 'none';
        } else {
          headerActionBtn.style.display = 'inline-flex';
          headerActionBtn.querySelector('span').innerText = config.btnText;
          // Unbind old events and bind new
          const newBtn = headerActionBtn.cloneNode(true);
          headerActionBtn.parentNode.replaceChild(newBtn, headerActionBtn);
          document.getElementById('header-action-btn').addEventListener('click', config.btnAction);
        }
      }
    }

    // Refresh view data
    refreshView(tabId);
  }

  // Bind side-nav items
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // Default header button listener
  if (headerActionBtn) {
    headerActionBtn.addEventListener('click', () => openProjectModal());
  }

  // ==============================================
  // VIEW RENDERERS
  // ==============================================
  function refreshView(tabId) {
    loadState();
    
    switch (tabId) {
      case 'dashboard':
        renderDashboard();
        break;
      case 'projects':
        renderProjects();
        break;
      case 'finances':
        renderFinances();
        break;
      case 'payslips':
        renderPayslips();
        break;
      case 'rates':
        renderRates();
        break;
      case 'games':
        renderGames();
        break;
      case 'settings':
        // Pre-fill Steam config on render
        const keyInput = document.getElementById('steam-api-key');
        const idInput = document.getElementById('steam-user-id');
        if (keyInput) keyInput.value = state.steamConfig ? (state.steamConfig.apiKey || '') : '';
        if (idInput) idInput.value = state.steamConfig ? (state.steamConfig.steamId || '') : '';
        break;
    }
  }

  // 1. DASHBOARD VIEW
  function renderDashboard() {
    // Calcul de la valeur nette (fortune brute)
    const netWorth = state.finances.reduce((acc, curr) => acc + parseFloat(curr.balance), 0);
    document.getElementById('stat-net-worth').innerText = formatMoney(netWorth);

    // Projet Actifs (en cours)
    const activeProjectsCount = state.projects.filter(p => p.status === 'in-progress').length;
    const notStartedProjectsCount = state.projects.filter(p => p.status === 'not-started').length;
    document.getElementById('stat-active-projects').innerText = activeProjectsCount;
    document.getElementById('stat-projects-completion').innerText = `${notStartedProjectsCount} non commencé(s)`;

    // Temps total
    const totalHours = state.projects.reduce((acc, curr) => acc + parseFloat(curr.timeSpent || 0), 0);
    document.getElementById('stat-total-hours').innerText = `${totalHours.toFixed(1)} h`;

    // Épargne totale (comptes épargne + investissements)
    const savingsAmount = state.finances
      .filter(f => f.type === 'savings' || f.type === 'investment')
      .reduce((acc, curr) => acc + parseFloat(curr.balance), 0);
    document.getElementById('stat-savings').innerText = formatMoney(savingsAmount);
    
    const savingsPercentage = netWorth > 0 ? ((savingsAmount / netWorth) * 100).toFixed(0) : 0;
    document.getElementById('stat-savings-percentage').innerText = `${savingsPercentage}% du patrimoine total`;

    // Trend calculation simple mock (diff vs last pay slips)
    if (state.payslips.length > 0) {
      const lastNetPay = parseFloat(state.payslips[0].net);
      const pct = netWorth > 0 ? ((lastNetPay / netWorth) * 100).toFixed(1) : 0;
      document.getElementById('stat-worth-trend').innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> +${pct}%`;
      document.getElementById('stat-worth-trend').className = "stat-trend up";
    } else {
      document.getElementById('stat-worth-trend').innerHTML = `<i class="fa-solid fa-minus"></i> stable`;
      document.getElementById('stat-worth-trend').className = "stat-trend";
    }

    // Render activity list
    const activityContainer = document.getElementById('dashboard-activity-list');
    activityContainer.innerHTML = '';
    
    if (state.activities.length === 0) {
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

    // Load distribution charts
    renderDashboardCharts();
  }

  // 2. PROJECTS VIEW
  let currentProjectFilter = 'all';
  const filterTags = document.querySelectorAll('.filter-tag');
  
  filterTags.forEach(tag => {
    tag.addEventListener('click', (e) => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentProjectFilter = tag.getAttribute('data-filter');
      renderProjects();
    });
  });

  document.getElementById('add-project-btn-view').addEventListener('click', () => openProjectModal());

  function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    let filtered = state.projects;
    if (currentProjectFilter !== 'all') {
      filtered = state.projects.filter(p => p.status === currentProjectFilter);
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-panel empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-list-check"></i>
          <p class="empty-state-title">Aucun projet trouvé</p>
          <p class="empty-state-desc">Commencez par ajouter un nouveau projet personnel ou professionnel pour suivre votre avancement.</p>
          <button class="glass-button primary" onclick="document.getElementById('add-project-btn-view').click()">
            Créer un projet
          </button>
        </div>
      `;
      return;
    }

    filtered.forEach(proj => {
      const card = document.createElement('div');
      card.className = 'glass-panel project-card';
      
      const statusLabels = {
        'not-started': 'Non commencé',
        'in-progress': 'En cours',
        'on-hold': 'En pause',
        'completed': 'Terminé'
      };

      const deadlineText = proj.deadline ? new Date(proj.deadline).toLocaleDateString('fr-FR', {month: 'short', day: 'numeric', year: 'numeric'}) : 'Sans limite';
      const budgetText = proj.budget > 0 ? formatMoney(proj.budget) : 'Aucun';
      const completedTasks = proj.tasks ? proj.tasks.filter(t => t.completed).length : 0;
      const totalTasks = proj.tasks ? proj.tasks.length : 0;

      card.innerHTML = `
        <div class="project-card-header">
          <div>
            <h4 class="project-title">${proj.name}</h4>
            <p class="project-desc" title="${proj.description || ''}">${proj.description || 'Aucune description fournie.'}</p>
          </div>
          <span class="status-badge ${proj.status}">${statusLabels[proj.status]}</span>
        </div>

        <div class="project-progress-area">
          <div class="progress-info">
            <span>Progression</span>
            <span>${proj.progress}%</span>
          </div>
          <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${proj.progress}%"></div>
          </div>
        </div>

        <div class="project-details-mini">
          <div class="detail-item">
            <i class="fa-regular fa-clock"></i>
            <span>Temps : <strong class="hours-val">${proj.timeSpent || 0} h</strong></span>
          </div>
          <div class="detail-item">
            <i class="fa-solid fa-euro-sign"></i>
            <span>Budget : <strong>${budgetText}</strong></span>
          </div>
          <div class="detail-item" style="grid-column: span 2;">
            <i class="fa-regular fa-calendar-check"></i>
            <span>Échéance : <strong>${deadlineText}</strong></span>
          </div>
        </div>

        <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center;">
          <button class="card-tasks-toggle-btn" data-id="${proj.id}">
            <i class="fa-solid fa-chevron-down"></i>
            <span>Tâches (${completedTasks}/${totalTasks})</span>
          </button>
        </div>
        <div class="card-tasks-wrapper" id="tasks-wrapper-${proj.id}">
          <!-- Tasks list loaded dynamically below -->
        </div>

        <div class="project-card-footer" style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
          <!-- Quick hours update UI -->
          <div class="time-spent-input-group">
            <button class="time-spent-btn dec-hours-btn" data-id="${proj.id}">-</button>
            <span style="font-size:0.78rem; color:var(--text-muted); padding: 0 4px;">Heures</span>
            <button class="time-spent-btn inc-hours-btn" data-id="${proj.id}">+</button>
          </div>

          <div class="project-actions">
            <button class="action-btn edit-proj-btn" data-id="${proj.id}" title="Modifier">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="action-btn delete delete-proj-btn" data-id="${proj.id}" title="Supprimer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);

      // Render tasks in wrapper
      const tasksWrapper = card.querySelector(`#tasks-wrapper-${proj.id}`);
      if (proj.tasks && proj.tasks.length > 0) {
        proj.tasks.forEach(task => {
          const taskRow = document.createElement('div');
          taskRow.className = `card-task-row ${task.completed ? 'completed' : ''}`;
          taskRow.innerHTML = `
            <label class="card-task-label">
              <input type="checkbox" class="card-task-checkbox" data-proj-id="${proj.id}" data-task-id="${task.id}" ${task.completed ? 'checked' : ''}>
              <span>${task.name}</span>
            </label>
            <span class="priority-dot ${task.priority}" title="Priorité : ${task.priority}"></span>
          `;
          tasksWrapper.appendChild(taskRow);
        });
      } else {
        tasksWrapper.innerHTML = `<div style="font-size:0.75rem; color:var(--text-dark); text-align:center; padding:8px;">Aucune tâche définie.</div>`;
      }
    });

    // Add listeners to inside elements
    container.querySelectorAll('.inc-hours-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        adjustProjectHours(id, 1);
      });
    });

    container.querySelectorAll('.dec-hours-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        adjustProjectHours(id, -1);
      });
    });

    container.querySelectorAll('.edit-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openProjectModal(id);
      });
    });

    container.querySelectorAll('.delete-proj-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteProject(id);
      });
    });

    // Toggle tasks list expand
    container.querySelectorAll('.card-tasks-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const wrapper = container.querySelector(`#tasks-wrapper-${id}`);
        const icon = e.currentTarget.querySelector('i');
        
        wrapper.classList.toggle('expanded');
        if (wrapper.classList.contains('expanded')) {
          icon.className = 'fa-solid fa-chevron-up';
        } else {
          icon.className = 'fa-solid fa-chevron-down';
        }
      });
    });

    // Checkbox toggle handler
    container.querySelectorAll('.card-task-checkbox').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const projId = e.target.getAttribute('data-proj-id');
        const taskId = e.target.getAttribute('data-task-id');
        const checked = e.target.checked;
        
        toggleCardTask(projId, taskId, checked);
      });
    });
  }

  function adjustProjectHours(id, amount) {
    const projIndex = state.projects.findIndex(p => p.id === id);
    if (projIndex !== -1) {
      const current = parseFloat(state.projects[projIndex].timeSpent || 0);
      const updated = Math.max(0, current + amount);
      state.projects[projIndex].timeSpent = updated;
      saveState();
      
      // Dynamic inline update of the specific card hours without full reload to prevent visual flicker
      refreshView(document.querySelector('.nav-item.active').getAttribute('data-tab'));
    }
  }

  // 3. FINANCES VIEW
  let currentFinanceCategory = 'all';
  const financeCategoryButtons = document.querySelectorAll('.finance-nav-btn');

  financeCategoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      financeCategoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFinanceCategory = btn.getAttribute('data-category');
      renderFinances();
    });
  });

  document.getElementById('add-finance-btn').addEventListener('click', () => {
    if (currentFinanceCategory === 'flows') {
      openFlowModal();
    } else {
      openFinanceModal();
    }
  });

  function renderFinances() {
    const container = document.getElementById('finances-container');
    container.innerHTML = '';

    // Calcul Total Right Panel (toujours calculer en premier pour maintenir le solde à jour)
    const totalAssets = state.finances.reduce((acc, curr) => acc + parseFloat(curr.balance), 0);
    document.getElementById('total-assets-value').innerText = formatMoney(totalAssets);

    const addBtn = document.getElementById('add-finance-btn');
    if (currentFinanceCategory === 'flows') {
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter un flux';
    } else {
      addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Ajouter un actif';
    }

    if (currentFinanceCategory === 'flows') {
      renderRecurringFlows(container);
      return;
    }

    let filtered = state.finances;
    if (currentFinanceCategory !== 'all') {
      filtered = state.finances.filter(f => f.type === currentFinanceCategory);
    }

    // Asset icons
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
      // Mise à jour / destruction du graphique car pas de données
      renderFinanceCharts();
      return;
    }

    // Render list
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

    // Bind event handlers
    container.querySelectorAll('.edit-fin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openFinanceModal(id);
      });
    });

    container.querySelectorAll('.delete-fin-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteFinanceItem(id);
      });
    });

    // Render breakdown chart
    renderFinanceCharts();
  }

  function renderRecurringFlows(container) {
    container.innerHTML = '';
    
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
    
    // Render each flow
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
    
    // Bind listeners
    container.querySelectorAll('.edit-flow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        openFlowModal(id);
      });
    });
    
    container.querySelectorAll('.delete-flow-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteFlow(id);
      });
    });
  }

  // 4. PAYSLIPS VIEW
  document.getElementById('add-payslip-btn').addEventListener('click', () => openPayslipModal());

  function renderPayslips() {
    const container = document.getElementById('payslips-container');
    container.innerHTML = '';

    if (state.payslips.length === 0) {
      container.innerHTML = `
        <div class="glass-panel empty-state" style="grid-column: 1 / -1;">
          <i class="fa-solid fa-file-invoice-dollar"></i>
          <p class="empty-state-title">Aucune fiche de paie</p>
          <p class="empty-state-desc">Consignez vos revenus récurrents et suivez le montant net perçu pour estimer vos rentrées d'argent mensuelles.</p>
          <button class="glass-button primary" onclick="document.getElementById('add-payslip-btn').click()">
            Enregistrer une paie
          </button>
        </div>
      `;
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
        deletePayslip(id);
      });
    });
  }

  // ==============================================
  // CHARTS IMPLEMENTATION (CHART.JS)
  // ==============================================
  function renderDashboardCharts() {
    const ctx = document.getElementById('financialDistributionChart');
    if (!ctx) return;

    if (financialDistributionChartInstance) {
      financialDistributionChartInstance.destroy();
      financialDistributionChartInstance = null;
    }

    // Group finances by categories
    const categories = { bank: 0, savings: 0, investment: 0, asset: 0, other: 0 };
    state.finances.forEach(item => {
      if (categories[item.type] !== undefined) {
        categories[item.type] += parseFloat(item.balance);
      } else {
        categories.other += parseFloat(item.balance);
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

    financialDistributionChartInstance = new Chart(ctx, {
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

  function renderFinanceCharts() {
    const ctx = document.getElementById('financeBreakdownChart');
    if (!ctx) return;

    if (financeBreakdownChartInstance) {
      financeBreakdownChartInstance.destroy();
      financeBreakdownChartInstance = null;
    }

    const categories = { bank: 0, savings: 0, investment: 0, asset: 0, other: 0 };
    state.finances.forEach(item => {
      if (categories[item.type] !== undefined) {
        categories[item.type] += parseFloat(item.balance);
      } else {
        categories.other += parseFloat(item.balance);
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

    financeBreakdownChartInstance = new Chart(ctx, {
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
        indexAxis: 'y', // Horizontal bars
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

  // ==============================================
  // MODALS & FORMS MANAGEMENT
  // ==============================================
  
  // -- Project Modals
  const projectModal = document.getElementById('project-modal');
  const projectForm = document.getElementById('project-form');
  let modalTasks = [];
  
  function openProjectModal(id = null) {
    projectForm.reset();
    document.getElementById('project-id').value = '';
    document.getElementById('project-modal-title').innerText = "Créer un nouveau projet";
    modalTasks = [];
    
    if (id) {
      const proj = state.projects.find(p => p.id === id);
      if (proj) {
        document.getElementById('project-id').value = proj.id;
        document.getElementById('project-name').value = proj.name;
        document.getElementById('project-desc').value = proj.description || '';
        document.getElementById('project-status').value = proj.status;
        document.getElementById('project-progress').value = proj.progress;
        document.getElementById('project-time-spent').value = proj.timeSpent || 0;
        document.getElementById('project-budget').value = proj.budget || 0;
        document.getElementById('project-deadline').value = proj.deadline || '';
        document.getElementById('project-modal-title').innerText = "Modifier le projet";
        
        modalTasks = proj.tasks ? [ ...proj.tasks ] : [];
      }
    }
    renderModalTasks();
    projectModal.classList.add('active');
  }

  function closeProjectModal() {
    projectModal.classList.remove('active');
  }

  document.getElementById('close-project-modal').addEventListener('click', closeProjectModal);
  document.getElementById('cancel-project-modal').addEventListener('click', closeProjectModal);

  function renderModalTasks() {
    const container = document.getElementById('modal-tasks-container');
    container.innerHTML = '';
    
    if (modalTasks.length === 0) {
      container.innerHTML = `<div style="font-size:0.8rem; color:var(--text-dark); text-align:center; padding:10px;">Aucune tâche créée pour ce projet.</div>`;
      return;
    }
    
    modalTasks.forEach((task, idx) => {
      const row = document.createElement('div');
      row.className = 'modal-task-item';
      
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="priority-dot ${task.priority}"></span>
          <span style="${task.completed ? 'text-decoration:line-through; color:var(--text-dark);' : ''}">${task.name}</span>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <input type="checkbox" class="modal-task-chk" data-index="${idx}" ${task.completed ? 'checked' : ''} style="cursor:pointer;">
          <button type="button" class="action-btn delete remove-modal-task-btn" data-index="${idx}">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
      container.appendChild(row);
    });
    
    // Bind modal checkbox change
    container.querySelectorAll('.modal-task-chk').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'));
        modalTasks[idx].completed = e.target.checked;
        renderModalTasks();
      });
    });

    // Bind modal task remove
    container.querySelectorAll('.remove-modal-task-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.getAttribute('data-index'));
        modalTasks.splice(idx, 1);
        renderModalTasks();
      });
    });
  }

  document.getElementById('add-task-to-project-btn').addEventListener('click', () => {
    const taskNameInput = document.getElementById('new-task-name');
    const prioritySelect = document.getElementById('new-task-priority');
    const name = taskNameInput.value.trim();
    const priority = prioritySelect.value;
    
    if (name) {
      modalTasks.push({
        id: 't-' + Date.now(),
        name,
        completed: false,
        priority
      });
      taskNameInput.value = '';
      prioritySelect.value = 'medium';
      renderModalTasks();
    }
  });
  
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('project-id').value;
    const name = document.getElementById('project-name').value.trim();
    const description = document.getElementById('project-desc').value.trim();
    const status = document.getElementById('project-status').value;
    let progress = parseInt(document.getElementById('project-progress').value) || 0;
    const timeSpent = parseFloat(document.getElementById('project-time-spent').value) || 0;
    const budget = parseFloat(document.getElementById('project-budget').value) || 0;
    const deadline = document.getElementById('project-deadline').value;

    if (modalTasks.length > 0) {
      const completedCount = modalTasks.filter(t => t.completed).length;
      progress = Math.round((completedCount / modalTasks.length) * 100);
    }

    if (id) {
      // Edit
      const idx = state.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        state.projects[idx] = { ...state.projects[idx], name, description, status, progress, timeSpent, budget, deadline, tasks: modalTasks };
        logActivity('project', `Projet '${name}' mis à jour.`);
      }
    } else {
      // Add
      const newProj = {
        id: 'proj-' + Date.now(),
        name,
        description,
        status,
        progress,
        timeSpent,
        budget,
        deadline,
        tasks: modalTasks
      };
      state.projects.push(newProj);
      logActivity('project', `Projet '${name}' créé.`);
    }

    saveState();
    closeProjectModal();
    refreshView('projects');
  });

  function deleteProject(id) {
    const proj = state.projects.find(p => p.id === id);
    if (proj && confirm(`Voulez-vous vraiment supprimer le projet "${proj.name}" ?`)) {
      state.projects = state.projects.filter(p => p.id !== id);
      logActivity('project', `Projet '${proj.name}' supprimé.`);
      saveState();
      refreshView('projects');
    }
  }

  function toggleCardTask(projId, taskId, checked) {
    const projIdx = state.projects.findIndex(p => p.id === projId);
    if (projIdx !== -1) {
      const taskIdx = state.projects[projIdx].tasks.findIndex(t => t.id === taskId);
      if (taskIdx !== -1) {
        state.projects[projIdx].tasks[taskIdx].completed = checked;
        
        // Recalculate progress automatically
        const tasks = state.projects[projIdx].tasks;
        const completedCount = tasks.filter(t => t.completed).length;
        state.projects[projIdx].progress = Math.round((completedCount / tasks.length) * 100);
        
        saveState();
        refreshView('projects');
      }
    }
  }

  // -- Finance Modals
  const financeModal = document.getElementById('finance-modal');
  const financeForm = document.getElementById('finance-form');

  function openFinanceModal(id = null) {
    financeForm.reset();
    document.getElementById('finance-id').value = '';
    document.getElementById('finance-modal-title').innerText = "Ajouter un élément financier";

    if (id) {
      const item = state.finances.find(f => f.id === id);
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

  function closeFinanceModal() {
    financeModal.classList.remove('active');
  }

  document.getElementById('close-finance-modal').addEventListener('click', closeFinanceModal);
  document.getElementById('cancel-finance-modal').addEventListener('click', closeFinanceModal);

  financeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('finance-id').value;
    const name = document.getElementById('finance-name').value.trim();
    const type = document.getElementById('finance-type').value;
    const balance = parseFloat(document.getElementById('finance-balance').value) || 0;

    if (id) {
      // Edit
      const idx = state.finances.findIndex(f => f.id === id);
      if (idx !== -1) {
        state.finances[idx] = { ...state.finances[idx], name, type, balance, lastUpdated: new Date().toISOString() };
        logActivity('finance', `Solde de '${name}' mis à jour.`);
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
      logActivity('finance', `Actif financier '${name}' ajouté.`);
    }

    saveState();
    closeFinanceModal();
    refreshView('finances');
  });

  function deleteFinanceItem(id) {
    const item = state.finances.find(f => f.id === id);
    if (item && confirm(`Voulez-vous vraiment retirer l'actif "${item.name}" ?`)) {
      state.finances = state.finances.filter(f => f.id !== id);
      logActivity('finance', `Retrait de l'actif '${item.name}'.`);
      saveState();
      refreshView('finances');
    }
  }

  // -- Payslip Modals
  const payslipModal = document.getElementById('payslip-modal');
  const payslipForm = document.getElementById('payslip-form');

  function openPayslipModal(id = null) {
    payslipForm.reset();
    document.getElementById('payslip-id').value = '';
    // Set default month to current
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const currentMonth = months[new Date().getMonth()];
    document.getElementById('payslip-month').value = currentMonth;
    document.getElementById('payslip-year').value = new Date().getFullYear();

    payslipModal.classList.add('active');
  }

  function closePayslipModal() {
    payslipModal.classList.remove('active');
  }

  document.getElementById('close-payslip-modal').addEventListener('click', closePayslipModal);
  document.getElementById('cancel-payslip-modal').addEventListener('click', closePayslipModal);

  payslipForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const month = document.getElementById('payslip-month').value;
    const year = parseInt(document.getElementById('payslip-year').value);
    const employer = document.getElementById('payslip-employer').value.trim();
    const gross = parseFloat(document.getElementById('payslip-gross').value) || 0;
    const net = parseFloat(document.getElementById('payslip-net').value) || 0;
    const tax = parseFloat(document.getElementById('payslip-tax').value) || 0;
    const hours = parseFloat(document.getElementById('payslip-hours').value) || 151.67;

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
    state.payslips.unshift(newPayslip); // newest payslip first
    logActivity('finance', `Fiche de paie de ${month} ${year} (${employer}) enregistrée.`);
    
    saveState();
    closePayslipModal();
    refreshView('payslips');
  });

  function deletePayslip(id) {
    const pay = state.payslips.find(p => p.id === id);
    if (pay && confirm(`Retirer la fiche de paie de ${pay.month} ${pay.year} ?`)) {
      state.payslips = state.payslips.filter(p => p.id !== id);
      logActivity('finance', `Fiche de paie de ${pay.month} ${pay.year} retirée.`);
      saveState();
      refreshView('payslips');
    }
  }

  // ==============================================
  // BACKUP / IMPORT & EXPORT
  // ==============================================
  function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wink_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  document.getElementById('export-data-btn').addEventListener('click', exportData);

  const importTriggerBtn = document.getElementById('import-data-trigger-btn');
  const importFileInput = document.getElementById('import-data-file');

  importTriggerBtn.addEventListener('click', () => {
    importFileInput.click();
  });

  importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(evt) {
      try {
        const importedState = JSON.parse(evt.target.result);
        
        // Validation check
        if (importedState.projects && importedState.finances && importedState.payslips) {
          state = importedState;
          saveState();
          alert("Importation réussie ! Vos données ont été mises à jour.");
          refreshView(document.querySelector('.nav-item.active').getAttribute('data-tab'));
        } else {
          alert("Format de fichier invalide. Assurez-vous d'importer un fichier JSON valide généré par Wink.");
        }
      } catch (err) {
        alert("Erreur de lecture du fichier : " + err.message);
      }
    };
    reader.readAsText(file);
  });

  // Reset Application Data
  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (confirm("ATTENTION : Cette action supprimera définitivement l'ensemble de vos projets et données financières de ce navigateur. Voulez-vous continuer ?")) {
      localStorage.removeItem('wink_state');
      state = JSON.parse(JSON.stringify(DEFAULT_STATE));
      saveState();
      alert("L'application a été réinitialisée.");
      refreshView(document.querySelector('.nav-item.active').getAttribute('data-tab'));
    }
  });

  // -- Recurring Flow Modals
  const flowModal = document.getElementById('flow-modal');
  const flowForm = document.getElementById('flow-form');

  function openFlowModal(id = null) {
    flowForm.reset();
    document.getElementById('flow-id').value = '';
    document.getElementById('flow-modal-title').innerText = "Ajouter un flux récurrent";

    if (id) {
      const flow = state.recurringFlows.find(f => f.id === id);
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

  function closeFlowModal() {
    flowModal.classList.remove('active');
  }

  document.getElementById('close-flow-modal').addEventListener('click', closeFlowModal);
  document.getElementById('cancel-flow-modal').addEventListener('click', closeFlowModal);

  flowForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('flow-id').value;
    const name = document.getElementById('flow-name').value.trim();
    const type = document.getElementById('flow-type').value;
    const frequency = document.getElementById('flow-frequency').value;
    const amount = parseFloat(document.getElementById('flow-amount').value) || 0;

    if (!state.recurringFlows) {
      state.recurringFlows = [];
    }

    if (id) {
      // Edit
      const idx = state.recurringFlows.findIndex(f => f.id === id);
      if (idx !== -1) {
        state.recurringFlows[idx] = { ...state.recurringFlows[idx], name, type, frequency, amount };
        logActivity('finance', `Flux récurrent '${name}' mis à jour.`);
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
      logActivity('finance', `Flux récurrent '${name}' enregistré.`);
    }

    saveState();
    closeFlowModal();
    refreshView('finances');
  });

  function deleteFlow(id) {
    const flow = state.recurringFlows.find(f => f.id === id);
    if (flow && confirm(`Voulez-vous vraiment retirer le flux récurrent "${flow.name}" ?`)) {
      state.recurringFlows = state.recurringFlows.filter(f => f.id !== id);
      logActivity('finance', `Retrait du flux récurrent '${flow.name}'.`);
      saveState();
      refreshView('finances');
    }
  }

  const INTEREST_RATES_DATA = {
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

  function renderRates() {
    const amountInput = document.getElementById('rates-simulate-amount');
    const applyTaxCheckbox = document.getElementById('rates-apply-tax');
    
    if (!amountInput) return;
    
    const simulateAmount = parseFloat(amountInput.value) || 0;
    const applyTax = applyTaxCheckbox ? applyTaxCheckbox.checked : true;
    const taxRate = 0.30; // Flat tax 30% (12.8% impôt + 17.2% prélèvements sociaux)

    // 1. Render Regulated rates
    const regulatedContainer = document.getElementById('regulated-rates-list');
    regulatedContainer.innerHTML = '';
    
    const chartLabels = [];
    const chartEarnings = [];
    const chartColors = [];

    INTEREST_RATES_DATA.regulated.forEach(item => {
      // Calculate earnings (up to limit)
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
      regulatedContainer.appendChild(row);
      
      chartLabels.push(item.name.split(' ')[0]); // short name
      chartEarnings.push(earnings);
      chartColors.push('rgba(6, 182, 212, 0.65)'); // Cyan
    });

    // 2. Render Commercial rates
    const commercialContainer = document.getElementById('commercial-rates-list');
    commercialContainer.innerHTML = '';

    INTEREST_RATES_DATA.commercial.forEach(item => {
      // Blended rate over 1 year
      let blendedRate = item.rate;
      if (item.promoRate && item.promoDuration) {
        blendedRate = (item.promoRate * (item.promoDuration / 12)) + (item.rate * ((12 - item.promoDuration) / 12));
      }
      
      // Calculate net rate if tax is checked
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
      commercialContainer.appendChild(row);
      
      chartLabels.push(item.name.split(' ')[0] === 'Distingo' ? 'Distingo' : item.name.split(' ')[0] + ' ' + (item.name.split(' ')[1] || ''));
      chartEarnings.push(earnings);
      chartColors.push('rgba(157, 78, 221, 0.65)'); // Purple
    });

    // 3. Render Comparison Chart
    const ctx = document.getElementById('ratesComparisonChart');
    if (!ctx) return;
    
    if (ratesComparisonChartInstance) {
      ratesComparisonChartInstance.destroy();
    }
    
    ratesComparisonChartInstance = new Chart(ctx, {
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

  // Bind rates inputs
  const simulateInput = document.getElementById('rates-simulate-amount');
  const applyTaxCheckbox = document.getElementById('rates-apply-tax');
  if (simulateInput) {
    simulateInput.addEventListener('input', renderRates);
  }
  if (applyTaxCheckbox) {
    applyTaxCheckbox.addEventListener('change', renderRates);
  }

  // ==============================================
  // GAMING TAB RENDER & CONTROL ENGINE
  // ==============================================
  function renderGames() {
    const gamesGrid = document.getElementById('games-grid');
    if (!gamesGrid) return;
    
    gamesGrid.innerHTML = '';
    
    // Check if Steam sync button should be shown
    const syncSteamBtn = document.getElementById('sync-steam-btn');
    if (syncSteamBtn) {
      if (state.steamConfig && state.steamConfig.apiKey && state.steamConfig.steamId) {
        syncSteamBtn.style.display = 'inline-flex';
      } else {
        syncSteamBtn.style.display = 'none';
      }
    }

    if (!state.games || state.games.length === 0) {
      gamesGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: span 3; padding: 40px; text-align: center;">
          <i class="fa-solid fa-gamepad text-muted" style="font-size: 3rem; margin-bottom: 16px; display:block;"></i>
          <p class="text-muted" style="font-size: 1rem; margin-bottom: 20px;">Aucun jeu dans votre bibliothèque. Commencez à ajouter vos jeux préférés ou connectez votre compte Steam !</p>
          <button class="glass-button primary" onclick="openGameModal()"><i class="fa-solid fa-plus"></i> Ajouter mon premier jeu</button>
        </div>
      `;
      return;
    }

    state.games.forEach(game => {
      const card = document.createElement('div');
      card.className = 'glass-panel game-card';
      
      // Determine banner
      let bannerHtml = '';
      if (game.appId) {
        bannerHtml = `<img src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appId}/header.jpg" class="game-banner" alt="${game.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
      }
      bannerHtml += `
        <div class="game-banner-placeholder" style="${game.appId ? 'display:none;' : ''}">
          <i class="fa-solid fa-gamepad"></i>
        </div>
      `;

      // Achievement progress percentage
      const totalAch = parseInt(game.achievementsTotal) || 0;
      const unlockedAch = parseInt(game.achievementsUnlocked) || 0;
      const progressPercent = totalAch > 0 ? Math.round((unlockedAch / totalAch) * 100) : 0;

      card.innerHTML = `
        ${bannerHtml}
        <div class="game-stats">
          <div class="game-header-area">
            <h3 class="game-title">${game.name}</h3>
            ${game.appId ? `
              <div class="game-appid-badge">
                <i class="fa-brands fa-steam"></i> AppID: ${game.appId}
              </div>
            ` : ''}
          </div>

          <div class="game-stat-rows">
            <!-- Playtime -->
            <div class="game-stat-row">
              <span class="game-stat-label"><i class="fa-regular fa-clock"></i> Temps de jeu</span>
              <div style="display: flex; align-items: center; gap: 8px;">
                <button class="glass-button btn-small" onclick="incrementPlaytime('${game.id}', -5)" style="padding: 2px 6px; font-size: 0.8rem; height: auto;">-5h</button>
                <span class="game-stat-value">${game.playtime} hrs</span>
                <button class="glass-button btn-small" onclick="incrementPlaytime('${game.id}', 5)" style="padding: 2px 6px; font-size: 0.8rem; height: auto;">+5h</button>
              </div>
            </div>

            <!-- Peak Elo / Rank -->
            <div class="game-stat-row">
              <span class="game-stat-label"><i class="fa-solid fa-trophy"></i> Meilleur rang</span>
              <span class="game-elo-badge" title="${game.peakElo || 'N/A'}">${game.peakElo || 'Aucun rang'}</span>
            </div>

            <!-- Achievements -->
            <div style="margin-top: 4px;">
              <div class="game-stat-row">
                <span class="game-stat-label"><i class="fa-regular fa-circle-check"></i> Succès</span>
                <span class="game-stat-value" style="font-size: 0.8rem;">${unlockedAch}/${totalAch} (${progressPercent}%)</span>
              </div>
              <div class="game-achievement-bar">
                <div class="game-achievement-progress" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 10px; margin-top: 8px; border-top: 1px solid var(--border-glass); padding-top: 12px; justify-content: flex-end;">
            <button class="glass-button btn-small text-muted" onclick="openGameModal('${game.id}')" style="padding: 4px 8px; font-size:0.8rem; height: auto;">
              <i class="fa-regular fa-pen-to-square"></i> Modifier
            </button>
            <button class="glass-button btn-small danger" onclick="deleteGame('${game.id}')" style="padding: 4px 8px; font-size:0.8rem; height: auto;">
              <i class="fa-regular fa-trash-can"></i> Retirer
            </button>
          </div>
        </div>
      `;
      gamesGrid.appendChild(card);
    });
  }

  window.incrementPlaytime = function(id, amount) {
    const game = state.games.find(g => g.id === id);
    if (game) {
      game.playtime = Math.max(0, game.playtime + amount);
      saveState();
      renderGames();
    }
  };

  const gameModal = document.getElementById('game-modal');
  const gameForm = document.getElementById('game-form');

  window.openGameModal = function(id = null) {
    if (!gameModal) return;
    
    // Reset form
    gameForm.reset();
    document.getElementById('game-id').value = '';
    document.getElementById('game-modal-title').innerText = "Ajouter un Jeu";

    if (id) {
      const game = state.games.find(g => g.id === id);
      if (game) {
        document.getElementById('game-id').value = game.id;
        document.getElementById('game-name').value = game.name;
        document.getElementById('game-appid').value = game.appId || '';
        document.getElementById('game-playtime').value = game.playtime;
        document.getElementById('game-peakelo').value = game.peakElo || '';
        document.getElementById('game-achievements-unlocked').value = game.achievementsUnlocked || 0;
        document.getElementById('game-achievements-total').value = game.achievementsTotal || 0;
        document.getElementById('game-modal-title').innerText = "Modifier le Jeu";
      }
    }
    gameModal.classList.add('active');
  };

  function closeGameModal() {
    if (gameModal) gameModal.classList.remove('active');
  }

  const cancelGameModalBtn = document.getElementById('cancel-game-modal');
  const closeGameModalBtn = document.getElementById('close-game-modal');
  if (cancelGameModalBtn) cancelGameModalBtn.addEventListener('click', closeGameModal);
  if (closeGameModalBtn) closeGameModalBtn.addEventListener('click', closeGameModal);

  if (gameForm) {
    gameForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('game-id').value;
      const name = document.getElementById('game-name').value.trim();
      const appId = document.getElementById('game-appid').value.trim();
      const playtime = parseFloat(document.getElementById('game-playtime').value) || 0;
      const peakElo = document.getElementById('game-peakelo').value.trim();
      const achievementsUnlocked = parseInt(document.getElementById('game-achievements-unlocked').value) || 0;
      const achievementsTotal = parseInt(document.getElementById('game-achievements-total').value) || 0;

      if (!state.games) {
        state.games = [];
      }

      if (id) {
        // Edit
        const idx = state.games.findIndex(g => g.id === id);
        if (idx !== -1) {
          state.games[idx] = { 
            ...state.games[idx], 
            name, 
            appId, 
            playtime, 
            peakElo, 
            achievementsUnlocked, 
            achievementsTotal 
          };
          logActivity('games', `Jeu '${name}' mis à jour.`);
        }
      } else {
        // Add
        const newGame = {
          id: 'game-' + Date.now(),
          name,
          appId,
          playtime,
          peakElo,
          achievementsUnlocked,
          achievementsTotal
        };
        state.games.push(newGame);
        logActivity('games', `Jeu '${name}' ajouté à la bibliothèque.`);
      }

      saveState();
      closeGameModal();
      refreshView('games');
    });
  }

  window.deleteGame = function(id) {
    const game = state.games.find(g => g.id === id);
    if (game && confirm(`Voulez-vous vraiment retirer "${game.name}" de votre bibliothèque ?`)) {
      state.games = state.games.filter(g => g.id !== id);
      logActivity('games', `Jeu '${game.name}' retiré.`);
      saveState();
      refreshView('games');
    }
  };

  // Steam Param Saving
  const saveSteamBtn = document.getElementById('save-steam-config-btn');
  if (saveSteamBtn) {
    saveSteamBtn.addEventListener('click', () => {
      const apiKey = document.getElementById('steam-api-key').value.trim();
      const steamId = document.getElementById('steam-user-id').value.trim();

      if (!state.steamConfig) {
        state.steamConfig = {};
      }
      state.steamConfig.apiKey = apiKey;
      state.steamConfig.steamId = steamId;
      
      saveState();
      alert("Paramètres Steam enregistrés avec succès !");
      refreshView('settings');
    });
  }

  // Steam Live Sync Engine
  const syncSteamBtn = document.getElementById('sync-steam-btn');
  if (syncSteamBtn) {
    syncSteamBtn.addEventListener('click', () => {
      if (!state.steamConfig || !state.steamConfig.apiKey || !state.steamConfig.steamId) {
        alert("Veuillez renseigner votre clé API et SteamID64 dans les paramètres d'abord.");
        return;
      }

      syncSteamBtn.disabled = true;
      syncSteamBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Synchronisation...`;

      const apiKey = state.steamConfig.apiKey;
      const steamId = state.steamConfig.steamId;

      const ownedGamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&format=json`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(ownedGamesUrl)}`;

      fetch(proxyUrl)
        .then(response => {
          if (!response.ok) throw new Error("Erreur de connexion au proxy.");
          return response.json();
        })
        .then(data => {
          const result = JSON.parse(data.contents);
          if (!result.response || !result.response.games) {
            throw new Error("Aucun jeu trouvé ou profil privé.");
          }

          const steamGames = result.response.games;
          let syncCount = 0;
          const achievementPromises = [];

          state.games.forEach(game => {
            if (!game.appId) return;

            const appIdNum = parseInt(game.appId);
            const matchedSteamGame = steamGames.find(g => g.appid === appIdNum);

            if (matchedSteamGame) {
              game.playtime = Math.round((matchedSteamGame.playtime_forever || 0) / 60);
              syncCount++;

              const achievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${game.appId}`;
              const achievementsProxy = `https://api.allorigins.win/get?url=${encodeURIComponent(achievementsUrl)}`;

              const achPromise = fetch(achievementsProxy)
                .then(res => res.json())
                .then(achData => {
                  const achResult = JSON.parse(achData.contents);
                  if (achResult.playerstats && achResult.playerstats.achievements) {
                    const achievements = achResult.playerstats.achievements;
                    game.achievementsTotal = achievements.length;
                    game.achievementsUnlocked = achievements.filter(a => a.achieved === 1).length;
                  }
                })
                .catch(err => {
                  console.error(`Impossible de synchroniser les succès pour AppID ${game.appId}:`, err);
                });
              achievementPromises.push(achPromise);
            }
          });

          Promise.all(achievementPromises).then(() => {
            saveState();
            logActivity('games', `Synchronisation avec Steam terminée (${syncCount} jeux mis à jour).`);
            alert(`Synchronisation terminée ! ${syncCount} jeux ont été synchronisés.`);
            syncSteamBtn.disabled = false;
            syncSteamBtn.innerHTML = `<i class="fa-brands fa-steam"></i> Synchroniser Steam`;
            renderGames();
          });
        })
        .catch(err => {
          console.error(err);
          alert("Erreur lors de la synchronisation Steam. Vérifiez votre clé API, votre SteamID, ou si votre profil de jeux est bien configuré en 'Public'.");
          syncSteamBtn.disabled = false;
          syncSteamBtn.innerHTML = `<i class="fa-brands fa-steam"></i> Synchroniser Steam`;
        });
    });
  }

  // Initial Load
  loadState();
  renderDashboard(); // Initial tab is dashboard
});
