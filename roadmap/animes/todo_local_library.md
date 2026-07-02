# Todo - Animes : Bibliothèque locale et mode Lecture Seule MAL

Ce fichier détaille les tâches pour la gestion des fiches d'animes et la protection en écriture des imports externes.

## TODOs de développement
- [ ] TODO : Créer le conteneur HTML `#animes-grid` pour le rendu des affiches.
- [ ] TODO : Créer le formulaire de création/modification manuelle `#anime-form` (champs : Titre [requis], ID MAL [optionnel], Type [TV, Movie, OVA, Special], Épisodes vus, Épisodes totaux, Note [0 à 10], Statut [watching, completed, plan_to_watch, on_hold, dropped]).
- [ ] TODO : Lors de l'ajout manuel, si un ID MAL est présent, générer l'affiche par défaut : `https://cdn.myanimelist.net/images/anime/default/[malId].jpg`. Sinon, proposer un placeholder.
- [ ] TODO : Mettre en place les raccourcis `-1` et `+1` épisode sur les cartes d'animes pour ajuster la progression.
- [ ] TODO : Si le nombre d'épisodes vus atteint le nombre total d'épisodes de l'anime (et que ce total est > 0), changer automatiquement le statut de l'anime à `completed` (Terminé).
- [ ] TODO : Empêcher le compteur d'épisodes vus de dépasser le nombre total ou de descendre sous 0.
- [ ] TODO : **Implémenter le Mode Lecture Seule pour les imports MAL** :
  - Détecter si un anime provient d'un import MyAnimeList (présence de la propriété `malId` ou d'un flag d'importation).
  - Si l'anime provient de MAL, désactiver ou masquer les boutons d'incrémentation rapide `-1` et `+1` de sa carte.
  - Masquer ou désactiver le bouton "Modifier" pour les cartes d'animes importés (la seule action locale possible est "Retirer").
  - Afficher une infobulle ou un badge discret "Importé (Lecture seule)" sur la carte de l'anime pour clarifier que la source de vérité est MyAnimeList.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-ANIME-LOC-1** : Sur une carte d'anime importé depuis MAL (ID MAL renseigné), les boutons d'incrémentation rapide `-1` / `+1` et le bouton "Modifier" doivent être masqués ou totalement inopérants.
- **QA-ANIME-LOC-2** : Sur un anime ajouté manuellement, cliquer sur `+1` pour passer de 11 à 12 épisodes (avec un total de 12) doit automatiquement changer son statut à "Terminé" (badge vert).
