# Todo - Paramètres : Activation modulaire et réinitialisation

Ce fichier détaille les tâches pour le paramétrage des modules activés et la remise à zéro de l'application.

## TODOs de développement
- [ ] TODO : Lier des interrupteurs (toggles) pour l'activation des modules : finances, fiches de paie, jeux vidéo, animes, calendrier.
- [ ] TODO : Enregistrer le choix de l'utilisateur dans l'état sous la clé `enabledModules`.
- [ ] TODO : Lors de la modification d'un toggle, mettre à jour la base IndexedDB dans la table `settings` sous la clé `enabledModules`.
- [ ] TODO : **Masquage immédiat de la navigation** :
  - Parcourir les éléments de navigation latérale (`.nav-item`) correspondant aux modules.
  - Masquer (`display: none`) ou afficher (`display: flex`) l'élément selon son état d'activation.
- [ ] TODO : **Règle de Redirection** :
  - Si un utilisateur est sur l'onglet d'un module qu'il vient de désactiver, rediriger automatiquement l'interface vers l'onglet du Tableau de Bord (`dashboard`).
- [ ] TODO : Attacher une fonction de réinitialisation au bouton "Réinitialiser les données".
- [ ] TODO : Supprimer l'intégralité des clés LocalStorage de Wink/Dead Angle et effacer toutes les tables d'IndexedDB.
- [ ] TODO : Ré-injecter le jeu de données de démo par défaut (`defaultState`) et recharger la page.
- [ ] TODO : Demander une confirmation explicite `confirm()` avant de réinitialiser.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-SET-CONFIG-1** : Désactiver le module "Suivi Gaming" doit masquer immédiatement l'onglet "Gaming" de la barre latérale. Si l'utilisateur y était positionné, il doit être redirigé vers le "Tableau de Bord".
- **QA-SET-CONFIG-2** : Cliquer sur "Réinitialiser", puis refuser dans la boîte de dialogue ne doit pas supprimer les données existantes. Si accepté, l'application doit revenir à son état par défaut (avec les exemples de projets et finances initiaux).
