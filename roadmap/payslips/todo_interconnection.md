# Todo - Fiches de paie : Règle d'interconnexion de crédit automatique

Ce fichier détaille la mise en œuvre de la règle métier n°5 liant les revenus aux soldes des comptes courants.

## TODOs de développement
- [ ] TODO : Lors de la soumission d'une nouvelle fiche de paie, parcourir la liste des actifs financiers en mémoire (`state.finances`).
- [ ] TODO : Identifier le premier actif financier dont le type est égal à `bank` (représentant un compte courant).
- [ ] TODO : S'il est trouvé :
  - [ ] Ajouter le montant du **Salaire Net** (`net`) de la fiche de paie directement au solde (`balance`) de ce compte bancaire.
  - [ ] Mettre à jour le champ `lastUpdated` du compte avec la date et l'heure actuelle au format ISO.
  - [ ] Créer une activité de type `finance` indiquant le virement (ex: "Salaire net de 2 000,00 € crédité sur le compte Courant Boursorama.").
  - [ ] Persister ces modifications de manière atomique en IndexedDB sur les tables `payslips` et `finances` via `StateCoordinator.updateState`.
- [ ] TODO : Si aucun compte de type `bank` n'existe dans l'état, s'assurer que la fiche de paie est tout de même enregistrée sans provoquer d'erreur critique ou bloquante.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-PAY-INT-1** : Si un compte courant (type `bank`) existe avec un solde de 1200€, soumettre une paie avec un net de 2100€ doit immédiatement passer le solde de ce compte à `3 300,00 €`.
- **QA-PAY-INT-2** : Si aucun compte courant n'est configuré dans l'application, enregistrer une paie doit réussir sans planter le système.
