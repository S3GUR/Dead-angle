import { StateCoordinator } from '../core/StateCoordinator.js';

class SettingsModuleClass {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Bind backup/restore buttons
    const exportBtn = document.getElementById('export-data-btn');
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());

    const importTriggerBtn = document.getElementById('import-data-trigger-btn');
    const importFileInput = document.getElementById('import-data-file');

    if (importTriggerBtn && importFileInput) {
      importTriggerBtn.addEventListener('click', () => {
        importFileInput.click();
      });

      importFileInput.addEventListener('change', (e) => this.handleDataImport(e));
    }

    // Reset app
    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetData());
    }

    // Clear logs
    const clearLogsBtn = document.getElementById('clear-logs-btn');
    if (clearLogsBtn) {
      clearLogsBtn.addEventListener('click', () => this.clearLogs());
    }

    this.initialized = true;
  }

  render(state) {
    this.init();

    // Render system logs console
    const logsContainer = document.getElementById('system-logs-console');
    if (logsContainer) {
      logsContainer.innerHTML = '';
      if (!state.systemLogs || state.systemLogs.length === 0) {
        logsContainer.innerHTML = '<span class="log-entry info">[INFO] Aucun log disponible. Base de données saine.</span>';
      } else {
        state.systemLogs.forEach(log => {
          const entry = document.createElement('span');
          entry.className = `log-entry ${log.type === 'proxy-error' || log.type === 'steam-import-error' ? 'error' : 'warn'}`;
          const dateStr = new Date(log.timestamp).toLocaleTimeString('fr-FR');
          entry.innerText = `[${dateStr}] [${log.type.toUpperCase()}] ${log.message} ${log.details ? `(${log.details})` : ''}`;
          logsContainer.appendChild(entry);
        });
      }
    }

    // Render toggles
    this.renderModuleToggles(state);
  }

  renderModuleToggles(state) {
    const toggleFinances = document.getElementById('module-toggle-finances');
    const togglePayslips = document.getElementById('module-toggle-payslips');
    const toggleGaming = document.getElementById('module-toggle-games');
    const toggleAnimes = document.getElementById('module-toggle-animes');

    const toggleCalendar = document.getElementById('module-toggle-calendar');

    const config = state.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true };

    if (toggleFinances) {
      toggleFinances.checked = config.finances !== false;
      toggleFinances.onchange = (e) => this.updateModuleToggle('finances', e.target.checked);
    }
    if (togglePayslips) {
      togglePayslips.checked = config.payslips !== false;
      togglePayslips.onchange = (e) => this.updateModuleToggle('payslips', e.target.checked);
    }
    if (toggleGaming) {
      toggleGaming.checked = config.games !== false;
      toggleGaming.onchange = (e) => this.updateModuleToggle('games', e.target.checked);
    }
    if (toggleAnimes) {
      toggleAnimes.checked = config.animes !== false;
      toggleAnimes.onchange = (e) => this.updateModuleToggle('animes', e.target.checked);
    }
    if (toggleCalendar) {
      toggleCalendar.checked = config.calendar !== false;
      toggleCalendar.onchange = (e) => this.updateModuleToggle('calendar', e.target.checked);
    }
  }

  async updateModuleToggle(moduleKey, isChecked) {
    await StateCoordinator.updateState(state => {
      if (!state.enabledModules) state.enabledModules = {};
      state.enabledModules[moduleKey] = isChecked;
    }, ['enabledModules']);
    
    // Update navigation sidebar immediately
    this.updateNavigationModules(StateCoordinator.state);
  }

  updateNavigationModules(state) {
    const config = state.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true };
    
    const tabs = {
      finances: document.querySelector('.nav-item[data-tab="finances"]'),
      payslips: document.querySelector('.nav-item[data-tab="payslips"]'),
      games: document.querySelector('.nav-item[data-tab="games"]'),
      animes: document.querySelector('.nav-item[data-tab="animes"]'),
      calendar: document.querySelector('.nav-item[data-tab="calendar"]')
    };

    Object.keys(tabs).forEach(key => {
      const el = tabs[key];
      if (el) {
        if (config[key] === false) {
          el.style.display = 'none';
        } else {
          el.style.display = 'flex';
        }
      }
    });
  }

  exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(StateCoordinator.state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `wink_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  handleDataImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const importedState = JSON.parse(evt.target.result);
        
        // Basic validation
        if (importedState.projects && importedState.finances && importedState.payslips) {
          await StateCoordinator.db.saveState(importedState);
          await StateCoordinator.syncFromDatabase();
          alert("Importation réussie ! Vos données ont été restaurées.");
          
          // Switch to dashboard
          const activeTab = document.querySelector('.nav-item.active');
          const activeTabId = activeTab ? activeTab.getAttribute('data-tab') : 'dashboard';
          // Force refresh
          window.location.reload();
        } else {
          alert("Format de fichier invalide. Assurez-vous d'importer un fichier JSON valide généré par Wink.");
        }
      } catch (err) {
        alert("Erreur de lecture du fichier : " + err.message);
      }
    };
    reader.readAsText(file);
  }

  async resetData() {
    if (confirm("ATTENTION : Cette action supprimera définitivement l'ensemble de vos projets et données financières de ce navigateur. Voulez-vous continuer ?")) {
      localStorage.removeItem('wink_state');
      localStorage.removeItem('wink_state_backup');
      await StateCoordinator.resetData();
      alert("L'application a été réinitialisée.");
      window.location.reload();
    }
  }

  async clearLogs() {
    await StateCoordinator.clearTable('systemLogs');
    alert("Les logs d'erreurs ont été effacés.");
  }
}

export const SettingsModule = new SettingsModuleClass();
