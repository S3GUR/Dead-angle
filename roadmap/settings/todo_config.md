# Todo - Paramètres : Activation modulaire et réinitialisation

Ce fichier détaille les tâches pour le paramétrage des modules activés et la remise à zéro de l'application.

## TODOs de développement
- [ ] TODO : Lier des interrupteurs (toggles) pour l'activation des modules : finances, fiches de paie, jeux vidéo, animes, calendrier, infos.
- [ ] TODO : Enregistrer le choix de l'utilisateur dans l'état sous la clé `enabledModules`.
- [ ] TODO : Lors de la modification d'un toggle, mettre à jour la base IndexedDB dans la table `settings` sous la clé `enabledModules`.
- [ ] TODO : **Toggle de Synchronisation des sorties d'Animes** :
  - Créer une case à cocher ou un commutateur (switch) `#anime-release-sync-toggle` dans la section des options du module Animes (dans l'onglet Paramètres).
  - Ce toggle doit être lié à la configuration utilisateur dans l'état global sous la clé `settings.syncAnimeReleases` et sauvegardé dans la table `settings` d'IndexedDB.
  - S'assurer que le changement d'état de ce toggle déclenche instantanément une mise à jour d'état via `StateCoordinator.updateState` pour rafraîchir l'affichage du calendrier.
- [ ] TODO : **Toggle du Module Infos (Actualités)** :
  - Créer un commutateur (switch) `#module-toggle-news` dans l'onglet Paramètres pour activer/désactiver le module Infos.
  - Ce toggle doit être lié à la configuration utilisateur dans l'état global sous la clé `enabledModules.news` et sauvegardé dans la table `settings` d'IndexedDB.
  - Déclencher une mise à jour d'état via `StateCoordinator.updateState` pour appliquer immédiatement le changement.
- [ ] TODO : **Masquage immédiat de la navigation** :
  - Parcourir les éléments de navigation latérale (`.nav-item`) correspondant aux modules (y compris le nouveau `.nav-item[data-tab="news"]`).
  - Masquer (`display: none`) ou afficher (`display: flex`) l'élément selon son état d'activation.
- [ ] TODO : **Règle de Redirection** :
  - Si un utilisateur est sur l'onglet d'un module qu'il vient de désactiver (y compris l'onglet Infos), rediriger automatiquement l'interface vers l'onglet du Tableau de Bord (`dashboard`).
- [ ] TODO : Attacher une fonction de réinitialisation au bouton "Réinitialiser les données".
- [ ] TODO : Supprimer l'intégralité des clés LocalStorage de Wink/Dead Angle et effacer toutes les tables d'IndexedDB (y compris la nouvelle table `newsArticles`).
- [ ] TODO : Ré-injecter le jeu de données de démo par défaut (`defaultState`) et recharger la page.
- [ ] TODO : Demander une confirmation explicite `confirm()` avant de réinitialiser.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-SET-CONFIG-1** : Désactiver le module "Suivi Gaming" doit masquer immédiatement l'onglet "Gaming" de la barre latérale. Si l'utilisateur y était positionné, il doit être redirigé vers le "Tableau de Bord".
- **QA-SET-CONFIG-2** : Cliquer sur "Réinitialiser", puis refuser dans la boîte de dialogue ne doit pas supprimer les données existantes. Si accepté, l'application doit revenir à son état par défaut (avec les exemples de projets et finances initiaux).
- **QA-SET-CONFIG-3** : Cocher ou décocher le toggle `#anime-release-sync-toggle` (Synchronisation des sorties d'animes) dans l'onglet Paramètres doit instantanément mettre à jour la valeur de `syncAnimeReleases` dans la table `settings` d'IndexedDB. Le changement doit être immédiat et persistant lors d'un rechargement de page.
- **QA-SET-CONFIG-4** : Cocher ou décocher le toggle `#module-toggle-news` (onglet Infos) dans l'onglet Paramètres doit instantanément afficher ou masquer l'onglet "Infos" de la barre de navigation. Si décoché alors que l'utilisateur se trouve sur l'onglet Infos, l'application doit rediriger l'utilisateur vers le "Tableau de Bord". Le réglage doit persister dans IndexedDB et être conservé au rafraîchissement.
