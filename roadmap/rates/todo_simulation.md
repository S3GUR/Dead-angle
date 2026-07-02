# Todo - Comparateur d'Épargne : Simulation des livrets réglementés et commerciaux

Ce fichier détaille les tâches pour le moteur de calcul de la simulation d'intérêts.

## TODOs de développement
- [ ] TODO : Déclarer les taux et les plafonds des livrets réglementés :
  - `LEP` : Taux = 2.50%, Plafond = 10 000 €.
  - `Livret A` : Taux = 1.50%, Plafond = 22 950 €.
  - `LDDS` : Taux = 1.50%, Plafond = 12 000 €.
- [ ] TODO : Déclarer les taux et les plafonds des livrets commerciaux :
  - `Distingo Bank` : Taux de base = 2.00%, Taux promotionnel boosté = 4.50% pendant 3 mois. Plafond = 1 000 000 €.
  - `Trade Republic` : Taux = 2.00%, Plafond = 50 000 €.
  - `BoursoBank (Bourso+)` : Taux = 2.00%, Plafond = 1 000 000 €.
  - `Fortuneo (Livret +)` : Taux = 2.00%, Plafond = 1 000 000 €.
- [ ] TODO : Implémenter le calcul du taux pondéré annuel (blended rate) de Distingo Bank : `(4.50 * 3 / 12) + (2.00 * 9 / 12) = 2.625%`.
- [ ] TODO : Écouter en temps réel les changements sur la zone de saisie du montant de simulation `#rates-simulate-amount` et sur la case à cocher `#rates-apply-tax`.
- [ ] TODO : Limiter le capital de calcul au plafond de chaque livret : `principal = Math.min(plafond_livret, montant_simulé)`.
- [ ] TODO : Si la checkbox "Appliquer la Flat Tax (30%)" est cochée, décoter les taux des livrets commerciaux de 30% (`taux_net = taux_brut * 0.7`), tout en conservant les livrets réglementés exonérés d'impôts.
- [ ] TODO : Calculer les intérêts annuels : `gains = principal * (taux / 100)`.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-RATE-SIM-1** : Simuler 100 000 € sur le LEP doit calculer des intérêts uniquement sur son plafond de 10 000 € (soit 250 € d'intérêts nets d'impôts).
- **QA-RATE-SIM-2** : Pour une simulation de 20 000 € sur Trade Republic (sans Flat Tax), le gain annuel brut doit être de `400,00 €`. Avec Flat Tax cochée, le gain net doit être de `280,00 €`.
