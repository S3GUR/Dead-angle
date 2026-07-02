# Todo - Dashboard : Historique des activités récentes

Ce fichier détaille les tâches de l'historique des dernières actions effectuées dans l'application.

## TODOs de développement
- [ ] TODO : Sélectionner le conteneur HTML `#dashboard-activity-list`.
- [ ] TODO : Vider le conteneur à chaque rendu de l'interface.
- [ ] TODO : Extraire les 5 dernières activités du tableau `activities` en mémoire.
- [ ] TODO : Si le tableau est vide ou indéfini, afficher un message d'absence d'activité : "Aucune activité récente." en texte grisé.
- [ ] TODO : Générer une ligne d'activité avec des icônes différenciées :
  - Icône `fa-list-check` (classe CSS `project`) pour les activités de type `project`.
  - Icône `fa-wallet` (classe CSS `finance`) pour les activités de type `finance`.
- [ ] TODO : Afficher le libellé descriptif de l'action (`text`) et le temps relatif écoulé (`time`).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-DASH-ACT-1** : Les lignes d'activités doivent être affichées par ordre chronologique décroissant (la plus récente tout en haut).
- **QA-DASH-ACT-2** : Les activités de type finances doivent avoir une icône de portefeuille orange/violet, et celles de projets une icône de liste à puces cyan.
