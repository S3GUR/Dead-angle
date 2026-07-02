import { StateCoordinator } from '../core/StateCoordinator.js';
import { fetchWithProxy } from '../core/Utils.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class AnimesModuleClass {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    // Bind filters
    const animeSearch = document.getElementById('anime-search');
    if (animeSearch) animeSearch.addEventListener('input', () => this.render(StateCoordinator.state));

    const filterAnimeStatus = document.getElementById('filter-anime-status');
    if (filterAnimeStatus) filterAnimeStatus.addEventListener('change', () => this.render(StateCoordinator.state));

    const filterAnimeType = document.getElementById('filter-anime-type');
    if (filterAnimeType) filterAnimeType.addEventListener('change', () => this.render(StateCoordinator.state));

    const filterAnimeGenre = document.getElementById('filter-anime-genre');
    if (filterAnimeGenre) filterAnimeGenre.addEventListener('change', () => this.render(StateCoordinator.state));

    const sortAnimesBy = document.getElementById('sort-animes-by');
    if (sortAnimesBy) sortAnimesBy.addEventListener('change', () => this.render(StateCoordinator.state));

    // Form submit bind
    const animeForm = document.getElementById('anime-form');
    if (animeForm) {
      animeForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Modal triggers
    const closeAnimeModalBtn = document.getElementById('close-anime-modal');
    if (closeAnimeModalBtn) closeAnimeModalBtn.addEventListener('click', () => this.closeAnimeModal());

    const cancelAnimeModalBtn = document.getElementById('cancel-anime-modal');
    if (cancelAnimeModalBtn) cancelAnimeModalBtn.addEventListener('click', () => this.closeAnimeModal());

    // MAL import triggers
    const openMalImportBtn = document.getElementById('import-mal-btn');
    if (openMalImportBtn) openMalImportBtn.addEventListener('click', () => this.openImportModal());

    const cancelMalImportModalBtn = document.getElementById('cancel-mal-import-modal');
    if (cancelMalImportModalBtn) cancelMalImportModalBtn.addEventListener('click', () => this.closeImportModal());

    const confirmMalImportBtn = document.getElementById('confirm-mal-import-btn');
    if (confirmMalImportBtn) confirmMalImportBtn.addEventListener('click', () => this.handleMalImport());

    const syncMalBtn = document.getElementById('sync-mal-btn');
    if (syncMalBtn) syncMalBtn.addEventListener('click', () => this.handleMalSync());

    this.initialized = true;
  }

  render(state) {
    this.init();

    // Start background enrichment queue if there are imported animes without genres
    if (!this.backgroundQueueStarted && state.animes && state.animes.length > 0) {
      this.backgroundQueueStarted = true;
      const needEnrich = state.animes.filter(a => a.malId && a.status !== 'watching' && !a.genres);
      if (needEnrich.length > 0) {
        const toEnrich = needEnrich.map(a => ({ id: a.id, malId: a.malId, name: a.name }));
        this.processBackgroundQueue(toEnrich);
      }
    }

    const animesGrid = document.getElementById('animes-grid');
    if (!animesGrid) return;
    
    animesGrid.innerHTML = '';

    // Show or hide sync button based on saved malUsername
    const syncMalBtn = document.getElementById('sync-mal-btn');
    if (syncMalBtn) {
      if (state.malUsername) {
        syncMalBtn.style.display = 'inline-flex';
      } else {
        syncMalBtn.style.display = 'none';
      }
    }

    // Populate the genre filter select element dynamically
    this.populateAnimeGenres(state);

    if (!state.animes || state.animes.length === 0) {
      animesGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: span 3; padding: 40px; text-align: center;">
          <i class="fa-solid fa-film text-muted" style="font-size: 3rem; margin-bottom: 16px; display:block;"></i>
          <p class="text-muted" style="font-size: 1rem; margin-bottom: 20px;">Aucun anime dans votre liste de suivi. Commencez à ajouter vos animes ou importez votre profil MyAnimeList !</p>
          <button class="glass-button primary" id="empty-state-add-anime-btn"><i class="fa-solid fa-plus"></i> Ajouter mon premier anime</button>
        </div>
      `;
      const btn = document.getElementById('empty-state-add-anime-btn');
      if (btn) btn.addEventListener('click', () => this.openAnimeModal());
      return;
    }

    const searchQuery = (document.getElementById('anime-search')?.value || '').toLowerCase().trim();
    const filterStatus = document.getElementById('filter-anime-status')?.value || 'all';
    const filterType = document.getElementById('filter-anime-type')?.value || 'all';
    const filterGenre = document.getElementById('filter-anime-genre')?.value || 'all';
    const sortBy = document.getElementById('sort-animes-by')?.value || 'rating-desc';

    let filteredAnimes = state.animes.filter(anime => {
      const animeName = String(anime.name || 'Anime Inconnu');
      const matchesSearch = animeName.toLowerCase().includes(searchQuery);
      const matchesStatus = filterStatus === 'all' || anime.status === filterStatus;
      const matchesType = filterType === 'all' || anime.type === filterType;
      
      let matchesGenre = true;
      if (filterGenre !== 'all') {
        if (anime.genres) {
          const genresList = anime.genres.split(',').map(g => g.trim().toLowerCase());
          matchesGenre = genresList.includes(filterGenre.toLowerCase());
        } else {
          matchesGenre = false;
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesGenre;
    });

    filteredAnimes.sort((a, b) => {
      if (sortBy === 'rating-desc') {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === 'progress-desc') {
        return (b.episodesWatched || 0) - (a.episodesWatched || 0);
      } else if (sortBy === 'name-asc') {
        const aName = String(a.name || 'Anime Inconnu');
        const bName = String(b.name || 'Anime Inconnu');
        return aName.localeCompare(bName);
      }
      return 0;
    });

    if (filteredAnimes.length === 0) {
      animesGrid.innerHTML = `
        <div class="glass-panel" style="grid-column: span 3; padding: 30px; text-align: center;">
          <p class="text-muted">Aucun anime ne correspond à vos filtres.</p>
        </div>
      `;
      return;
    }

    filteredAnimes.forEach(anime => {
      const card = document.createElement('div');
      card.className = 'glass-panel game-card';
      
      let bannerHtml = '';
      if (anime.image) {
        const safeImage = (anime.image.startsWith('http://') || anime.image.startsWith('https://')) ? anime.image : '';
        if (safeImage) {
          bannerHtml = `<img src="${escapeHtml(safeImage)}" class="anime-poster" alt="${escapeHtml(anime.name)}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
        }
      }
      bannerHtml += `
        <div class="game-banner-placeholder" style="${anime.image ? 'display:none;' : ''} height: 200px;">
          <i class="fa-solid fa-film"></i>
        </div>
      `;

      const totalEps = parseInt(anime.episodesTotal) || 0;
      const watchedEps = parseInt(anime.episodesWatched) || 0;
      const progressPercent = totalEps > 0 ? Math.round((watchedEps / totalEps) * 100) : 0;

      const statusLabels = {
        watching: { text: 'En cours', color: 'var(--accent-cyan)', bg: 'rgba(6, 182, 212, 0.15)' },
        completed: { text: 'Terminé', color: 'var(--success)', bg: 'rgba(34, 197, 94, 0.15)' },
        plan_to_watch: { text: 'À voir', color: 'var(--accent-purple)', bg: 'rgba(168, 85, 247, 0.15)' },
        on_hold: { text: 'En pause', color: 'var(--accent-yellow)', bg: 'rgba(234, 179, 8, 0.15)' },
        dropped: { text: 'Abandonné', color: 'var(--accent-pink)', bg: 'rgba(244, 63, 94, 0.15)' }
      };

      const statusConf = statusLabels[anime.status] || { text: anime.status, color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.08)' };

      card.innerHTML = `
        ${bannerHtml}
        <div class="game-stats">
          <div class="game-header-area">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
              <h3 class="game-title" title="${escapeHtml(anime.name)}">${escapeHtml(anime.name)}</h3>
              <span style="font-size: 0.65rem; background: ${statusConf.bg}; border: 1px solid ${statusConf.color}; padding: 2px 6px; border-radius: 4px; color: ${statusConf.color}; white-space: nowrap;">
                ${escapeHtml(statusConf.text)}
              </span>
            </div>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">
              <div class="game-appid-badge" style="padding: 2px 5px; font-size: 0.65rem; background: rgba(58, 134, 200, 0.15); border-color: rgba(58, 134, 200, 0.3); color: #93c5fd;">
                <i class="fa-solid fa-clapperboard"></i> ${escapeHtml(anime.type || 'TV')}
              </div>
              ${anime.rating ? `
                <div class="game-appid-badge" style="background: rgba(234, 179, 8, 0.15); border-color: rgba(234, 179, 8, 0.3); color: var(--accent-yellow); padding: 2px 5px; font-size: 0.65rem;">
                  <i class="fa-solid fa-star"></i> ${anime.rating}/10
                </div>
              ` : ''}
              ${anime.malId ? `
                <div class="game-appid-badge" style="background: rgba(46, 81, 162, 0.15); border-color: rgba(46, 81, 162, 0.3); color: #93c5fd; padding: 2px 5px; font-size: 0.65rem;">
                  MAL ID: ${escapeHtml(anime.malId)}
                </div>
                <div class="game-appid-badge" style="background: rgba(34, 197, 94, 0.15); border-color: rgba(34, 197, 94, 0.3); color: var(--success); padding: 2px 5px; font-size: 0.65rem;">
                  <i class="fa-solid fa-lock"></i> Importé
                </div>
              ` : ''}
              ${anime.genres ? `
                <div class="game-appid-badge" style="background: rgba(167, 139, 250, 0.15); border-color: rgba(167, 139, 250, 0.3); color: #c084fc; padding: 2px 5px; font-size: 0.65rem;">
                  <i class="fa-solid fa-tags"></i> ${escapeHtml(anime.genres)}
                </div>
              ` : ''}
            </div>
          </div>

          <div class="game-stat-rows">
            <div class="game-stat-row">
              <span class="game-stat-label"><i class="fa-solid fa-play"></i> Épisodes</span>
              <div style="display: flex; align-items: center; gap: 6px;">
                ${anime.malId ? '' : `<button class="glass-button btn-small dec-episodes-btn" data-id="${escapeHtml(anime.id)}" style="padding: 1px 4px; font-size: 0.7rem; height: auto;">-1</button>`}
                <span class="game-stat-value" style="font-size: 0.8rem;">${watchedEps} / ${totalEps || '?'}</span>
                ${anime.malId ? '' : `<button class="glass-button btn-small inc-episodes-btn" data-id="${escapeHtml(anime.id)}" style="padding: 1px 4px; font-size: 0.7rem; height: auto;">+1</button>`}
              </div>
            </div>

            <div style="margin-top: 2px;">
              <div class="game-achievement-bar" style="height: 6px;">
                <div class="game-achievement-progress" style="width: ${progressPercent}%; background: linear-gradient(90deg, #2e51a2 0%, var(--accent-cyan) 100%);"></div>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; margin-top: 4px; border-top: 1px solid var(--border-glass); padding-top: 8px; justify-content: flex-end;">
            ${anime.malId ? '' : `
              <button class="glass-button btn-small text-muted edit-anime-card-btn" data-id="${escapeHtml(anime.id)}" style="padding: 2px 6px; font-size:0.75rem; height: auto;">
                <i class="fa-regular fa-pen-to-square"></i> Modifier
              </button>
            `}
            <button class="glass-button btn-small danger delete-anime-card-btn" data-id="${escapeHtml(anime.id)}" style="padding: 2px 6px; font-size:0.75rem; height: auto;">
              <i class="fa-regular fa-trash-can"></i> Retirer
            </button>
          </div>
        </div>
      `;
      animesGrid.appendChild(card);
    });

    // Bind card actions
    animesGrid.querySelectorAll('.dec-episodes-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.incrementEpisodes(id, -1);
      });
    });

    animesGrid.querySelectorAll('.inc-episodes-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        this.incrementEpisodes(id, 1);
      });
    });

    animesGrid.querySelectorAll('.edit-anime-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.openAnimeModal(id);
      });
    });

    animesGrid.querySelectorAll('.delete-anime-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        this.deleteAnime(id);
      });
    });
  }

  populateAnimeGenres(state) {
    const filterSelect = document.getElementById('filter-anime-genre');
    if (!filterSelect) return;

    const currentVal = filterSelect.value;
    
    // Collect genres
    const genresSet = new Set();
    if (state.animes) {
      state.animes.forEach(a => {
        if (a.genres) {
          a.genres.split(',').forEach(g => {
            const trimmed = g.trim();
            if (trimmed) genresSet.add(trimmed);
          });
        }
      });
    }

    // Sort genres alphabetically
    const sortedGenres = Array.from(genresSet).sort((a, b) => a.localeCompare(b));

    filterSelect.innerHTML = '<option value="all">Tous les genres</option>';
    sortedGenres.forEach(genre => {
      filterSelect.innerHTML += `<option value="${escapeHtml(genre)}">${escapeHtml(genre)}</option>`;
    });

    // Restore selected value
    if (genresSet.has(currentVal)) {
      filterSelect.value = currentVal;
    } else {
      filterSelect.value = 'all';
    }
  }

  incrementEpisodes(id, amount) {
    StateCoordinator.updateState(state => {
      const anime = state.animes.find(a => a.id === id);
      if (anime) {
        const total = parseInt(anime.episodesTotal) || 9999;
        anime.episodesWatched = Math.max(0, Math.min(total, (parseInt(anime.episodesWatched) || 0) + amount));
        
        if (anime.episodesWatched === total && total > 0) {
          anime.status = 'completed';
        }
      }
    }, ['animes']);
  }

  openAnimeModal(id = null) {
    const animeModal = document.getElementById('anime-modal');
    const animeForm = document.getElementById('anime-form');
    if (!animeModal || !animeForm) return;
    
    animeForm.reset();
    document.getElementById('anime-id').value = '';
    document.getElementById('anime-status-input').value = 'watching';
    document.getElementById('anime-type-input').value = 'TV';
    document.getElementById('anime-genres-input').value = '';
    document.getElementById('anime-modal-title').innerText = "Ajouter un Anime";

    if (id) {
      const anime = StateCoordinator.state.animes.find(a => a.id === id);
      if (anime) {
        document.getElementById('anime-id').value = anime.id;
        document.getElementById('anime-title-input').value = anime.name;
        document.getElementById('anime-mal-id').value = anime.malId || '';
        document.getElementById('anime-type-input').value = anime.type || 'TV';
        document.getElementById('anime-episodes-watched').value = anime.episodesWatched || 0;
        document.getElementById('anime-episodes-total').value = anime.episodesTotal || 12;
        document.getElementById('anime-score-input').value = anime.rating || 0;
        document.getElementById('anime-status-input').value = anime.status || 'watching';
        document.getElementById('anime-genres-input').value = anime.genres || '';
        document.getElementById('anime-modal-title').innerText = "Modifier l'Anime";
      }
    }
    animeModal.classList.add('active');
  }

  closeAnimeModal() {
    const animeModal = document.getElementById('anime-modal');
    if (animeModal) animeModal.classList.remove('active');
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('anime-id').value;
    const name = document.getElementById('anime-title-input').value.trim();
    const malId = document.getElementById('anime-mal-id').value.trim();
    const type = document.getElementById('anime-type-input').value;
    const episodesWatched = parseInt(document.getElementById('anime-episodes-watched').value) || 0;
    const episodesTotal = parseInt(document.getElementById('anime-episodes-total').value) || 0;
    const rating = parseInt(document.getElementById('anime-score-input').value) || 0;
    const status = document.getElementById('anime-status-input').value;
    const genres = document.getElementById('anime-genres-input').value.trim();

    StateCoordinator.updateState(state => {
      let image = '';
      if (malId) {
        image = `https://cdn.myanimelist.net/images/anime/default/${malId}.jpg`;
      }

      if (id) {
        const idx = state.animes.findIndex(a => a.id === id);
        if (idx !== -1) {
          state.animes[idx] = { 
            ...state.animes[idx], 
            name, 
            malId, 
            type,
            episodesWatched, 
            episodesTotal, 
            rating, 
            status,
            genres,
            image: image || state.animes[idx].image
          };
          StateCoordinator.logActivity('animes', `Anime '${name}' mis à jour.`);
        }
      } else {
        const newAnime = {
          id: 'anime-' + Date.now(),
          name,
          malId,
          type,
          episodesWatched,
          episodesTotal,
          rating,
          status,
          genres,
          image
        };
        state.animes.push(newAnime);
        StateCoordinator.logActivity('animes', `Anime '${name}' ajouté.`);
      }
    }, ['animes']);

    this.closeAnimeModal();
  }

  deleteAnime(id) {
    const anime = StateCoordinator.state.animes.find(a => a.id === id);
    if (anime && confirm(`Voulez-vous vraiment retirer "${anime.name}" de votre liste ?`)) {
      StateCoordinator.updateState(state => {
        state.animes = state.animes.filter(a => a.id !== id);
        StateCoordinator.logActivity('animes', `Anime '${anime.name}' retiré.`);
      }, ['animes']);
    }
  }

  // MAL Importer Modals
  openImportModal() {
    const usernameInput = document.getElementById('mal-username');
    if (usernameInput && StateCoordinator.state.malUsername) {
      usernameInput.value = StateCoordinator.state.malUsername;
    }
    const modal = document.getElementById('mal-import-modal');
    if (modal) modal.classList.add('active');
  }

  closeImportModal() {
    const modal = document.getElementById('mal-import-modal');
    if (modal) modal.classList.remove('active');
  }

  async handleMalImport() {
    const username = document.getElementById('mal-username').value.trim();
    if (!username) {
      alert("Veuillez saisir un pseudo MyAnimeList.");
      return;
    }
    await this.runMalImport(username, false);
  }

  async handleMalSync() {
    const username = StateCoordinator.state.malUsername;
    if (!username) return;
    await this.runMalImport(username, true);
  }

  async runMalImport(username, isSyncButton = false) {
    let btn;
    let originalHtml = '';
    
    if (isSyncButton) {
      btn = document.getElementById('sync-mal-btn');
      if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Actualisation...`;
      }
    } else {
      btn = document.getElementById('confirm-mal-import-btn');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Importation...`;
      }
    }

    const malUrl = `https://myanimelist.net/animelist/${username}/load.json?offset=0&status=7`;

    try {
      const contents = await fetchWithProxy(malUrl);
      const malData = JSON.parse(contents);
      if (!Array.isArray(malData)) {
        throw new Error("Impossible de lire la liste. Assurez-vous que le profil MyAnimeList est public.");
      }

      let added = 0;
      let updated = 0;

      const malStatusMap = {
        1: 'watching',
        2: 'completed',
        3: 'on_hold',
        4: 'dropped',
        6: 'plan_to_watch'
      };

      const updatedAnimes = [];
      const animesToEnrichBackground = [];

      for (const item of malData) {
        const malId = String(item.anime_id);
        const name = String(item.anime_title || 'Anime Inconnu');
        const watched = parseInt(item.num_watched_episodes) || 0;
        const total = parseInt(item.anime_num_episodes) || 0;
        const score = parseInt(item.score) || 0;
        const statusVal = malStatusMap[item.status] || 'watching';
        const type = item.anime_media_type_string || 'TV';
        const poster = item.anime_image_path || '';

        const existingAnime = StateCoordinator.state.animes.find(a => a.malId === malId);

        let genres = '';
        if (item.tags) {
          genres = item.tags;
        } else if (existingAnime && existingAnime.genres) {
          genres = existingAnime.genres;
        }

        let broadcastDay = existingAnime ? existingAnime.broadcastDay || '' : '';
        let broadcastTime = existingAnime ? existingAnime.broadcastTime || '' : '';

        const needJikan = (statusVal === 'watching') && malId;
        const animeId = existingAnime ? existingAnime.id : ('anime-' + Date.now() + '-' + malId);

        if (needJikan) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`);
            if (response.ok) {
              const result = await response.json();
              if (result && result.data) {
                if (result.data.genres) {
                  genres = result.data.genres.map(g => g.name).join(', ');
                }
                if (result.data.broadcast) {
                  broadcastDay = result.data.broadcast.day || '';
                  broadcastTime = result.data.broadcast.time || '';
                }
              }
            }
          } catch (err) {
            console.error("Error fetching details from Jikan for ID " + malId, err);
          }
        }

        // Add to background queue if not watching and has no genres yet
        if (statusVal !== 'watching' && !genres && malId) {
          animesToEnrichBackground.push({ id: animeId, malId, name });
        }

        if (existingAnime) {
          updatedAnimes.push({
            ...existingAnime,
            name,
            episodesWatched: watched,
            episodesTotal: total,
            rating: score,
            status: statusVal,
            image: poster || existingAnime.image,
            genres: genres || existingAnime.genres || '',
            broadcastDay: broadcastDay,
            broadcastTime: broadcastTime
          });
          updated++;
        } else {
          updatedAnimes.push({
            id: animeId,
            name,
            malId,
            type,
            episodesWatched: watched,
            episodesTotal: total,
            rating: score,
            status: statusVal,
            image: poster,
            genres: genres || '',
            broadcastDay: broadcastDay,
            broadcastTime: broadcastTime
          });
          added++;
        }
      }

      await StateCoordinator.updateState(state => {
        state.malUsername = username;
        const manualAnimes = state.animes.filter(a => !a.malId);
        state.animes = [...manualAnimes, ...updatedAnimes];
        StateCoordinator.logActivity('animes', `Importation MyAnimeList effectuée (${added} ajoutés, ${updated} mis à jour).`);
      }, ['animes', 'malUsername']);

      alert(`Importation réussie ! ${added} animes ajoutés et ${updated} mis à jour.`);
      if (!isSyncButton) {
        this.closeImportModal();
      }

      // Start background enrichment queue if there are items to enrich
      if (animesToEnrichBackground.length > 0) {
        this.processBackgroundQueue(animesToEnrichBackground);
      }

    } catch (err) {
      console.error(err);
      StateCoordinator.logSystemError('mal-import-error', "Erreur MyAnimeList", err.message);
      alert(`Erreur d'importation : ${err.message}. Vérifiez le journal dans les Paramètres.`);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = isSyncButton ? originalHtml : "Lancer l'importation";
      }
    }
  }

  async processBackgroundQueue(animesToEnrich) {
    if (this.isProcessingQueue) {
      if (!this.backgroundQueue) this.backgroundQueue = [];
      animesToEnrich.forEach(item => {
        if (!this.backgroundQueue.some(q => q.malId === item.malId)) {
          this.backgroundQueue.push(item);
        }
      });
      return;
    }

    this.backgroundQueue = [...animesToEnrich];
    if (this.backgroundQueue.length === 0) return;

    this.isProcessingQueue = true;
    console.log(`[Background Queue] Lancement de la file d'attente asynchrone pour enrichir ${this.backgroundQueue.length} animes...`);

    while (this.backgroundQueue.length > 0) {
      const item = this.backgroundQueue.shift();
      
      // Delay to avoid hitting Jikan API rate limit (60 requests/minute -> 1 per 3 seconds is safe)
      await new Promise(resolve => setTimeout(resolve, 3000));

      try {
        console.log(`[Background Queue] Requête Jikan pour l'anime : ${item.name} (MAL ID: ${item.malId})`);
        const response = await fetch(`https://api.jikan.moe/v4/anime/${item.malId}`);
        if (response.ok) {
          const result = await response.json();
          if (result && result.data) {
            let genres = '';
            let broadcastDay = '';
            let broadcastTime = '';
            if (result.data.genres) {
              genres = result.data.genres.map(g => g.name).join(', ');
            }
            if (result.data.broadcast) {
              broadcastDay = result.data.broadcast.day || '';
              broadcastTime = result.data.broadcast.time || '';
            }

            // Update in coordinator state and commit targeted write to DB
            await StateCoordinator.updateState(state => {
              const anime = state.animes.find(a => a.id === item.id);
              if (anime) {
                anime.genres = genres;
                anime.broadcastDay = broadcastDay;
                anime.broadcastTime = broadcastTime;
              }
            }, ['animes']);
            console.log(`[Background Queue] Enrichi avec succès : ${item.name} (${genres})`);
          }
        } else if (response.status === 429) {
          console.warn(`[Background Queue] Erreur 429 (Too Many Requests) pour MAL ID ${item.malId}. Réinsertion dans la file d'attente.`);
          this.backgroundQueue.unshift(item);
          // Wait longer if we got rate limited
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          console.error(`[Background Queue] Erreur Jikan pour MAL ID ${item.malId}: Status ${response.status}`);
        }
      } catch (err) {
        console.error(`[Background Queue] Échec pour MAL ID ${item.malId}`, err);
      }
    }

    this.isProcessingQueue = false;
    console.log(`[Background Queue] File d'attente asynchrone terminée.`);
  }
}

export const AnimesModule = new AnimesModuleClass();
