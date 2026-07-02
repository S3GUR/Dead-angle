# Todo - Animes : Recherche, filtres par genre et tris

Ce fichier détaille les tâches pour le filtrage complexe et les options de classement de la liste d'animes.

## TODOs de développement
- [ ] TODO : Lier un écouteur sur le champ texte `#anime-search` pour filtrer les animes par nom (sensible aux correspondances partielles et insensible à la casse).
- [ ] TODO : Lier un écouteur sur la sélection de statut `#filter-anime-status` (Tous, En cours, Terminés, À voir, En pause, Abandonnés).
- [ ] TODO : Lier un écouteur sur le sélecteur de format `#filter-anime-type` (Tous, TV, Movie, OVA, Special).
- [ ] TODO : **Mettre en place le tri et le filtrage par Genre** :
  - Extraire l'intégralité des genres uniques présents dans le champ `genres` des animes stockés en base de données.
  - Remplir dynamiquement une liste déroulante `#filter-anime-genre` avec ces genres uniques à chaque rendu de la vue.
  - Implémenter le filtrage : lorsqu'un genre est sélectionné dans `#filter-anime-genre`, ne conserver à l'affichage que les animes dont le tableau `genres` contient cette valeur.
- [ ] TODO : Lier les écouteurs de tris sur `#sort-animes-by` :
  - `rating-desc` : Note décroissante (note sur 10).
  - `progress-desc` : Nombre d'épisodes vus décroissant.
  - `name-asc` : Ordre alphabétique sur le nom.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-ANIME-FILT-1** : La liste déroulante des genres doit lister tous les genres uniques trouvés dans les animes stockés (ex: Action, Comédie, Drame...).
- **QA-ANIME-FILT-2** : Sélectionner le genre "Action" dans le filtre doit masquer instantanément tous les animes qui ne contiennent pas le genre "Action".
