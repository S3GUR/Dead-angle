# Todo - Calendrier : Rappels automatiques via notifications toast

Ce fichier détaille les tâches pour le service d'arrière-plan de notifications.

## TODOs de développement
- [ ] TODO : Configurer une routine d'arrière-plan avec un `setInterval` s'exécutant toutes les 20 secondes.
- [ ] TODO : Analyser toutes les tâches de projets non complétées de la journée en cours.
- [ ] TODO : Si une tâche est "Toute la journée", déclencher une notification toast le jour même.
- [ ] TODO : Si une tâche possède un horaire défini, déclencher la notification dès que l'heure système atteint ou dépasse l'heure de début planifiée.
- [ ] TODO : **Prévention des alertes en boucle** :
  - Créer un Set global `alertedTaskIds` dans le module.
  - Avant de déclencher une alerte, vérifier si la clé unique `[taskId]-[date]-[heure_ou_allday]` est présente dans le Set.
  - Si oui, ne rien faire.
  - Si non, ajouter la clé au Set et afficher le toast.
- [ ] TODO : Créer le toast dans `#dead-angle-toast-container` (style sombre, bordure néon, icône de cloche qui rebondit, titre et texte explicatif).
- [ ] TODO : Masquer et supprimer automatiquement le toast du DOM après 10 secondes (ou au clic sur sa croix de fermeture).

## 🧪 Critères d'acceptation (pour QATester)
- **QA-CAL-ALERT-1** : Planifier une tâche pour 14:00 aujourd'hui. À 14:00, le toast doit apparaître en bas à droite, puis s'auto-détruire après 10 secondes. Le toast ne doit pas réapparaître 20 secondes plus tard.
- **QA-CAL-ALERT-2** : Les alertes toasts ne doivent se déclencher que pour des tâches non complétées.
