import { WinkDatabase } from './Database.js';

class StateCoordinatorClass {
  constructor() {
    this.db = new WinkDatabase();
    this.state = {};
    this.listeners = [];
    this.defaultState = {
      projects: [],
      finances: [],
      payslips: [],
      recurringFlows: [
        {
          id: 'flow-1',
          name: 'Salaire CDI',
          amount: 2200,
          frequency: 'monthly',
          type: 'income',
          category: 'Salaire'
        },
        {
          id: 'flow-2',
          name: 'Loyer Appartement',
          amount: 750,
          frequency: 'monthly',
          type: 'expense',
          category: 'Logement'
        },
        {
          id: 'flow-3',
          name: 'Abonnement Netflix',
          amount: 19.99,
          frequency: 'monthly',
          type: 'expense',
          category: 'Loisirs'
        }
      ],
      steamConfig: { apiKey: '', steamId: '' },
      games: [
        {
          id: 'game-1',
          name: 'Counter-Strike 2',
          appId: '730',
          playtime: 1250,
          peakElo: '15,400 ELO (Premier)',
          achievementsUnlocked: 1,
          achievementsTotal: 1,
          type: 'multi',
          category: 'FPS'
        },
        {
          id: 'game-2',
          name: 'Elden Ring',
          appId: '1245620',
          playtime: 145,
          peakElo: 'Boss de Fin Battu (100%)',
          achievementsUnlocked: 36,
          achievementsTotal: 42,
          type: 'solo',
          category: 'Action RPG'
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
      ],
      enabledModules: {
        finances: true,
        payslips: true,
        games: true,
        animes: true,
        calendar: true
      },
      animes: [
        {
          id: 'anime-1',
          name: 'Death Note',
          malId: '1535',
          image: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
          episodesWatched: 37,
          episodesTotal: 37,
          rating: 9,
          status: 'completed',
          type: 'TV'
        },
        {
          id: 'anime-2',
          name: 'Sousou no Frieren',
          malId: '52991',
          image: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
          episodesWatched: 12,
          episodesTotal: 28,
          rating: 10,
          status: 'watching',
          type: 'TV'
        }
      ],
      systemLogs: []
    };
  }

  async init() {
    await this.db.init();
    await this.migrateFromLocalStorage();
    await this.syncFromDatabase();
  }

  // LocalStorage to IndexedDB migration logic
  async migrateFromLocalStorage() {
    const saved = localStorage.getItem('wink_state');
    if (saved) {
      try {
        console.log("Migration des données de LocalStorage vers IndexedDB en cours...");
        const legacyState = JSON.parse(saved);
        
        // Save complete state to database
        await this.db.saveState({
          ...this.defaultState,
          ...legacyState
        });

        // Backup legacy state just in case and remove from active key
        localStorage.setItem('wink_state_backup', saved);
        localStorage.removeItem('wink_state');
        console.log("Migration réussie. wink_state transféré vers IndexedDB et sauvegardé sous wink_state_backup.");
      } catch (e) {
        console.error("Erreur lors de la migration du LocalStorage :", e);
      }
    }
  }

  // Sync in-memory state with IndexedDB
  async syncFromDatabase() {
    const dbData = await this.db.loadState();
    
    // Fallback to default state if database is empty
    if (
      dbData.projects.length === 0 &&
      dbData.finances.length === 0 &&
      dbData.payslips.length === 0 &&
      dbData.games.length === 0 &&
      dbData.animes.length === 0
    ) {
      console.log("Base de données vide. Initialisation avec le DEFAULT_STATE...");
      await this.db.saveState(this.defaultState);
      this.state = JSON.parse(JSON.stringify(this.defaultState));
    } else {
      this.state = {
        projects: dbData.projects || [],
        finances: dbData.finances || [],
        payslips: dbData.payslips || [],
        recurringFlows: dbData.recurringFlows || [],
        games: dbData.games || [],
        animes: dbData.animes || [],
        activities: dbData.activities || [],
        systemLogs: dbData.systemLogs || [],
        steamConfig: dbData.settings.steamConfig || { apiKey: '', steamId: '' },
        enabledModules: dbData.settings.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true }
      };
    }
  }

  // Pub/Sub pattern to notify modules of state updates
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Mutation helpers
  async updateState(mutationFn, tablesToSave = null) {
    try {
      mutationFn(this.state);
      if (tablesToSave && Array.isArray(tablesToSave)) {
        for (const table of tablesToSave) {
          if (table === 'steamConfig' || table === 'enabledModules') {
            await this.db.saveSettings(this.state);
          } else {
            await this.db.saveTable(table, this.state[table]);
          }
        }
      } else {
        await this.db.saveState(this.state);
      }
      this.notify();
    } catch (err) {
      alert("Erreur de base de données (updateState):\n" + err.message + "\n" + err.stack);
      console.error(err);
      throw err;
    }
  }

  async putItem(table, item) {
    await this.db.put(table, item);
    await this.syncFromDatabase();
    this.notify();
  }

  async deleteItem(table, id) {
    await this.db.delete(table, id);
    await this.syncFromDatabase();
    this.notify();
  }

  async clearTable(table) {
    await this.db.clearTable(table);
    await this.syncFromDatabase();
    this.notify();
  }

  async resetData() {
    await this.db.saveState(this.defaultState);
    await this.syncFromDatabase();
    this.notify();
  }

  logActivity(type, text) {
    const newActivity = {
      id: 'act-' + Date.now(),
      type: type,
      text: text,
      time: 'À l\'instant'
    };
    this.state.activities.unshift(newActivity);
    if (this.state.activities.length > 10) {
      this.state.activities.pop();
    }
    this.putItem('activities', newActivity);
  }

  async logSystemError(type, message, details = '') {
    const newLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      type: type,
      message: message,
      details: String(details)
    };
    this.state.systemLogs.unshift(newLog);
    if (this.state.systemLogs.length > 50) {
      this.state.systemLogs.pop();
    }
    await this.putItem('systemLogs', newLog);
  }
}

export const StateCoordinator = new StateCoordinatorClass();
