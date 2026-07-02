# Todo - Finances : Gestion des flux récurrents & capacité d'épargne

Ce fichier détaille les tâches pour la gestion des revenus et charges récurrents et le calcul du taux d'engagement.

## TODOs de développement
- [ ] TODO : Configurer la sous-vue des Flux récurrents et changer le libellé du bouton d'action du header en "Ajouter un flux".
- [ ] TODO : Créer le formulaire de création/édition de flux récurrent (`#flow-form`) avec les champs : Nom, Type (`inflow` / revenu, `outflow` / dépense), Fréquence (`weekly` / hebdomadaire, `monthly` / mensuel, `yearly` / annuel), et Montant.
- [ ] TODO : Implémenter la fonction de normalisation mensuelle pour calculer le montant mensuel équivalent de chaque flux :
  - Flux hebdomadaire : `montant * 4.333`
  - Flux annuel : `montant / 12`
  - Flux mensuel : `montant`
- [ ] TODO : Calculer le total des Revenus Mensuels Normalisés et le total des Dépenses Mensuelles Normalisées.
- [ ] TODO : En déduire la Capacité d'Épargne Réelle : `Revenus Normalisés - Dépenses Normalisées`.
- [ ] TODO : Calculer le Taux d'engagement des dépenses fixes : `(Dépenses Normalisées / Revenus Normalisés) * 100`.
- [ ] TODO : Représenter visuellement le taux d'engagement sous forme de barre de progression :
  - Plafonner la barre de progression à 100% de largeur maximum.
  - Si le taux est supérieur à 80%, appliquer la couleur de danger (rouge) à la jauge. Sinon, appliquer le dégradé classique (violet/bleu).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-FIN-FLOWS-1** : Créer une charge hebdomadaire "Abonnement Panier" de 30€ doit être normalisée à `129,99 €` par mois dans la liste des flux.
- **QA-FIN-FLOWS-2** : Avec un total de dépenses de 1900€ et un revenu de 2000€, le taux d'engagement doit afficher `95%` et la barre de progression s'affiche en rouge.
