# Todo - Calendrier : Grille hebdomadaire interactive

Ce fichier détaille les tâches pour l'interface de grille du calendrier.

## TODOs de développement
- [ ] TODO : Concevoir la grille HTML contenant les 7 jours de la semaine courante (du Lundi au Dimanche) dans `#calendar-week-grid`.
- [ ] TODO : Implémenter les boutons "Semaine Précédente" (`#prev-week-btn`) et "Semaine Suivante" (`#next-week-btn`) pour modifier la date de référence de +/- 7 jours.
- [ ] TODO : Mettre en forme l'en-tête de semaine `#calendar-current-week-title` pour afficher la plage de dates (ex: "Semaine du 6 au 12 Juillet 2026").
- [ ] TODO : Mettre en place la colonne horaire affichant les heures de **08:00 à 22:00** avec une hauteur de ligne fixe de 60px par heure.
- [ ] TODO : Mettre en place une ligne spéciale "Toute la journée" d'une hauteur fixe de 60px au sommet de chaque colonne de jour.
- [ ] TODO : Surligner le jour actuel dans la grille (si présent dans la semaine visualisée) avec une classe CSS de mise en valeur (`.today`).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-CAL-GRID-1** : Cliquer sur "Suivant" doit mettre à jour les dates des en-têtes de colonnes de jours pour afficher la semaine suivante.
- **QA-CAL-GRID-2** : La grille de fond doit afficher des lignes de quadrillage horizontales toutes les heures pour délimiter les heures de 8h à 22h.
