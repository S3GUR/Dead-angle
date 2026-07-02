# Epic : Infos Récentes (News)

Ce module permet à l'utilisateur de consulter des actualités ciblées et résumées en temps réel par des agents experts, avec une gestion du pays ciblé et une persistance en base de données locale IndexedDB pour un accès instantané et résilient.

## Axes de développement (EPIC)
- [Axe 1 : Interface utilisateur (IHM)](file:///J:/Dead%20angle/roadmap/news/todo_layout.md) : Création de l'onglet d'actualités, des onglets ou sélecteurs de pays et affichage structuré et esthétique des articles.
- [Axe 2 : Base de données locale (IndexedDB)](file:///J:/Dead%20angle/roadmap/news/todo_storage.md) : Mise en place de la table `newsArticles` pour la persistance hors-connexion, gestion du cycle de vie des données et des migrations.
- [Axe 3 : Intégration des agents experts](file:///J:/Dead%20angle/roadmap/news/todo_agents_feed.md) : Connexion et requêtage asynchrone des trois agents experts (Finance, Tech et Général) à la demande.
