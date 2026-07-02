# Todo - Projets : Gestion de la checklist des tâches

Ce fichier détaille les tâches pour la gestion de la liste de sous-tâches par projet.

## TODOs de développement
- [ ] TODO : Dans la modale projet, proposer une zone de création de tâche comprenant un champ texte pour l'intitulé et une liste déroulante pour la priorité (`high`, `medium`, `low`).
- [ ] TODO : Lors du clic sur le bouton "Ajouter la tâche", créer un objet tâche `{ id: 't-' + Date.now(), name, completed: false, priority }` et l'ajouter au tableau temporaire `modalTasks`.
- [ ] TODO : Implémenter le rendu dynamique de la checklist temporaire dans la modale avec des checkboxes et des boutons de suppression individuels.
- [ ] TODO : Calculer automatiquement la progression globale lors de la validation du projet :
  - Si le projet contient des tâches : `progress = Math.round((tâches_cochées / total_tâches) * 100)`.
  - Si le projet n'a aucune tâche : conserver la valeur du curseur manuel défini par l'utilisateur dans le formulaire.
- [ ] TODO : Implémenter le raccourci de cochage rapide directement depuis la carte du projet (`toggleCardTask(projId, taskId, checked)`). Ce cochage doit mettre à jour l'IndexedDB et actualiser l'état réactif de l'application sans recharger la page.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-PROJ-TASKS-1** : Créer un projet avec 4 tâches et en cocher 2 doit forcer la progression du projet à `50%` sur la carte principale, écrasant toute saisie manuelle.
- **QA-PROJ-TASKS-2** : Cocher ou décocher une tâche directement depuis la carte projet doit recalculer et mettre à jour la jauge de progression visuelle de façon réactive.
