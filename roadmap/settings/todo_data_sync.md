# Todo - Paramètres : Importation et exportation de base de données

Ce fichier détaille les tâches pour le mécanisme d'exportation et d'importation de sauvegardes JSON.

## TODOs de développement
- [ ] TODO : Attacher une fonction d'exportation au bouton d'export.
- [ ] TODO : Générer une chaîne JSON formatée représentant tout l'état en mémoire (`StateCoordinator.state`).
- [ ] TODO : Créer un lien de téléchargement temporaire en codant le JSON en URI de données et déclencher le téléchargement avec un nom de fichier horodaté : `dead_angle_backup_YYYY-MM-DD.json`.
- [ ] TODO : Configurer l'input file caché `#import-data-file` pour écouter l'événement `change`.
- [ ] TODO : Lire le fichier importé via `FileReader` au format texte et le parser en JSON.
- [ ] TODO : **Valider la structure du fichier JSON** :
  - Vérifier la présence des tableaux clés : `projects`, `finances` et `payslips`.
  - Si validation échouée : afficher une alerte "Format de fichier invalide." et arrêter l'importation.
- [ ] TODO : Si validation réussie, écraser toutes les tables de la base locale via `StateCoordinator.db.saveState`, recharger l'état en mémoire et forcer un rechargement de page (`window.location.reload()`) pour rafraîchir l'application.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-SET-SYNC-1** : Cliquer sur "Exporter" doit générer un fichier nommé `dead_angle_backup_[date].json`.
- **QA-SET-SYNC-2** : Tenter d'importer un fichier JSON qui ne contient pas les tableaux `projects`, `finances` et `payslips` doit afficher un message d'erreur et ne pas modifier les données de l'application.
