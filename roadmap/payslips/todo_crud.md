# Todo - Fiches de paie : Historisation des bulletins

Ce fichier détaille les tâches pour enregistrer et lister les fiches de paie.

## TODOs de développement
- [ ] TODO : Créer le conteneur HTML `#payslips-container` pour la liste des bulletins.
- [ ] TODO : Créer la modale `#payslip-modal` avec les champs : Mois (sélection), Année (nombre), Employeur (texte), Salaire Brut (nombre), Salaire Net (nombre), Impôt (nombre), Heures (nombre, défaut `151.67`).
- [ ] TODO : Lors du chargement de la modale, pré-remplir automatiquement les champs mois et année avec les valeurs courantes du calendrier système.
- [ ] TODO : Lors de la soumission du formulaire, générer un identifiant unique `pay-[timestamp]`.
- [ ] TODO : Sauvegarder la fiche de paie dans la table `payslips` du StateCoordinator.
- [ ] TODO : Afficher les fiches de paie triées par ordre chronologique inversé (les plus récentes en premier).
- [ ] TODO : Ajouter un bouton de suppression sur chaque carte fiche de paie.
- [ ] TODO : Demander confirmation avant suppression. Si confirmé, supprimer de la table `payslips`. Ne pas modifier rétroactivement les soldes de comptes courants modifiés lors du dépôt initial de la paie.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-PAY-CRUD-1** : À l'ouverture de la modale, les sélections de mois et d'année doivent correspondre à la date actuelle.
- **QA-PAY-CRUD-2** : Confirmer la suppression d'une fiche de paie retire sa carte de la liste mais ne modifie pas le solde actuel des comptes courants.
