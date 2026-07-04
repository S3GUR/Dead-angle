/* global Dexie */

export class DeadAngleDatabase {
  constructor() {
    this.db = new Dexie('DeadAngleDatabase');
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
    this.db.version(2).stores({
      settings: 'key',
      projects: 'id',
      finances: 'id',
      recurringFlows: 'id',
      payslips: 'id',
      games: 'id, appId',
      animes: 'id, malId',
      activities: 'id',
      systemLogs: 'id',
      dayNotes: '&date, content'
    });
    this.db.version(3).stores({
      settings: 'key',
      projects: 'id',
      finances: 'id',
      recurringFlows: 'id',
      payslips: 'id',
      games: 'id, appId',
      animes: 'id, malId',
      activities: 'id',
      systemLogs: 'id',
      dayNotes: '&date, content',
      newsArticles: '&id, country, agentType, fetchedAt'
    });
    this.db.version(4).stores({
      settings: 'key',
      projects: 'id',
      finances: 'id',
      recurringFlows: 'id',
      payslips: 'id',
      games: 'id, appId',
      animes: 'id, malId',
      activities: 'id',
      systemLogs: 'id',
      dayNotes: '&date, content',
      newsArticles: '&id, country, agentType, fetchedAt',
      appointments: 'id, title, date, time, duration, location, notes'
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
    const dayNotes = await this.getAll('dayNotes');
    const newsArticles = await this.getAll('newsArticles');
    const appointments = await this.getAll('appointments');
    
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
      settings,
      dayNotes,
      newsArticles,
      appointments
    };
  }

  // Save complete state (for backups/restores)
  async saveState(state) {
    await this.db.transaction('rw', 
      [this.db.projects, this.db.finances, this.db.payslips, this.db.recurringFlows, this.db.games, this.db.animes, this.db.activities, this.db.systemLogs, this.db.settings, this.db.dayNotes, this.db.newsArticles, this.db.appointments], 
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
        await this.db.dayNotes.clear();
        await this.db.newsArticles.clear();
        await this.db.appointments.clear();

        // Write new items
        if (state.projects) await this.db.projects.bulkPut(state.projects);
        if (state.finances) await this.db.finances.bulkPut(state.finances);
        if (state.payslips) await this.db.payslips.bulkPut(state.payslips);
        if (state.recurringFlows) await this.db.recurringFlows.bulkPut(state.recurringFlows);
        if (state.games) await this.db.games.bulkPut(state.games);
        if (state.animes) await this.db.animes.bulkPut(state.animes);
        if (state.activities) await this.db.activities.bulkPut(state.activities);
        if (state.systemLogs) await this.db.systemLogs.bulkPut(state.systemLogs);
        if (state.dayNotes) await this.db.dayNotes.bulkPut(state.dayNotes);
        if (state.newsArticles) await this.db.newsArticles.bulkPut(state.newsArticles);
        if (state.appointments) await this.db.appointments.bulkPut(state.appointments);

        // Settings metadata
        const settingsToSave = [
          { key: 'steamConfig', value: state.steamConfig || { apiKey: '', steamId: '' } },
          { key: 'enabledModules', value: state.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true, news: true } },
          { key: 'malUsername', value: state.malUsername || '' },
          { key: 'settings', value: state.settings || { syncAnimeReleases: false } }
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
      { key: 'enabledModules', value: state.enabledModules || { finances: true, payslips: true, games: true, animes: true, calendar: true, news: true } },
      { key: 'malUsername', value: state.malUsername || '' },
      { key: 'settings', value: state.settings || { syncAnimeReleases: false } }
    ];
    await this.db.settings.bulkPut(settingsToSave);
  }
}
