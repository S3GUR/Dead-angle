# Todo - Projets : Filtrage et affichage dynamique

Ce fichier détaille les tâches pour le filtrage et l'organisation visuelle des projets.

## TODOs de développement
- [ ] TODO : Attacher des écouteurs de clics sur les tags de filtres de statuts (`.filter-tag` : Tous, En cours, Non commencé, En pause, Terminé).
- [ ] TODO : Lors d'un changement de filtre, mettre à jour la valeur de `currentProjectFilter` et redessiner la grille des projets.
- [ ] TODO : Si aucun projet ne correspond au filtre actif, afficher un écran vide standard (empty state) avec un bouton pour ajouter un projet.
- [ ] TODO : Mettre en place un bouton d'accordéon (chevron) sur chaque carte projet pour plier ou déplier sa liste de tâches.
- [ ] TODO : Mémoriser l'état d'expansion de l'accordéon dans un Set `expandedProjectIds` contenant les IDs des projets ouverts.
- [ ] TODO : Lors du rafraîchissement réactif de la grille (render), s'assurer que les projets présents dans `expandedProjectIds` conservent leur accordéon déplié (classe CSS `.expanded`).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-PROJ-DISP-1** : Cliquer sur le chevron d'un projet pour afficher ses tâches, puis cocher une de ses tâches ne doit pas replier la liste des tâches (l'état déplié doit être conservé).
- **QA-PROJ-DISP-2** : Sélectionner le filtre "Terminé" ne doit afficher que les cartes de projets dont le statut est "completed".
