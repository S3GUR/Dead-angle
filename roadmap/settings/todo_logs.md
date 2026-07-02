# Todo - Paramètres : Diagnostics et logs système

Ce fichier détaille les tâches pour la console de diagnostics système.

## TODOs de développement
- [ ] TODO : Créer le terminal textuel `#system-logs-console` dans l'onglet des paramètres.
- [ ] TODO : Lire les logs dans la table IndexedDB `systemLogs` et limiter l'affichage aux 50 dernières entrées.
- [ ] TODO : Si aucun log n'est disponible, afficher le message "[INFO] Aucun log disponible. Base de données saine." en texte vert clair.
- [ ] TODO : Mettre en forme chaque ligne de log en fonction de son type :
  - Style erreur (rouge) pour les types `proxy-error`, `steam-import-error`, `mal-import-error`.
  - Style avertissement (orange) pour les avertissements (`proxy-warning`).
- [ ] TODO : Afficher l'heure de l'incident au format `HH:MM:SS` devant le log.
- [ ] TODO : Lier le bouton "Effacer les logs" pour vider la table `systemLogs` en base locale et rafraîchir l'affichage du terminal.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-SET-LOG-1** : Si une erreur se produit dans un module externe (ex: échec d'importation Steam), une ligne d'erreur formatée en rouge doit apparaître dans la console des paramètres.
- **QA-SET-LOG-2** : Cliquer sur le bouton d'effacement doit effacer instantanément tous les logs et afficher le message vert d'absence de logs.
