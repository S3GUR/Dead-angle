# Todo - Jeux vidéo : Recherche, filtres et tris

Ce fichier détaille les tâches pour le moteur de filtrage et de classement de la liste de jeux.

## TODOs de développement
- [ ] TODO : Lier un écouteur sur le champ texte `#game-search` pour filtrer les jeux en temps réel par rapport à leur nom (recherche insensible à la casse).
- [ ] TODO : Lier un écouteur sur la liste déroulante `#filter-game-type` pour filtrer les jeux par type (Solo, Coop, Multijoueur).
- [ ] TODO : Collecter l'ensemble des genres distincts des jeux présents dans la table locale pour remplir dynamiquement les options de la liste déroulante `#filter-game-category`.
- [ ] TODO : Lier un écouteur sur le menu déroulant de tri `#sort-games-by` et implémenter les tris :
  - `playtime-desc` : temps de jeu décroissant.
  - `playtime-asc` : temps de jeu croissant.
  - `name-asc` : ordre alphabétique.
  - `achievements-desc` : trier par le taux de complétion des succès (nombre déverrouillés / nombre total) par ordre décroissant.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-GAME-FILT-1** : Sélectionner le tri par succès décroissant doit placer un jeu dont 100% des succès sont validés tout en haut de la liste.
- **QA-GAME-FILT-2** : Écrire "counter" dans le champ de recherche ne doit laisser visible que les jeux contenant cette chaîne (comme "Counter-Strike 2").
