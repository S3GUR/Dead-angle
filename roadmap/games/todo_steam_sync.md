# Todo - Jeux vidéo : Importation & synchronisation via l'API Steam

Ce fichier détaille les tâches pour l'intégration avec l'API Web Steam.

## TODOs de développement
- [ ] TODO : Créer le formulaire de configuration et d'importation dans la modale `#steam-import-modal` (champs : Clé API Web Steam, URL de profil ou SteamID).
- [ ] TODO : Extraire l'ID numérique à 17 chiffres (SteamID64) :
  - Si l'utilisateur saisit un lien de profil contenant `/id/` ou `/profiles/`, extraire le pseudo ou l'identifiant.
  - Si c'est un pseudo littéral, interroger `https://steamcommunity.com/id/[pseudo]/?xml=1` pour obtenir le tag `<steamID64>` (utiliser le proxy CORS).
  - Si c'est un nombre à 17 chiffres, l'utiliser tel quel.
- [ ] TODO : Sauvegarder la Clé API et le SteamID dans la table `settings` pour permettre les synchronisations rapides ultérieures.
- [ ] TODO : Interroger l'API Steam `IPlayerService/GetOwnedGames/v1` via proxy CORS.
- [ ] TODO : Boucler sur les jeux renvoyés :
  - Convertir le temps de jeu en heures : `playtime = Math.round(playtime_forever / 60)`.
  - Si le jeu existe localement (même `appId`), mettre à jour son temps de jeu. Sinon, ajouter le jeu avec un statut initial non classé.
- [ ] TODO : Pour chaque jeu, lancer en parallèle (via `Promise.all`) une requête vers `ISteamUserStats/GetPlayerAchievements/v1` pour récupérer le compte de ses succès.
- [ ] TODO : Enregistrer les jeux dans IndexedDB (table `games`) et logguer dans le journal de diagnostics système `systemLogs` en cas d'erreur de proxy ou d'API.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-GAME-STEAM-1** : Si la clé API et le SteamID sont configurés en base, le bouton de synchronisation rapide "Synchro Steam" doit être visible dans la barre d'outils, sinon il est invisible.
- **QA-GAME-STEAM-2** : Tester l'importation avec un compte Steam valide dont les détails de jeux sont publics doit ajouter automatiquement tous les jeux possédés avec le temps de jeu mis à jour en heures.
