# Todo - Dashboard : Graphique de répartition

Ce fichier détaille les tâches pour le graphique de répartition des actifs du tableau de bord.

## TODOs de développement
- [ ] TODO : Sélectionner le canvas du graphique `#financialDistributionChart`.
- [ ] TODO : Détruire l'instance précédente du graphique `financialDistributionChartInstance` si elle est définie pour éviter les fuites de mémoire.
- [ ] TODO : Regrouper les soldes des actifs financiers par type : `bank` (courant), `savings` (épargne), `investment` (investissements), `asset` (biens matériels) et `other` (autres).
- [ ] TODO : Si le total de tous les comptes est égal à 0, effacer le canvas et afficher un texte centré "Aucun actif à analyser" en couleur grise.
- [ ] TODO : Instancier le graphique de type `doughnut` (Chart.js) avec les données agrégées et les libellés correspondants.
- [ ] TODO : Configurer l'option `cutout: '65%'` pour donner l'effet anneau.
- [ ] TODO : Définir une légende à droite avec texte en blanc/clair (`#f3f4f6`) et police Inter.
- [ ] TODO : Formater le callback du tooltip pour afficher les valeurs au format monétaire fr-FR (EUR).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-DASH-CHART-1** : Si tous les soldes des comptes sont égaux à 0, aucun graphique circulaire ne doit s'afficher, et le texte "Aucun actif à analyser" doit être visible au centre du conteneur.
- **QA-DASH-CHART-2** : Survoler une section du graphique doughnut doit afficher le nom de la catégorie d'actifs et sa valeur exacte formatée en euros.
