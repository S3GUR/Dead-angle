# Todo - Projets : Gestion CRUD des projets

Ce fichier détaille les tâches pour créer, lire, modifier et supprimer des projets.

## TODOs de développement
- [ ] TODO : Concevoir un identifiant unique auto-généré au format `proj-[timestamp]` lors de la création d'un projet.
- [ ] TODO : Créer le formulaire de saisie dans la modale `#project-modal` avec les champs : titre, description, statut, budget et date limite.
- [ ] TODO : Nettoyer les espaces inutiles sur le titre du projet lors de la soumission. Bloquer l'enregistrement si le titre est vide.
- [ ] TODO : Remplir le formulaire avec les valeurs du projet existant lors de l'ouverture en mode modification.
- [ ] TODO : Sauvegarder le projet dans IndexedDB via `StateCoordinator.updateState` dans la table `projects`.
- [ ] TODO : Créer une activité dans le journal à la suite d'un ajout ou d'une modification.
- [ ] TODO : Attacher une fonction de suppression au bouton `#delete-proj-btn` de la carte.
- [ ] TODO : Déclencher un dialogue de confirmation `confirm()` avant toute suppression. Si accepté, retirer le projet de la base de données et actualiser l'affichage.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-PROJ-CRUD-1** : Essayer de soumettre un projet sans renseigner de nom doit être impossible ou bloqué par le système.
- **QA-PROJ-CRUD-2** : Cliquer sur le bouton de suppression d'un projet et choisir "Annuler" dans la boîte de dialogue doit conserver le projet intact en base de données.
- **QA-PROJ-CRUD-3** : Modifier le nom d'un projet doit répercuter le changement immédiatement sur sa carte de projet et dans les activités récentes du Dashboard.
