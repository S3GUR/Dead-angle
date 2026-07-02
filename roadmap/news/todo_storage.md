# Todo - Infos : Base de données locale (IndexedDB)

Ce fichier détaille les tâches pour la persistance locale des articles d'actualité sous IndexedDB via Dexie.

## TODOs de développement

### 🗄️ 1. Évolution du Schéma Dexie (Database.js)
- [ ] TODO : Mettre à jour la définition de la base de données `DeadAngleDatabase` (dans `src/core/Database.js`) en définissant la version 3.
  - Déclarer la table `newsArticles` avec les index suivants :
    - `newsArticles: 'id, country, agentType, fetchedAt'`
  - S'assurer que le schéma de la version 2 existant est préservé pour garantir une rétrocompatibilité parfaite.
- [ ] TODO : Mettre à jour les méthodes globales de gestion de l'état dans `Database.js` :
  - **`loadState`** : Charger les actualités depuis la table `newsArticles` et les retourner dans l'état de l'application sous la clé `newsArticles`.
  - **`saveState`** : Inclure la table `newsArticles` dans la transaction globale de sauvegarde complète et vider/remplir la table lors de l'injection d'un état complet.

### 📝 2. Structure & Modèle de Données d'un Article
- [ ] TODO : Définir la structure standardisée pour un objet d'actualité stocké dans `newsArticles` :
  - `id` : string (identifiant unique généré, ex: `news-[agentType]-[country]-[timestamp]`).
  - `title` : string (le titre de l'article).
  - `sourceName` : string (le nom du média source, ex: "Le Monde").
  - `sourceUrl` : string (le lien cliquable d'origine de l'article).
  - `publishedAt` : string (date précise de publication au format ISO).
  - `summary` : string (le court résumé analytique rédigé par l'agent).
  - `country` : string (le pays cible : `fr`, `us`, ou `global`).
  - `agentType` : string (le type d'agent expert : `finance`, `tech`, ou `general`).
  - `fetchedAt` : string (date/heure de récupération de l'article en base locale au format ISO).

### 🔄 3. CRUD & Synchronisation de l'État (StateCoordinator.js)
- [ ] TODO : Déclarer la clé `newsArticles: []` vide par défaut dans le `defaultState` de `StateCoordinatorClass`.
- [ ] TODO : Lors du chargement de la base au démarrage (`syncFromDatabase`), charger les articles de `newsArticles` dans `this.state.newsArticles`.
- [ ] TODO : Implémenter une méthode `saveNewsArticles(articles)` dans `StateCoordinator` :
  - Utiliser `db.bulkPut` pour insérer/mettre à jour une liste d'articles d'actualité.
  - Notifier les écouteurs de l'état via `this.notify()`.
- [ ] TODO : Mettre en œuvre une politique d'expiration ou de nettoyage automatique :
  - Au chargement du module actualités, supprimer de la base IndexedDB les articles datant de plus de 48 heures (basé sur le champ `fetchedAt`) afin d'éviter l'encombrement de la base de données.
- [ ] TODO : Mettre à jour l'import/export de l'application dans `SettingsModule.js` pour inclure ou nettoyer de manière sécurisée la table `newsArticles` sans altérer le reste de l'import/export.
- [ ] TODO : Adapter la fonction de réinitialisation de l'application (`resetData()`) pour vider intégralement la table `newsArticles`.

## 🧪 Critères d'acceptation (pour QATester)

- **QA-NEWS-STORAGE-1** : Lancer l'application après la mise en production du module doit automatiquement appliquer la migration vers la version 3 de la base de données sans perte des données existantes (projets, finances, animes).
- **QA-NEWS-STORAGE-2** : Les actualités récupérées doivent être stockées dans la table `newsArticles` d'IndexedDB. Un rafraîchissement manuel de la page (`F5`) doit restaurer instantanément l'affichage des actualités sans solliciter à nouveau les agents réseau.
- **QA-NEWS-STORAGE-3** : La réinitialisation complète des données depuis l'onglet Paramètres doit vider intégralement la table `newsArticles`. Après réinitialisation, l'onglet Infos doit se retrouver dans son état vide d'origine.
