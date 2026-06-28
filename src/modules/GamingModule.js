import { StateCoordinator } from '../core/StateCoordinator.js';
import { fetchWithProxy } from '../core/Utils.js';

class GamingModuleClass {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Bind filters
    const gameSearch = document.getElementById('game-search');
    if (gameSearch) gameSearch.addEventListener('input', () => this.render(StateCoordinator.state));

    const filterGameType = document.getElementById('filter-game-type');
    if (filterGameType) filterGameType.addEventListener('change', () => this.render(StateCoordinator.state));

    const filterGameCategory = document.getElementById('filter-game-category');
    if (filterGameCategory) filterGameCategory.addEventListener('change', () => this.render(StateCoordinator.state));

    const sortGamesBy = document.getElementById('sort-games-by');
    if (sortGamesBy) sortGamesBy.addEventListener('change', () => this.render(StateCoordinator.state));

    // Form submit bind
    const gameForm = document.getElementById('game-form');
    if (gameForm) {
      gameForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Modal triggers
    const closeGameModalBtn = document.getElementById('close-game-modal');
    if (closeGameModalBtn) closeGameModalBtn.addEventListener('click', () => this.closeGameModal());

    const cancelGameModalBtn = document.getElementById('cancel-game-modal');
    if (cancelGameModalBtn) cancelGameModalBtn.addEventListener('click', () => this.closeGameModal());

    // Steam import modal
    const openSteamImportBtn = document.getElementById('open-steam-import-btn');
    if (openSteamImportBtn) openSteamImportBtn.addEventListener('click', () => this.openImportModal());

    const closeImportModalBtn = document.getElementById('close-import-modal');
    if (closeImportModalBtn) closeImportModalBtn.addEventListener('click', () => this.closeImportModal());

    const cancelImportModalBtn = document.getElementById('cancel-import-modal');
    if (cancelImportModalBtn) cancelImportModalBtn.addEventListener('click', () => this.closeImportModal());

    const confirmImportBtn = document.getElementById('confirm-import-btn');
    if (confirmImportBtn) confirmImportBtn.addEventListener('click', () => this.handleSteamImport());

    const syncSteamBtn = document.getElementById('sync-steam-btn');
    if (syncSteamBtn) syncSteamBtn.addEventListener('click', () => this.handleSteamSync());

    this.initialized = true;
  }

  render(state) {
    this.init();

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

    this.populateGameCategories(state);

    if (!state.games || state.games.length === 0) {
      gamesGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: span 3; padding: 40px; text-align: center;">
          <i class="fa-solid fa-gamepad text-muted" style="font-size: 3rem; margin-bottom: 16px; display:block;"></i>
          <p class="text-muted" style="font-size: 1rem; margin-bottom: 20px;">Aucun jeu dans votre bibliothèque. Commencez à ajouter vos jeux préférés ou connectez votre compte Steam !</p>
          <button class="glass-button primary" id="empty-state-add-game-btn"><i class="fa-solid fa-plus"></i> Ajouter mon premier jeu</button>
        </div>
      `;
      const btn = document.getElementById('empty-state-add-game-btn');
      if (btn) btn.addEventListener('click', () => this.openGameModal());
      return;
    }

    const searchQuery = (document.getElementById('game-search')?.value || '').toLowerCase().trim();
    const filterType = document.getElementById('filter-game-type')?.value || 'all';
    const filterCategory = document.getElementById('filter-game-category')?.value || 'all';
    const sortBy = document.getElementById('sort-games-by')?.value || 'playtime-desc';

    let filteredGames = state.games.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchQuery);
      const matchesType = filterType === 'all' || game.type === filterType;
      const matchesCategory = filterCategory === 'all' || game.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });

    filteredGames.sort((a, b) => {
      if (sortBy === 'playtime-desc') {
        return (b.playtime || 0) - (a.playtime || 0);
      } else if (sortBy === 'playtime-asc') {
        return (a.playtime || 0) - (b.playtime || 0);
      } else if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'achievements-desc') {
        const aPercent = (a.achievementsTotal || 0) > 0 ? (a.achievementsUnlocked || 0) / a.achievementsTotal : 0;
        const bPercent = (b.achievementsTotal || 0) > 0 ? (b.achievementsUnlocked || 0) / b.achievementsTotal : 0;
        return bPercent - aPercent;
      }
      return 0;
    });

    if (filteredGames.length === 0) {
      gamesGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: span 3; padding: 30px; text-align: center;">
          <p class="text-muted">Aucun jeu ne correspond à vos filtres.</p>
        </div>
      `;
      return;
    }

    filteredGames.forEach(game => {
      const card = document.createElement('div');
      card.className = 'glass-panel game-card';
      
      let bannerHtml = '';
      if (game.appId) {
        bannerHtml = `<img src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/${game.appId}/header.jpg" class="game-banner" alt="${game.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
      }
      bannerHtml += `
        <div class="game-banner-placeholder" style="${game.appId ? 'display:none;' : ''}">
          <i class="fa-solid fa-gamepad"></i>
        </div>
      `;

      const totalAch = parseInt(game.achievementsTotal) || 0;
      const unlockedAch = parseInt(game.achievementsUnlocked) || 0;
      const progressPercent = totalAch > 0 ? Math.round((unlockedAch / totalAch) * 100) : 0;

      const typeLabel = game.type === 'multi' ? 'Multi' : (game.type === 'coop' ? 'Coop' : 'Solo');
      const typeIcon = game.type === 'multi' ? 'users' : (game.type === 'coop' ? 'people-group' : 'user');

      card.innerHTML = `
        ${bannerHtml}
        <div class="game-stats">
          <div class="game-header-area">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <h3 class="game-title" title="${game.name}">${game.name}</h3>
              <span style="font-size: 0.65rem; background: rgba(255,255,255,0.08); border: 1px solid var(--border-glass); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); white-space: nowrap;">
                <i class="fa-solid fa-${typeIcon}"></i> ${typeLabel}
              </span>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
              ${game.appId ? `
                <div class="game-appid-badge" style="padding: 2px 5px; font-size: 0.65rem; background: rgba(58, 134, 200, 0.15); border-color: rgba(58, 134, 200, 0.3); color: #93c5fd;">
                  <i class="fa-brands fa-steam"></i> AppID: ${game.appId}
                </div>
              ` : ''}
              ${game.category ? `
                <div class="game-appid-badge" style="background: rgba(167, 139, 250, 0.15); border-color: rgba(167, 139, 250, 0.3); color: #c084fc; padding: 2px 5px; font-size: 0.65rem;">
                  <i class="fa-solid fa-tags"></i> ${game.category}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="game-stat-rows">
            <div class="game-stat-row">
              <span class="game-stat-label"><i class="fa-regular fa-clock"></i> Temps</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                <button class="glass-button btn-small dec-playtime-btn" data-id="${game.id}" style="padding: 1px 4px; font-size: 0.7rem; height: auto;">-5h</button>
                <span class="game-stat-value" style="font-size: 0.8rem;">${game.playtime} hrs</span>
                <button class="glass-button btn-small inc-playtime-btn" data-id="${game.id}" style="padding: 1px 4px; font-size: 0.7rem; height: auto;">+5h</button>
              </div>
            </div>

            <div class="game-stat-row">
              <span class="game-stat-label"><i class="fa-solid fa-trophy"></i> Rang</span>
              <span class="game-elo-badge" title="${game.peakElo || 'N/A'}" style="font-size: 0.75rem; padding: 2px 6px;">${game.peakElo || 'Aucun'}</span>
            </div>

            <div style="margin-top: 2px;">
              <div class="game-stat-row" style="margin-bottom: 2px;">
                <span class="game-stat-label"><i class="fa-regular fa-circle-check"></i> Succès</span>
                <span class="game-stat-value" style="font-size: 0.75rem;">${unlockedAch}/${totalAch} (${progressPercent}%)</span>
              </div>
              <div class="game-achievement-bar" style="height: 6px;">
                <div class="game-achievement-progress" style="width: ${progressPercent}%;"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 4px; border-top: 1px solid var(--border-glass); padding-top: 8px; justify-content: flex-end;">
            <button class="glass-button btn-small text-muted edit-game-card-btn" data-id="${game.id}" style="padding: 2px 6px; font-size:0.75rem; height: auto;">
              <i class="fa-regular fa-pen-to-square"></i> Modifier
            </button>
            <button class="glass-button btn-small danger delete-game-card-btn" data-id="${game.id}" style="padding: 2px 6px; font-size:0.75rem; height: auto;">
              <i class="fa-regular fa-trash-can"></i> Retirer
            </button>
          </div>
        </div>
      `;
      gamesGrid.appendChild(card);
    });

    // Bind card buttons
    gamesGrid.querySelectorAll('.dec-playtime-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.incrementPlaytime(id, -5);
      });
    });

    gamesGrid.querySelectorAll('.inc-playtime-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.incrementPlaytime(id, 5);
      });
    });

    gamesGrid.querySelectorAll('.edit-game-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openGameModal(id);
      });
    });

    gamesGrid.querySelectorAll('.delete-game-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteGame(id);
      });
    });
  }

  populateGameCategories(state) {
    const filterSelect = document.getElementById('filter-game-category');
    if (!filterSelect) return;

    const currentVal = filterSelect.value;
    
    // Collect categories
    const categories = new Set();
    if (state.games) {
      state.games.forEach(g => {
        if (g.category) categories.add(g.category.trim());
      });
    }

    filterSelect.innerHTML = '<option value="all">Toutes les catégories</option>';
    categories.forEach(cat => {
      filterSelect.innerHTML += `<option value="${cat}">${cat}</option>`;
    });

    // Restore selected value
    if (categories.has(currentVal)) {
      filterSelect.value = currentVal;
    } else {
      filterSelect.value = 'all';
    }
  }

  incrementPlaytime(id, amount) {
    StateCoordinator.updateState(state => {
      const game = state.games.find(g => g.id === id);
      if (game) {
        game.playtime = Math.max(0, game.playtime + amount);
      }
    });
  }

  openGameModal(id = null) {
    const gameModal = document.getElementById('game-modal');
    const gameForm = document.getElementById('game-form');
    if (!gameModal || !gameForm) return;
    
    gameForm.reset();
    document.getElementById('game-id').value = '';
    document.getElementById('game-type').value = 'solo';
    document.getElementById('game-category').value = '';
    document.getElementById('game-modal-title').innerText = "Ajouter un Jeu";

    if (id) {
      const game = StateCoordinator.state.games.find(g => g.id === id);
      if (game) {
        document.getElementById('game-id').value = game.id;
        document.getElementById('game-name').value = game.name;
        document.getElementById('game-appid').value = game.appId || '';
        document.getElementById('game-type').value = game.type || 'solo';
        document.getElementById('game-category').value = game.category || '';
        document.getElementById('game-playtime').value = game.playtime;
        document.getElementById('game-peakelo').value = game.peakElo || '';
        document.getElementById('game-achievements-unlocked').value = game.achievementsUnlocked || 0;
        document.getElementById('game-achievements-total').value = game.achievementsTotal || 0;
        document.getElementById('game-modal-title').innerText = "Modifier le Jeu";
      }
    }
    gameModal.classList.add('active');
  }

  closeGameModal() {
    const gameModal = document.getElementById('game-modal');
    if (gameModal) gameModal.classList.remove('active');
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('game-id').value;
    const name = document.getElementById('game-name').value.trim();
    const appId = document.getElementById('game-appid').value.trim();
    const type = document.getElementById('game-type').value;
    const category = document.getElementById('game-category').value.trim();
    const playtime = parseFloat(document.getElementById('game-playtime').value) || 0;
    const peakElo = document.getElementById('game-peakelo').value.trim();
    const achievementsUnlocked = parseInt(document.getElementById('game-achievements-unlocked').value) || 0;
    const achievementsTotal = parseInt(document.getElementById('game-achievements-total').value) || 0;

    StateCoordinator.updateState(state => {
      if (id) {
        const idx = state.games.findIndex(g => g.id === id);
        if (idx !== -1) {
          state.games[idx] = { 
            ...state.games[idx], 
            name, 
            appId, 
            type,
            category,
            playtime, 
            peakElo, 
            achievementsUnlocked, 
            achievementsTotal 
          };
          StateCoordinator.logActivity('games', `Jeu '${name}' mis à jour.`);
        }
      } else {
        const newGame = {
          id: 'game-' + Date.now(),
          name,
          appId,
          type,
          category,
          playtime,
          peakElo,
          achievementsUnlocked,
          achievementsTotal
        };
        state.games.push(newGame);
        StateCoordinator.logActivity('games', `Jeu '${name}' ajouté à la bibliothèque.`);
      }
    });

    this.closeGameModal();
  }

  deleteGame(id) {
    const game = StateCoordinator.state.games.find(g => g.id === id);
    if (game && confirm(`Voulez-vous vraiment retirer "${game.name}" de votre bibliothèque ?`)) {
      StateCoordinator.updateState(state => {
        state.games = state.games.filter(g => g.id !== id);
        StateCoordinator.logActivity('games', `Jeu '${game.name}' retiré.`);
      });
    }
  }

  // Steam Importer Modals
  openImportModal() {
    const modal = document.getElementById('steam-import-modal');
    if (modal) {
      const config = StateCoordinator.state.steamConfig;
      document.getElementById('steam-import-api-key').value = config?.apiKey || '';
      document.getElementById('steam-profile-url').value = config?.steamId || '';
      modal.classList.add('active');
    }
  }

  closeImportModal() {
    const modal = document.getElementById('steam-import-modal');
    if (modal) modal.classList.remove('active');
  }

  async handleSteamImport() {
    const inputVal = document.getElementById('steam-profile-url').value.trim();
    const modalApiKey = document.getElementById('steam-import-api-key').value.trim();
    const confirmImportBtn = document.getElementById('confirm-import-btn');

    const apiKey = modalApiKey || StateCoordinator.state.steamConfig?.apiKey;
    if (!apiKey) {
      alert("Une clé API Steam Web est requise pour importer les jeux. Veuillez en renseigner une.");
      return;
    }

    if (!inputVal) {
      alert("Veuillez entrer un identifiant ou un lien de profil.");
      return;
    }

    // Save apiKey dynamically
    if (modalApiKey) {
      await StateCoordinator.updateState(state => {
        if (!state.steamConfig) state.steamConfig = {};
        state.steamConfig.apiKey = modalApiKey;
      });
    }

    let profileName = inputVal;
    let isNumericId = false;

    if (inputVal.includes('steamcommunity.com/id/')) {
      profileName = inputVal.split('steamcommunity.com/id/')[1].split('/')[0];
    } else if (inputVal.includes('steamcommunity.com/profiles/')) {
      profileName = inputVal.split('steamcommunity.com/profiles/')[1].split('/')[0];
      isNumericId = true;
    } else if (/^\d{17}$/.test(inputVal)) {
      isNumericId = true;
    }

    confirmImportBtn.disabled = true;
    confirmImportBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Résolution du profil...`;

    try {
      let steamId;
      if (isNumericId) {
        steamId = profileName;
      } else {
        const resolveUrl = `https://steamcommunity.com/id/${profileName}/?xml=1`;
        const xml = await fetchWithProxy(resolveUrl);
        const idMatch = xml.match(/<steamID64>(\d+)<\/steamID64>/);
        if (!idMatch) {
          throw new Error("Impossible de résoudre le pseudo Steam. Vérifiez que le profil existe et n'est pas privé.");
        }
        steamId = idMatch[1];
      }

      // Save steamId
      await StateCoordinator.updateState(state => {
        if (!state.steamConfig) state.steamConfig = {};
        state.steamConfig.steamId = steamId;
      });

      confirmImportBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Récupération des jeux...`;

      const ownedGamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&format=json`;
      const contents = await fetchWithProxy(ownedGamesUrl);
      const result = JSON.parse(contents);
      if (!result.response || !result.response.games) {
        throw new Error("Aucun jeu trouvé ou profil privé. Vérifiez les paramètres de confidentialité de vos détails de jeux.");
      }

      const steamGames = result.response.games;
      let addedCount = 0;
      let updatedCount = 0;
      const achievementPromises = [];

      await StateCoordinator.updateState(state => {
        steamGames.forEach(item => {
          const appId = String(item.appid);
          const playtime = Math.round((item.playtime_forever || 0) / 60);

          const existingIdx = state.games.findIndex(g => g.appId === appId);
          let targetGame;
          if (existingIdx !== -1) {
            state.games[existingIdx].playtime = playtime;
            targetGame = state.games[existingIdx];
            updatedCount++;
          } else {
            targetGame = {
              id: 'game-' + Date.now() + '-' + appId,
              name: String(item.name || 'Jeu Steam Inconnu'),
              appId: appId,
              playtime: playtime,
              peakElo: 'Non classé',
              achievementsUnlocked: 0,
              achievementsTotal: 0,
              type: 'solo',
              category: ''
            };
            state.games.push(targetGame);
            addedCount++;
          }

          // Fetch achievements in parallel
          const achievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${apiKey}&steamid=${steamId}&appid=${appId}`;
          const achPromise = fetchWithProxy(achievementsUrl)
            .then(achContents => {
              const achResult = JSON.parse(achContents);
              if (achResult.playerstats && achResult.playerstats.achievements) {
                const achievements = achResult.playerstats.achievements;
                targetGame.achievementsTotal = achievements.length;
                targetGame.achievementsUnlocked = achievements.filter(a => a.achieved === 1).length;
              }
            })
            .catch(err => {
              console.error(`Impossible d'importer les succès pour AppID ${appId}:`, err);
            });
          achievementPromises.push(achPromise);
        });
      });

      // Wait for achievements
      await Promise.all(achievementPromises);

      // Save state again with achievements loaded
      await StateCoordinator.updateState(state => {
        StateCoordinator.logActivity('games', `Importation Steam effectuée depuis le profil ${profileName} (${addedCount} ajoutés, ${updatedCount} mis à jour).`);
      });

      alert(`Importation réussie ! ${addedCount} nouveaux jeux ajoutés et ${updatedCount} mis à jour depuis le profil de ${profileName}.`);
      this.closeImportModal();
    } catch (err) {
      console.error(err);
      StateCoordinator.logSystemError('steam-import-error', "Erreur lors de l'importation Steam", err.message);
      alert(`Erreur d'importation : ${err.message}. Vérifiez le journal dans les Paramètres.`);
    } finally {
      confirmImportBtn.disabled = false;
      confirmImportBtn.innerHTML = "Lancer l'importation";
    }
  }

  async handleSteamSync() {
    const config = StateCoordinator.state.steamConfig;
    if (!config || !config.apiKey || !config.steamId) return;

    const syncBtn = document.getElementById('sync-steam-btn');
    if (syncBtn) {
      syncBtn.disabled = true;
      syncBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Synchronisation...`;
    }

    try {
      const ownedGamesUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${config.apiKey}&steamid=${config.steamId}&include_appinfo=true&format=json`;
      const contents = await fetchWithProxy(ownedGamesUrl);
      const result = JSON.parse(contents);
      if (!result.response || !result.response.games) {
        throw new Error("Aucun jeu trouvé. Profil privé ou clé invalide.");
      }

      const steamGames = result.response.games;
      let updatedCount = 0;
      let addedCount = 0;
      const achievementPromises = [];

      await StateCoordinator.updateState(state => {
        steamGames.forEach(item => {
          const appId = String(item.appid);
          const playtime = Math.round((item.playtime_forever || 0) / 60);

          const existingIdx = state.games.findIndex(g => g.appId === appId);
          let targetGame;
          if (existingIdx !== -1) {
            state.games[existingIdx].playtime = playtime;
            targetGame = state.games[existingIdx];
            updatedCount++;
          } else {
            targetGame = {
              id: 'game-' + Date.now() + '-' + appId,
              name: String(item.name || 'Jeu Steam Inconnu'),
              appId: appId,
              playtime: playtime,
              peakElo: 'Non classé',
              achievementsUnlocked: 0,
              achievementsTotal: 0,
              type: 'solo',
              category: ''
            };
            state.games.push(targetGame);
            addedCount++;
          }

          const achievementsUrl = `https://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v1/?key=${config.apiKey}&steamid=${config.steamId}&appid=${appId}`;
          const achPromise = fetchWithProxy(achievementsUrl)
            .then(achContents => {
              const achResult = JSON.parse(achContents);
              if (achResult.playerstats && achResult.playerstats.achievements) {
                const achievements = achResult.playerstats.achievements;
                targetGame.achievementsTotal = achievements.length;
                targetGame.achievementsUnlocked = achievements.filter(a => a.achieved === 1).length;
              }
            })
            .catch(err => {
              console.error(`Impossible d'importer les succès pour AppID ${appId}:`, err);
            });
          achievementPromises.push(achPromise);
        });
      });

      await Promise.all(achievementPromises);
      
      await StateCoordinator.updateState(state => {
        StateCoordinator.logActivity('games', `Synchronisation Steam effectuée (${addedCount} ajoutés, ${updatedCount} mis à jour).`);
      });

      alert(`Synchronisation terminée ! ${updatedCount} jeux synchronisés, ${addedCount} nouveaux ajoutés.`);
    } catch (err) {
      console.error(err);
      StateCoordinator.logSystemError('steam-sync-error', "Erreur lors de la synchro Steam", err.message);
      alert(`Erreur de synchronisation : ${err.message}.`);
    } finally {
      if (syncBtn) {
        syncBtn.disabled = false;
        syncBtn.innerHTML = `<i class="fa-solid fa-rotate"></i> Synchro Steam`;
      }
    }
  }
}

export const GamingModule = new GamingModuleClass();
