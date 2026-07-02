# Todo - Animes : Synchronisation de la sortie des Animes

Ce fichier détaille les tâches pour la récupération asynchrone des jours de diffusion de vos animes "En cours" (watching) et leur affichage automatique au sein du calendrier hebdomadaire.

## TODOs de développement

### 🗄️ 1. Évolution du Modèle de Données (IndexedDB)
- [ ] TODO : Mettre à jour la définition de la table `animes` (dans `src/core/Database.js`) pour supporter les nouveaux champs d'information de diffusion :
  - `broadcastDay` : string (ex: "Saturdays", "Mondays") stockant le jour de diffusion.
  - `broadcastTime` : string (ex: "23:30") stockant l'heure de diffusion (optionnel, pour affichage).
- [ ] TODO : S'assurer que lors de la création ou de la mise à jour d'un anime, ces deux nouveaux champs sont correctement sauvegardés s'ils sont fournis.

### 🌐 2. Récupération des informations de diffusion (MAL / Jikan API)
- [ ] TODO : Lors de la synchronisation de la bibliothèque d'animes (importation MAL ou ajout/modification manuelle d'un anime) :
  - Si l'anime est au statut `watching` (En cours), déclencher un appel asynchrone d'enrichissement de données vers l'API Jikan de MyAnimeList (`https://api.jikan.moe/v4/anime/[malId]`).
- [ ] TODO : Extraire le bloc de données de diffusion `broadcast` de la réponse API de Jikan.
  - Récupérer `broadcast.day` (ex: "Saturdays") et `broadcast.time` (ex: "23:00") et les associer à l'anime local en base de données.
- [ ] TODO : Mettre en place un mécanisme de file d'attente (queue) ou de temporisation (delay de 1000ms entre les requêtes) pour éviter le blocage de l'API Jikan suite à un dépassement du quota de requêtes (erreur 429 Too Many Requests) lors d'un traitement par lots d'animes "En cours".

### 🗓️ 3. Intégration et Rendu dans le Calendrier
- [ ] TODO : Dans la méthode de rendu du calendrier hebdomadaire (`CalendarModule.js`) :
  - Vérifier l'état global du paramètre d'activation `state.settings.syncAnimeReleases`. Si l'option est désactivée, ne pas charger ni afficher les sorties d'animes.
- [ ] TODO : Si l'option est active, charger depuis la base IndexedDB tous les animes de statut `watching` disposant d'un `broadcastDay`.
- [ ] TODO : Créer une fonction de correspondance linguistique (mapping) des jours de la semaine de l'anglais vers le français :
  - `"Mondays"` ➔ `"Lundi"`
  - `"Tuesdays"` ➔ `"Mardi"`
  - `"Wednesdays"` ➔ `"Mercredi"`
  - `"Thursdays"` ➔ `"Jeudi"`
  - `"Fridays"` ➔ `"Vendredi"`
  - `"Saturdays"` ➔ `"Samedi"`
  - `"Sundays"` ➔ `"Dimanche"`
- [ ] TODO : Pour chaque anime "En cours" à afficher dans la semaine courante :
  - Déterminer la date correspondante à son jour de diffusion pour la semaine visualisée sur le calendrier.
  - Créer un élément HTML d'événement virtuel pour représenter la sortie de l'épisode.
- [ ] TODO : Styliser visuellement cet événement pour qu'il se distingue des tâches classiques :
  - Appliquer la classe CSS `.anime-release-event` avec une charte graphique néon violet/rose distinctive (gradient linéaire).
  - Inclure une icône représentative (ex: `<i class="fas fa-tv">` ou `<i class="fas fa-film">`).
  - Afficher le texte : `"Sortie : [Titre de l'anime]"` (et optionnellement l'heure, ex: `[23:00]`).
  - Placer l'événement en haut de la colonne du jour, dans la section "Toute la journée" (all-day) pour éviter d'encombrer le planning horaire de la journée.
- [ ] TODO : Rendre cet événement strictement non interactif en glisser-déposer (lecture seule, pas de drag-and-drop possible) et sans option de suppression depuis le calendrier. Cliquer sur l'événement peut éventuellement ouvrir la fiche de l'anime correspondant.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-ANIME-RELEASE-1** : Si l'option de synchronisation est activée dans les Paramètres, avoir un anime comme "One Piece" au statut "En cours" avec le jour de diffusion défini sur "Sundays" (Dimanche) doit afficher automatiquement une carte de sortie `.anime-release-event` avec le libellé "Sortie : One Piece" sur la colonne du Dimanche de la semaine en cours.
- **QA-ANIME-RELEASE-2** : Désactiver le toggle de synchronisation des sorties d'animes dans les Paramètres de l'application doit faire disparaître instantanément toutes les cartes `.anime-release-event` de la grille du calendrier sans rechargement de page.
- **QA-ANIME-RELEASE-3** : Tenter d'effectuer un glisser-déposer (drag and drop) sur un événement `.anime-release-event` ne doit pas modifier sa position sur le calendrier ni lever d'erreur JavaScript en console.
