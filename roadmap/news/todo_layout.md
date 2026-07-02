# Todo - Infos : Interface Utilisateur (IHM)

Ce fichier détaille les tâches d'intégration et de rendu de l'interface utilisateur pour la section "Infos récentes".

## TODOs de développement

### 🗂️ 1. Intégration Navigation & Onglet Principal
- [ ] TODO : Ajouter un nouvel élément de navigation latérale dans le fichier `index.html` :
  - Structure HTML : `<div class="nav-item" data-tab="news"><i class="fas fa-newspaper"></i> <span>Infos</span></div>`
  - Cet élément doit être masqué ou affiché dynamiquement par `SettingsModule` selon l'état `state.enabledModules.news` (avec une valeur par défaut de `true` ou `false` à déterminer).
- [ ] TODO : Ajouter la section de contenu correspondante dans `index.html` :
  - Conteneur principal : `<div id="news-tab" class="tab-content" style="display: none;"></div>`
  - Ce conteneur abritera toute l'IHM du module d'actualités.
- [ ] TODO : Créer le fichier `src/modules/NewsModule.js` héritant ou se calquant sur le modèle des autres modules (ex: `FinanceModule.js`).
  - Il doit implémenter une méthode `render(state)` appelée à chaque notification de modification d'état.
  - Il doit gérer le changement d'onglet actif (gestion de la classe `.active` sur la navigation et affichage du panneau `#news-tab`).

### ⚙️ 2. Composants de Sélection & Actions
- [ ] TODO : Intégrer un bandeau de filtres en haut de l'onglet Infos (`#news-filter-bar`) comprenant :
  - **Choix du Pays Cible** : Implémenter un sélecteur stylisé (boutons radio déguisés en onglets ou un menu déroulant `#news-country-select`).
    - Options disponibles : France (`fr`), États-Unis (`us`), Monde/Global (`global`).
    - L'état local du composant doit se souvenir du pays sélectionné.
  - **Sélecteur de Catégorie / Agent Expert** : Ajouter des filtres rapides (cases à cocher ou boutons filtres `#news-agent-filters`) pour filtrer l'affichage par agent :
    - Économie & Finance (alimenté par `FinanceExpert`)
    - High-Tech & IA (alimenté par `HighTechExpert`)
    - Actualité Générale (alimenté par `GeneralNewsExpert`)
  - **Bouton d'actualisation manuelle** : Ajouter un bouton `#news-refresh-btn` avec une icône de rafraîchissement (`<i class="fas fa-sync-alt">`) et le texte "Actualiser à la demande".

### 📰 3. Grille d'Articles & Cartes d'Actualités
- [ ] TODO : Créer un conteneur pour l'affichage des articles `#news-articles-grid` configuré en CSS Grid (2 ou 3 colonnes selon la largeur de l'écran, 1 colonne sur mobile).
- [ ] TODO : En l'absence d'articles pour la sélection courante, afficher un état vide (`.news-empty-state`) avec une illustration ou icône et un bouton incitant à "Lancer l'actualisation".
- [ ] TODO : Pendant la phase de chargement asynchrone (requêtage des agents) :
  - Désactiver le bouton d'actualisation `#news-refresh-btn` et y ajouter une animation de rotation de l'icône (`.fa-spin`).
  - Afficher au moins 3 éléments "squelette" (`.news-card-skeleton`) pour simuler le chargement des articles de manière fluide.
- [ ] TODO : Rendu d'une carte d'article (`.news-card`) pour chaque actualité récupérée :
  - **En-tête** : Afficher un badge de couleur distinctive selon l'agent expert qui a rédigé l'article (ex: vert émeraude pour Finance, bleu néon pour Tech, violet pour Général).
  - **Titre** : Afficher le titre de l'article (`.news-title`) en gras.
  - **Métadonnées** : Afficher une ligne `.news-meta` contenant :
    - Le nom de la source avec un lien hypertexte externe cliquable `.news-source-link` (ouvre un nouvel onglet via `target="_blank" rel="noopener noreferrer"`).
    - La date de publication précise (`.news-date`) formatée au format localisé (`toLocaleDateString` et `toLocaleTimeString`).
  - **Résumé** : Afficher le court résumé analytique (`.news-summary`) sous forme de paragraphe avec un espacement propre.

### 🎨 4. Design & Styles CSS
- [ ] TODO : Intégrer les styles du module dans le fichier global `style.css` ou créer un fichier dédié.
  - Utiliser la charte graphique moderne et néon du projet (ombres portées fluo sur les cartes, bords arrondis, polices système propres).
  - Ajouter les classes CSS nécessaires pour : `.news-card`, `.news-title`, `.news-meta`, `.news-source-link`, `.news-summary`, `.news-card-skeleton`, et les badges d'expert (`.badge-finance`, `.badge-tech`, `.badge-general`).

## 🧪 Critères d'acceptation (pour QATester)

- **QA-NEWS-LAYOUT-1** : L'onglet "Infos" doit apparaître dans la barre latérale uniquement si le toggle correspondant est activé dans l'onglet Paramètres.
- **QA-NEWS-LAYOUT-2** : Cliquer sur l'onglet "Infos" doit afficher la section d'actualités avec son en-tête (sélecteurs de pays) et un état vide si aucune actualité n'est encore présente en base.
- **QA-NEWS-LAYOUT-3** : Chaque carte d'article affichée dans la grille doit contenir les éléments obligatoires : badge d'expert, titre lisible, lien hypertexte cliquable vers la source qui s'ouvre dans un nouvel onglet, date précise de publication et texte de résumé.
- **QA-NEWS-LAYOUT-4** : Au clic sur le bouton "Actualiser", le bouton doit se désactiver temporairement, son icône doit tourner, et des squelettes de chargement (`.news-card-skeleton`) doivent occuper l'espace avant l'affichage des articles réels.
