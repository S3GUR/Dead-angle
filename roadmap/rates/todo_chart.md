# Todo - Comparateur d'Épargne : Visualisation comparative des rendements

Ce fichier détaille les tâches pour le graphique de comparaison des livrets d'épargne.

## TODOs de développement
- [ ] TODO : Sélectionner le canvas `#ratesComparisonChart`.
- [ ] TODO : Détruire l'ancienne instance `ratesComparisonChartInstance` avant de tracer un nouveau graphique pour éviter les superpositions graphiques lors de la saisie.
- [ ] TODO : Préparer les étiquettes (noms abrégés des livrets) et les séries de gains d'intérêts.
- [ ] TODO : Colorer de manière distincte les barres verticales :
  - Couleur Cyan (`rgba(6, 182, 212, 0.65)`) pour les livrets réglementés.
  - Couleur Violette (`rgba(157, 78, 221, 0.65)`) pour les livrets commerciaux.
- [ ] TODO : Instancier le graphique de type `bar` (barres verticales) avec une bordure nette pour chaque barre et un rayon de courbure de 6px.
- [ ] TODO : Cacher la légende globale de Chart.js (`legend: { display: false }`).
- [ ] TODO : Paramétrer le tooltip pour afficher la valeur exacte au format monétaire français.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-RATE-CHART-1** : Le graphique doit s'actualiser de façon fluide en temps réel lors de chaque modification du montant simulé (par exemple à chaque touche enfoncée).
- **QA-RATE-CHART-2** : Les barres du Livret A et du LEP doivent être bleues/cyans, et celles de Fortuneo ou Distingo violettes.
