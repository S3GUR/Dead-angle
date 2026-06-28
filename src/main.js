import { StateCoordinator } from './core/StateCoordinator.js';
import { DashboardModule } from './modules/DashboardModule.js';
import { ProjectsModule } from './modules/ProjectsModule.js';
import { FinanceModule } from './modules/FinanceModule.js';
import { PayslipsModule } from './modules/PayslipsModule.js';
import { RatesModule } from './modules/RatesModule.js';
import { GamingModule } from './modules/GamingModule.js';
import { AnimesModule } from './modules/AnimesModule.js';
import { SettingsModule } from './modules/SettingsModule.js';
import { CalendarModule } from './modules/CalendarModule.js';

const tabConfigs = {
  dashboard: {
    title: "Tableau de Bord",
    subtitle: "Voici l'état d'avancement général de votre vie",
    btnText: "Nouveau Projet",
    btnAction: () => ProjectsModule.openProjectModal()
  },
  projects: {
    title: "Gestion de Projets",
    subtitle: "Vos objectifs personnels, barres de progression et investissement temporel",
    btnText: "Ajouter un Projet",
    btnAction: () => ProjectsModule.openProjectModal()
  },
  finances: {
    title: "Finances & Patrimoine",
    subtitle: "Épargne, investissements, comptes bancaires et possessions matérielles",
    btnText: "Ajouter un Actif",
    btnAction: () => {
      if (FinanceModule.currentFinanceCategory === 'flows') {
        FinanceModule.openFlowModal();
      } else {
        FinanceModule.openFinanceModal();
      }
    }
  },
  payslips: {
    title: "Mes Fiches de Paie",
    subtitle: "Historique de vos salaires et relevés de revenus récurrents",
    btnText: "Enregistrer une Paie",
    btnAction: () => PayslipsModule.openPayslipModal()
  },
  rates: {
    title: "Comparateur d'Épargne & Taux",
    subtitle: "Simulez vos placements et découvrez les meilleurs rendements des banques françaises"
  },
  games: {
    title: "Suivi Gaming & Steam",
    subtitle: "Suivez votre temps de jeu, vos pics d'Elo, vos succès et synchronisez-vous à Steam",
    btnText: "Ajouter un Jeu",
    btnAction: () => GamingModule.openGameModal()
  },
  animes: {
    title: "Suivi d'Animes & MyAnimeList",
    subtitle: "Suivez vos visionnages d'animes, votre progression et importez votre liste MyAnimeList",
    btnText: "Ajouter un Anime",
    btnAction: () => AnimesModule.openAnimeModal()
  },
  settings: {
    title: "Paramètres & Données",
    subtitle: "Sauvegardez vos données localement ou importez un fichier externe",
    btnText: "Exporter les Données",
    btnAction: () => SettingsModule.exportData()
  },
  calendar: {
    title: "Calendrier de Vie",
    subtitle: "Planifiez les tâches de vos projets sur votre calendrier interactif",
    btnText: "Planifier une tâche",
    btnAction: () => CalendarModule.openScheduleModal()
  }
};

function switchTab(tabId) {
  const state = StateCoordinator.state;
  if (state.enabledModules && state.enabledModules[tabId] === false) {
    switchTab('dashboard');
    return;
  }

  // Update active class on nav
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.getAttribute('data-tab') === tabId) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });

  // Update active panel
  const tabPanels = document.querySelectorAll('.tab-panel');
  tabPanels.forEach(panel => {
    if (panel.id === `tab-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  // Update Header Content
  const config = tabConfigs[tabId];
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const headerActionBtn = document.getElementById('header-action-btn');

  if (config && pageTitle && pageSubtitle) {
    pageTitle.innerText = config.title;
    pageSubtitle.innerText = config.subtitle;
    
    // Update action button
    if (headerActionBtn) {
      if (tabId === 'rates' || tabId === 'settings') {
        headerActionBtn.style.display = 'none';
      } else {
        headerActionBtn.style.display = 'inline-flex';
        headerActionBtn.querySelector('span').innerText = config.btnText;
        
        headerActionBtn.onclick = config.btnAction;
      }
    }
  }

  // Render the specific view
  refreshActiveView(tabId, state);
}

function refreshActiveView(tabId, state) {
  switch (tabId) {
    case 'dashboard':
      DashboardModule.render(state);
      break;
    case 'projects':
      ProjectsModule.render(state);
      break;
    case 'finances':
      FinanceModule.render(state);
      break;
    case 'payslips':
      PayslipsModule.render(state);
      break;
    case 'rates':
      RatesModule.render(state);
      break;
    case 'games':
      GamingModule.render(state);
      break;
    case 'animes':
      AnimesModule.render(state);
      break;
    case 'settings':
      // Pre-fill Steam config on render
      const keyInput = document.getElementById('steam-api-key');
      const idInput = document.getElementById('steam-user-id');
      if (keyInput) keyInput.value = state.steamConfig?.apiKey || '';
      if (idInput) idInput.value = state.steamConfig?.steamId || '';
      SettingsModule.render(state);
      break;
    case 'calendar':
      CalendarModule.render(state);
      break;
  }
}

// App Initialization
window.addEventListener('DOMContentLoaded', async () => {
  console.log("Démarrage de l'application Wink...");
  
  // Initialise database and load state
  await StateCoordinator.init();

  // Bind side-nav items clicks
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });



  // Bind state updates to refresh the active tab UI automatically
  StateCoordinator.subscribe(state => {
    SettingsModule.updateNavigationModules(state);

    const activeItem = document.querySelector('.nav-item.active');
    if (activeItem) {
      const activeTabId = activeItem.getAttribute('data-tab');
      refreshActiveView(activeTabId, state);
    }
  });

  // Initial tab loading
  SettingsModule.updateNavigationModules(StateCoordinator.state);
  switchTab('dashboard');
});
