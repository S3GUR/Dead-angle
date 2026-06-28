# Guide de l'Application : Wink 🧭

**Wink** est un outil de gestion personnelle haut de gamme conçu pour centraliser vos objectifs de vie (projets) et suivre votre patrimoine global (comptes, épargne, investissements, biens matériels) au même endroit.

L'interface utilise un style **Dark Mode Glassmorphism** avec des dégradés de néon violet/bleu, du verre dépoli, et des animations dynamiques.

---

## 🏗️ Structure du Projet (Clean Architecture)

L'application est structurée de manière modulaire en utilisant les modules ES6 natifs, assurant une séparation claire des responsabilités sans aucun framework lourd de build.

*   **[index.html](file:///J:/Wink/index.html)** : Squelette HTML5 de l'interface, définitions des modales de saisie, et importation de la bibliothèque de base de données **[dexie.js](file:///J:/Wink/src/libs/dexie.js)** et du point d'entrée **[main.js](file:///J:/Wink/src/main.js)**.
*   **[style.css](file:///J:/Wink/style.css)** : Registre central d'importation des feuilles de styles modulaires.
*   **[src/styles/](file:///J:/Wink/src/styles)** : Fichiers CSS séparés par module :
    *   `core.css` : Thème global, variables, mise en page et barre latérale.
    *   `dashboard.css`, `projects.css`, `finance.css`, `payslips.css`, `rates.css`, `gaming.css`, `animes.css`, `settings.css`.
*   **[src/core/](file:///J:/Wink/src/core)** : Moteurs système fondamentaux :
    *   `Database.js` : Déclaration et transactions de la base de données IndexedDB (Dexie).
    *   `StateCoordinator.js` : Gestion de l'état central en mémoire (Pub/Sub) et synchronisation asynchrone.
    *   `Utils.js` : Utilitaires partagés (formatage monétaire, requêtes avec proxies).
*   **[src/modules/](file:///J:/Wink/src/modules)** : Classes JavaScript autonomes gérant la logique et le rendu par onglet :
    *   `DashboardModule.js`, `ProjectsModule.js`, `FinanceModule.js`, `PayslipsModule.js`, `RatesModule.js`, `GamingModule.js`, `AnimesModule.js`, `SettingsModule.js`.

---

## 🌟 Fonctionnalités Implémentées

### 1. Tableau de Bord (Dashboard)
*   **Indicateurs Clés (KPI) :** Affichage du Patrimoine Brut, Projets Actifs, Heures investies et Épargne totale.
*   **Graphique Doughnut :** Illustration de la répartition d'actifs (Courant, Épargne, Bourse/Crypto, Matériel).
*   **Activités Récentes :** Liste historique dynamique des dernières actions.

### 2. Gestion des Projets
*   **Cartes de Projets :** Progression automatique recalculée selon la checklist des tâches, indicateur de temps investi réglable, budget et date limite.
*   **Priorités :** Tâches catégorisées par priorité (*Haute*, *Moyenne*, *Faible*).
*   **Filtres dynamiques :** Filtrage instantané par statut (En cours, Non commencé, En pause, Terminé).

### 3. Finances & Patrimoine
*   **Fortune Nette :** Somme automatisée de vos actifs calculée en temps réel.
*   **Calculateur d'Épargne & Cash Flow :** Saisie des revenus et dépenses fixes, normalisation mensuelle pour en extraire la Capacité d'Épargne Réelle et le Taux d'Engagement des charges.
*   **Graphiques dynamiques :** Graphique à barres horizontales pour visualiser les soldes.

### 4. Fiches de Paie (Revenus)
*   **Liaison Automatique (Règle 5) :** L'enregistrement d'une fiche de paie crédite automatiquement le compte bancaire courant associé.
*   Suivi historique détaillé des bulletins (Brut, Net, Impôts, Heures).

### 5. Comparateur d'Épargne & Taux
*   Simulateur d'intérêts interactif comparant les livrets réglementés et les livrets en ligne français.
*   Intègre la Flat Tax (30%) optionnelle et gère les plafonds de dépôts.

### 6. Suivi Gaming & Steam
*   Grille élégante de cartes réduites et fluides.
*   Recherche en temps réel et filtres complexes (Solo/Multi, Genre) et tris multiples.
*   **Importateur de Profil Steam :** Récupération asynchrone des jeux, de leur temps de jeu, bannières et succès associés.

### 7. Suivi Animes & MyAnimeList
*   Visualisation sous forme d'affiches des animés suivis, compteurs d'épisodes et score.
*   **Importateur MyAnimeList :** Scraper asynchrone pour importer votre liste MAL publique.

---

## 💾 Base de Données : IndexedDB (Dexie.js)

Le stockage historique `localStorage` a été migré vers IndexedDB pour lever les limites de stockage d'images et accélérer les requêtes.

### Schéma des Tables
Wink structure ses données dans la base de données locale `WinkDatabase` via Dexie :

1.  **`settings`** (clé primaire: `key`) :
    *   `steamConfig` : `{ apiKey: string, steamId: string }`
    *   `enabledModules` : `{ finances: boolean, payslips: boolean, games: boolean, animes: boolean }`
2.  **`projects`** (clé primaire: `id`) :
    *   `name`, `description`, `status`, `progress`, `timeSpent`, `budget`, `deadline`, `tasks: Array`
3.  **`finances`** (clé primaire: `id`) :
    *   `name`, `type`, `balance`, `lastUpdated`
4.  **`recurringFlows`** (clé primaire: `id`) :
    *   `name`, `type`, `frequency`, `amount`
5.  **`payslips`** (clé primaire: `id`) :
    *   `month`, `year`, `employer`, `gross`, `net`, `tax`, `hours`
6.  **`games`** (clé primaire: `id`, index: `appId`) :
    *   `name`, `appId`, `playtime`, `peakElo`, `achievementsUnlocked`, `achievementsTotal`, `type`, `category`
7.  **`animes`** (clé primaire: `id`, index: `malId`) :
    *   `name`, `malId`, `type`, `episodesWatched`, `episodesTotal`, `rating`, `status`, `image`
8.  **`activities`** (clé primaire: `id`) :
    *   `type`, `text`, `time`
9.  **`systemLogs`** (clé primaire: `id`) :
    *   `type`, `message`, `details`, `timestamp`

---

## ⚡ Optimisation des Transactions
Afin de préserver la fluidité de l'interface, la persistence des données utilise des **Targeted Updates** :
*   Les écritures partielles en base sont restreintes uniquement à la table modifiée.
*   Exemple : Ajuster le temps d'un projet déclenche un `updateState(..., ['projects'])` qui n'écrit que sur la table `projects` (transaction de moins de 2ms), évitant de réécrire les catalogues de jeux/animes volumineux à chaque interaction.
