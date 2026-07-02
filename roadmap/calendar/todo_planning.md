# Todo - Calendrier : Planification et statut des tâches

Ce fichier détaille les tâches pour planifier, modifier et interagir avec les blocs de tâches.

## TODOs de développement
- [ ] TODO : Créer le formulaire de planification `#schedule-task-form` (champs : Projet [sélection], Tâche [sélection], Date [date], Heure [heure, optionnelle], Durée [nombre, défaut 1]).
- [ ] TODO : Remplir la sélection des tâches de projet dynamiquement : ne proposer que les tâches non complétées du projet sélectionné.
- [ ] TODO : À la validation, ajouter les attributs `scheduledDate`, `scheduledTime` (chaîne vide si toute la journée) et `scheduledDuration` sur la tâche correspondante du projet.
- [ ] TODO : Positionner les blocs de tâches :
  - Tâches Toute la journée : injectées dans la zone "Toute la journée" de la colonne du jour.
  - Tâches Horaires : positionnées de manière absolue dans la colonne du jour. `top = (heure_tâche - 8) * 60px` et `height = durée_tâche * 60px`.
- [ ] TODO : Permettre de cocher/décocher la checkbox sur le bloc du calendrier pour mettre à jour la tâche et la progression du projet.
- [ ] TODO : Proposer un bouton de suppression (`&times;`) pour déplanifier la tâche. Demander confirmation, puis retirer les propriétés de planification de la tâche.
- [ ] TODO : Permettre de pré-remplir la date et l'heure dans la modale en cliquant sur une case vide du calendrier (arrondir au quart d'heure le plus proche).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-CAL-PLAN-1** : Cliquer sur la case vide du jeudi à 11h doit ouvrir la modale avec le jeudi pré-rempli et l'heure à `11:00`.
- **QA-CAL-PLAN-2** : Une tâche terminée dans un projet ne doit pas apparaître dans la liste déroulante des tâches disponibles pour la planification.
- **QA-CAL-PLAN-3** : Déplanifier une tâche (via le bouton croix) retire son bloc de la grille, mais la tâche reste présente dans son projet.
