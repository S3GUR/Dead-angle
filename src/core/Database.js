/* global Dexie */

export class WinkDatabase {
  constructor() {
    this.db = new Dexie('WinkDatabase');
    this.db.version(1).stores({
      settings: 'key',
      projects: 'id',
      finances: 'id',
      recurringFlows: 'id',
      payslips: 'id',
      games: 'id, appId',
      animes: 'id, malId',
      activities: 'id',
      systemLogs: 'id'
    });
  }

  async init() {
    await this.db.open();
  }

  // Generic helpers
  async getAll(table) {
    return await this.db[table].toArray();
  }

  async put(table, item) {
    return await this.db[table].put(item);
  }

  async bulkPut(table, items) {
    return await this.db[table].bulkPut(items);
  }

  async delete(table, id) {
    return await this.db[table].delete(id);
  }

  async clearTable(table) {
    return await this.db[table].clear();
  }

  // Load complete state for in-memory sync if needed
  async loadState() {
    const projects = await this.getAll('projects');
    const finances = await this.getAll('finances');
    const payslips = await this.getAll('payslips');
    const recurringFlows = await this.getAll('recurringFlows');
    const games = await this.getAll('games');
    const animes = await this.getAll('animes');
    const activities = await this.getAll('activities');
    const systemLogs = await this.getAll('systemLogs');
    
    // Load settings key-value entries
    const settingsArray = await this.getAll('settings');
    const settings = {};
    settingsArray.forEach(item => {
      settings[item.key] = item.value;
    });

    return {
      projects,
      finances,
      payslips,
      recurringFlows,
      games,
      animes,
      activities,
      systemLogs,
      settings
    };
  }

  // Save complete state (for backups/restores)
  async saveState(state) {
    await this.db.transaction('rw', 
      [this.db.projects, this.db.finances, this.db.payslips, this.db.recurringFlows, this.db.games, this.db.animes, this.db.activities, this.db.systemLogs, this.db.settings], 
      async () => {
        // Clear tables
        await this.db.projects.clear();
        await this.db.finances.clear();
        await this.db.payslips.clear();
        await this.db.recurringFlows.clear();
        await this.db.games.clear();
        await this.db.animes.clear();
        await this.db.activities.clear();
        await this.db.systemLogs.clear();
        await this.db.settings.clear();

        // Write new items
        if (state.projects) await this.db.projects.bulkPut(state.projects);
        if (state.finances) await this.db.finances.bulkPut(state.finances);
        if (state.payslips) await this.db.payslips.bulkPut(state.payslips);
        if (state.recurringFlows) await this.db.recurringFlows.bulkPut(state.recurringFlows);
        if (state.games) await this.db.games.bulkPut(state.games);
        if (state.animes) await this.db.animes.bulkPut(state.animes);
        if (state.activities) await this.db.activities.bulkPut(state.activities);
        if (state.systemLogs) await this.db.systemLogs.bulkPut(state.systemLogs);

        // Settings metadata
        const settingsToSave = [
          { key: 'steamConfig', value: state.steamConfig || { apiKey: '', steamId: '' } },
          { key: 'enabledModules', value: state.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true } }
        ];
        await this.db.settings.bulkPut(settingsToSave);
      }
    );
  }

  // Save a specific table cleanly and efficiently
  async saveTable(table, items) {
    if (!items) return;
    await this.db[table].clear();
    if (items.length > 0) {
      await this.db[table].bulkPut(items);
    }
  }

  async saveSettings(state) {
    const settingsToSave = [
      { key: 'steamConfig', value: state.steamConfig || { apiKey: '', steamId: '' } },
      { key: 'enabledModules', value: state.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true } }
    ];
    await this.db.settings.bulkPut(settingsToSave);
  }
}
