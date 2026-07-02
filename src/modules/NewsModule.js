import { StateCoordinator } from '../core/StateCoordinator.js';
import { AgentsService } from '../core/AgentsService.js';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

class NewsModuleClass {
  constructor() {
    this.initialized = false;
    this.loading = false;
    this.selectedCountry = 'fr'; // Default country
    this.selectedAgents = {
      finance: true,
      tech: true,
      general: true
    };
    this.hasWarning = false;
  }

  init() {
    if (this.initialized) return;

    // Apply the 48-hour database cleanup on load
    StateCoordinator.cleanExpiredNews();

    // Bind country selector
    const countrySelect = document.getElementById('news-country-select');
    if (countrySelect) {
      countrySelect.value = this.selectedCountry;
      countrySelect.addEventListener('change', (e) => {
        this.selectedCountry = e.target.value;
        this.render(StateCoordinator.state);
      });
    }

    // Bind expert filters
    const filterFinance = document.getElementById('news-filter-finance');
    const filterTech = document.getElementById('news-filter-tech');
    const filterGeneral = document.getElementById('news-filter-general');

    if (filterFinance) {
      filterFinance.checked = this.selectedAgents.finance;
      filterFinance.addEventListener('change', (e) => {
        this.selectedAgents.finance = e.target.checked;
        this.render(StateCoordinator.state);
      });
    }
    if (filterTech) {
      filterTech.checked = this.selectedAgents.tech;
      filterTech.addEventListener('change', (e) => {
        this.selectedAgents.tech = e.target.checked;
        this.render(StateCoordinator.state);
      });
    }
    if (filterGeneral) {
      filterGeneral.checked = this.selectedAgents.general;
      filterGeneral.addEventListener('change', (e) => {
        this.selectedAgents.general = e.target.checked;
        this.render(StateCoordinator.state);
      });
    }

    // Bind refresh button
    const refreshBtn = document.getElementById('news-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.fetchNews());
    }

    this.initialized = true;
  }

  async fetchNews() {
    if (this.loading) return;
    this.loading = true;
    this.hasWarning = false;
    
    this.updateRefreshButtonUI(true);
    this.renderSkeletons();

    try {
      const articles = await AgentsService.fetchNewsFromAgents(this.selectedCountry);
      if (articles && articles.hasPartialErrors) {
        this.hasWarning = true;
      }
      
      // Save to IndexedDB and update state coordinator
      await StateCoordinator.saveNewsArticles(articles);
    } catch (err) {
      console.error("[NewsModule] Échec de la récupération des actualités:", err);
      this.hasWarning = true;
    } finally {
      this.loading = false;
      this.updateRefreshButtonUI(false);
      this.render(StateCoordinator.state);
    }
  }

  updateRefreshButtonUI(isLoading) {
    const btn = document.getElementById('news-refresh-btn');
    const icon = document.getElementById('news-refresh-icon');
    const text = document.getElementById('news-refresh-text');

    if (btn && icon && text) {
      if (isLoading) {
        btn.disabled = true;
        icon.classList.add('fa-spin');
        text.innerText = "Actualisation...";
      } else {
        btn.disabled = false;
        icon.classList.remove('fa-spin');
        text.innerText = "Actualiser à la demande";
      }
    }
  }

  renderSkeletons() {
    const grid = document.getElementById('news-articles-grid');
    if (grid) {
      grid.innerHTML = `
        <div class="news-card-skeleton"></div>
        <div class="news-card-skeleton"></div>
        <div class="news-card-skeleton"></div>
      `;
    }
  }

  render(state) {
    this.init();

    const grid = document.getElementById('news-articles-grid');
    if (!grid) return;

    if (this.loading) {
      // Skeletons are already rendering
      return;
    }

    // Filter local memory articles matching selected country & selected agents
    const allArticles = state.newsArticles || [];
    const countryArticles = allArticles.filter(art => art.country === this.selectedCountry);

    const filteredArticles = countryArticles.filter(art => {
      return this.selectedAgents[art.agentType] === true;
    });

    // Remove any existing partial error warning banners
    const existingWarning = document.getElementById('news-warning-banner');
    if (existingWarning) {
      existingWarning.remove();
    }

    // Render warning banner if applicable
    if (this.hasWarning) {
      const banner = document.createElement('div');
      banner.id = 'news-warning-banner';
      banner.className = 'glass-panel';
      banner.style.cssText = 'grid-column: span 3; padding: 12px 16px; margin-bottom: 16px; background: rgba(239, 68, 68, 0.15); border: 1px solid var(--accent-pink); color: #fecaca; font-size: 0.85rem; display: flex; align-items: center; gap: 10px; border-radius: var(--radius-md);';
      banner.innerHTML = `
        <i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-pink); font-size: 1.1rem;"></i>
        <span>Certaines sources d'actualités n'ont pas pu être actualisées (erreurs réseau ou de parsing). Les données affichées sont partiellement simulées ou issues de l'historique local. Consultez les logs d'erreurs dans les paramètres pour plus de détails.</span>
      `;
      // Insert warning banner at the top of the grid or before it
      grid.parentNode.insertBefore(banner, grid);
    }

    // Render Empty State if no articles
    if (filteredArticles.length === 0) {
      grid.innerHTML = `
        <div class="news-empty-state">
          <i class="fa-solid fa-newspaper news-empty-icon"></i>
          <p class="news-empty-text">Aucun article disponible pour cette configuration. Lancez l'actualisation pour interroger nos agents experts.</p>
          <button class="glass-button primary" id="empty-state-refresh-btn"><i class="fas fa-sync-alt"></i> Récupérer les actualités</button>
        </div>
      `;
      const emptyBtn = document.getElementById('empty-state-refresh-btn');
      if (emptyBtn) {
        emptyBtn.addEventListener('click', () => this.fetchNews());
      }
      return;
    }

    // Sort by publication date descending (newest first)
    filteredArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    grid.innerHTML = '';
    filteredArticles.forEach(art => {
      const card = document.createElement('div');
      card.className = `news-card ${art.agentType}-glow`;

      const dateStr = new Date(art.publishedAt).toLocaleString('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const badgeLabels = {
        finance: { text: 'Économie & Finance', class: 'badge-finance' },
        tech: { text: 'High-Tech & IA', class: 'badge-tech' },
        general: { text: 'Actualité Générale', class: 'badge-general' }
      };

      const badgeConf = badgeLabels[art.agentType] || { text: art.agentType, class: 'badge-general' };

      card.innerHTML = `
        <div class="news-card-content">
          <div class="expert-badge ${badgeConf.class}">${escapeHtml(badgeConf.text)}</div>
          <h4 class="news-title" title="${escapeHtml(art.title)}">${escapeHtml(art.title)}</h4>
          <div class="news-meta">
            <a href="${escapeHtml(art.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="news-source-link">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> ${escapeHtml(art.sourceName)}
            </a>
            <span class="news-date">${escapeHtml(dateStr)}</span>
          </div>
          <p class="news-summary">${escapeHtml(art.summary)}</p>
        </div>
      `;

      grid.appendChild(card);
    });
  }
}

export const NewsModule = new NewsModuleClass();
