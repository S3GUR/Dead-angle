# Todo - Animes : Importation, sauvegarde MAL et actualisation

Ce fichier détaille les tâches pour l'importation automatique, la sauvegarde du pseudonyme MyAnimeList et l'actualisation de la liste.

## TODOs de développement
- [ ] TODO : Créer le formulaire de saisie dans la modale d'importation MyAnimeList `#mal-import-modal` (champ : Pseudonyme MAL).
- [ ] TODO : **Sauvegarder le pseudonyme MAL** :
  - Lors d'une importation réussie, sauvegarder le pseudonyme MAL saisi dans la table `settings` (ex: sous la clé `malUsername` ou dans un objet de config) via `StateCoordinator.updateState`.
  - Pré-remplir automatiquement le champ pseudo lors de la prochaine ouverture de la modale.
- [ ] TODO : **Ajouter un bouton d'actualisation rapide** :
  - Placer un bouton "Actualiser MAL" (classe `.actualiser-mal-btn` ou ID `#sync-mal-btn`) dans la barre d'outils de l'onglet Animes.
  - Ce bouton n'est visible que si un pseudonyme MAL a été précédemment sauvegardé dans les paramètres de l'application.
  - Au clic, lancer automatiquement la synchronisation sans afficher la modale. Désactiver le bouton pendant le chargement et afficher un spinner de chargement (`fa-spinner`).
- [ ] TODO : Appeler l'API de liste d'animes de MyAnimeList : `https://myanimelist.net/animelist/[pseudo]/load.json?offset=0&status=7` via proxy CORS.
- [ ] TODO : Parser le résultat et mapper les statuts de visionnage MAL vers notre modèle local :
  - 1 -> `watching` (En cours)
  - 2 -> `completed` (Terminé)
  - 3 -> `on_hold` (En pause)
  - 4 -> `dropped` (Abandonné)
  - 6 -> `plan_to_watch` (À voir)
- [ ] TODO : Mettre à jour les enregistrements existants (si même `malId`) ou les ajouter à la table `animes`.
- [ ] TODO : Enregistrer les genres officiels de chaque anime lors de l'importation. Attention : ne pas utiliser les tags MyAnimeList (qui correspondent aux notes et commentaires personnels de l'utilisateur sur son profil MAL, ex: "classic shonen") comme genres. Les genres officiels doivent provenir exclusivement de l'API Jikan ou d'une saisie manuelle de l'utilisateur.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-ANIME-SYNC-1** : Si aucun pseudo MAL n'est enregistré dans les paramètres, le bouton "Actualiser MAL" doit être invisible sur l'interface.
- **QA-ANIME-SYNC-2** : Importer avec succès la liste d'un utilisateur MAL public doit enregistrer son pseudo en base. Au rafraîchissement, le bouton "Actualiser MAL" doit être visible dans la barre d'outils et relancer l'import lors d'un clic.
