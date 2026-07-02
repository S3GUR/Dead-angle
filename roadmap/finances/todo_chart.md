# Todo - Finances : Visualisation graphique du patrimoine

Ce fichier détaille les tâches pour le graphique de répartition sous forme de barres horizontales.

## TODOs de développement
- [ ] TODO : Sélectionner le canvas du graphique `#financeBreakdownChart`.
- [ ] TODO : S'assurer de détruire l'instance précédente `financeBreakdownChartInstance` pour éviter la superposition de graphiques.
- [ ] TODO : Grouper les soldes par type d'actifs : Comptes courants, Épargne, Bourse/Crypto, Possessions matérielles, Autres.
- [ ] TODO : Si la somme totale des avoirs est égale à 0, dessiner "Aucune donnée à afficher" au milieu du canvas.
- [ ] TODO : Instancier le graphique de type `bar` avec l'option `indexAxis: 'y'` (Chart.js) pour obtenir des barres horizontales.
- [ ] TODO : Utiliser une couleur de fond violette transparente et une bordure violette opaque pour les barres avec un rayon de bordure de 6px.
- [ ] TODO : Configurer l'échelle des abscisses (axe X) avec des lignes de grille semi-transparentes et des labels de couleur grise.
- [ ] TODO : Configurer le tooltip pour afficher la valeur exacte au format monétaire (EUR).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-FIN-CHART-1** : Si aucun compte n'est enregistré, le canvas doit afficher "Aucune donnée à afficher".
- **QA-FIN-CHART-2** : Survoler une barre du graphique affiche une info-bulle formatée en euros (ex: " PEA : 5 400,00 €").
