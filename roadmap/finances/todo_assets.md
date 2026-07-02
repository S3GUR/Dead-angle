# Todo - Finances : Gestion des actifs financiers

Ce fichier détaille les tâches pour la gestion des avoirs du patrimoine (comptes bancaires, possessions matérielles).

## TODOs de développement
- [ ] TODO : Mettre en place un menu de basculement interne (Actifs / Flux récurrents) dans l'onglet.
- [ ] TODO : Mettre à jour le texte du bouton principal d'action du header : "Ajouter un actif" si la sous-vue courante est "Actifs".
- [ ] TODO : Créer le formulaire de création/édition d'un actif (`#finance-form`) avec les champs : Nom de l'actif, Type (`bank`, `savings`, `investment`, `asset`, `other`), et Solde (`balance`).
- [ ] TODO : Lors de la soumission du formulaire d'actif, enregistrer dans le store `finances` via `StateCoordinator.updateState` en ajoutant la date actuelle dans le champ `lastUpdated`.
- [ ] TODO : Rendre la liste des actifs financiers en y adjoignant des icônes adaptées (ex: `fa-building-columns` pour `bank`, `fa-piggy-bank` pour `savings`, etc.).
- [ ] TODO : Attacher une fonction de suppression au bouton `#delete-fin-btn` avec une confirmation utilisateur `confirm()`.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-FIN-ASSETS-1** : Ajouter un actif de type `savings` pour un montant de 2500€ doit incrémenter le patrimoine net total du Dashboard de 2500€ immédiatement.
- **QA-FIN-ASSETS-2** : Confirmer la suppression d'un actif de 5000€ doit déduire ce montant de la fortune nette globale et l'actif doit disparaître de la liste.
