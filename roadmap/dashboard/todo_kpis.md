# Todo - Dashboard : Calcul des KPIs globaux

Ce fichier détaille les tâches pour le calcul et l'affichage des indicateurs clés de performance du tableau de bord.

## TODOs de développement
- [ ] TODO : Calculer la fortune nette en sommant tous les soldes (`balance`) du store IndexedDB `finances`.
- [ ] TODO : Formater la fortune nette au format monétaire français (EUR) via `Intl.NumberFormat` et l'injecter dans `#stat-net-worth`.
- [ ] TODO : Calculer le nombre de projets actifs en filtrant ceux dont le statut est `in-progress`.
- [ ] TODO : Calculer le nombre de projets non commencés (`not-started`) et l'injecter en tant que sous-étiquette sous le nombre de projets actifs.
- [ ] TODO : Sommer la durée cumulée de toutes les tâches planifiées (somme des durées `scheduledDuration` de toutes les tâches de tous les projets ayant une planification) et l'injecter dans `#stat-total-hours`.
- [ ] TODO : Sommer l'épargne totale en cumulant les actifs financiers dont le type est `savings` ou `investment`.
- [ ] TODO : Calculer la proportion d'épargne par rapport au patrimoine net global : `(épargne_totale / fortune_nette) * 100`. Si le patrimoine net est à 0 ou négatif, forcer à `0%`.
- [ ] TODO : Calculer la tendance de richesse (Worth Trend) par rapport à la dernière fiche de paie enregistrée :
  - Si fiches de paie présentes : `(salaire_net_derniere_paie / fortune_nette) * 100`, affiché avec le préfixe `+`, une décimale, une icône de flèche montante, et la classe CSS `stat-trend up`.
  - Si pas de fiche de paie : afficher le texte `stable` avec un tiret et sans classe colorée.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-DASH-KPIS-1** : Si la table finances contient un compte courant à 1500€, un livret A à 10000€ et un PEA à 5000€, la fortune nette doit afficher 16 500,00 € et l'épargne totale 15 000,00 € (soit 91% du patrimoine).
- **QA-DASH-KPIS-2** : Sans fiche de paie en base, la tendance de richesse doit afficher "stable". Avec une fiche de paie de 2000€ net et une fortune de 10000€, elle affiche "+20.0%".
