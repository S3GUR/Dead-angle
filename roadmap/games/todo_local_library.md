# Todo - Jeux vidéo : Bibliothèque de jeux locale

Ce fichier détaille les tâches pour la gestion manuelle de la bibliothèque locale de jeux.

## TODOs de développement
- [ ] TODO : Créer la grille HTML `#games-grid` pour le rendu des cartes de jeux.
- [ ] TODO : Créer le formulaire de création/édition de jeu `#game-form` comprenant les champs : Titre (requis), AppID Steam (optionnel), Temps de jeu (nombre), Pic d'Elo/Rang (texte), Succès déverrouillés, Succès totaux, Type (`solo`, `coop`, `multi`), Catégorie/Genre.
- [ ] TODO : Générer des identifiants locaux uniques au format `game-[timestamp]` lors d'une saisie manuelle.
- [ ] TODO : Si un AppID Steam est présent, charger l'image de bannière via l'URL `https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/[appId]/header.jpg`.
- [ ] TODO : Gérer l'erreur de chargement de l'image (attacher un écouteur `onerror` sur l'image) pour masquer l'image brisée et afficher un placeholder élégant avec une icône de manette.
- [ ] TODO : Mettre en place les boutons d'incrémentation rapide `-5h` et `+5h` sur les cartes de jeux pour modifier le temps de jeu directement sans ouvrir de modale.
- [ ] TODO : Empêcher le temps de jeu d'être inférieur à 0 lors du clic sur `-5h`.
- [ ] TODO : Implémenter la fonction de suppression d'un jeu avec avertissement de confirmation.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-GAME-LOC-1** : Cliquer sur le raccourci `-5h` pour un jeu ayant 3 heures de jeu doit fixer le temps à 0 heure de jeu.
- **QA-GAME-LOC-2** : Entrer un jeu manuellement sans spécifier d'AppID Steam doit afficher le placeholder de manette de jeux à la place de la bannière.
