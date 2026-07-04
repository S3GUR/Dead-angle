# Todo - Calendrier : Rendez-vous et événements libres

Ce fichier détaille les tâches pour concevoir, stocker et afficher les rendez-vous et événements libres (hors projets) au sein de la grille hebdomadaire du Calendrier.

## TODOs de développement

### 🗄️ 1. Persistance & Base de Données (IndexedDB / Dexie)
- [ ] TODO : Dans `src/core/Database.js`, déclarer et ajouter la nouvelle table `appointments` dans le schéma de la base de données `DeadAngleDatabase`.
  - Schéma de la table : `appointments: '++id, title, date, time, duration, location, notes'` (où `id` est auto-incrémenté comme clé primaire, `title` est le libellé de l'événement, `date` est au format `YYYY-MM-DD`, `time` est au format `HH:MM` ou vide, `duration` est un entier ou décimal représentant le nombre d'heures, `location` est une chaîne de texte libre, et `notes` contient des informations textuelles complémentaires).
- [ ] TODO : Ajouter les méthodes CRUD asynchrones associées dans `Database.js` pour gérer les rendez-vous :
  - `addAppointment(appointment)` : Insère un nouveau rendez-vous en base de données.
  - `getAppointmentsByDateRange(startDate, endDate)` : Récupère tous les rendez-vous compris entre deux dates inclusivement (pour l'affichage hebdomadaire).
  - `deleteAppointment(id)` : Supprime définitivement un rendez-vous à partir de sa clé primaire.

### 🎨 2. Interface Utilisateur (UI) de la Modale de Planification
- [ ] TODO : Modifier la structure HTML de la modale de planification existante (dans `index.html` ou le template JavaScript associé) pour y intégrer un commutateur ou un sélecteur de type d'événement :
  - Un ensemble de boutons radio ou un commutateur stylisé (ex: `#event-type-toggle`) avec deux options : "Tâche de projet" (valeur `task`) et "Rendez-vous libre" (valeur `appointment`). Par défaut, l'option "Tâche de projet" doit être active.
- [ ] TODO : Structurer et encadrer les champs spécifiques aux deux modes au sein de conteneurs distincts et facilement manipulables via JavaScript (ex: `.project-task-fields` et `.free-appointment-fields`).
- [ ] TODO : Pour le conteneur des rendez-vous libres `.free-appointment-fields` (masqué par défaut), ajouter les champs suivants :
  - Champ de saisie texte `#appointment-title` avec l'attribut `required` (Libellé : "Titre du rendez-vous", placeholder: "Ex: Déjeuner client, Dentiste...").
  - Champ de saisie texte `#appointment-location` optionnel (Libellé : "Lieu", placeholder: "Ex: Bureau 302, Visioconférence...").
  - Zone de texte `#appointment-notes` optionnelle (Libellé : "Notes / Informations complémentaires", placeholder: "Saisir des notes...").
- [ ] TODO : Assurer la visibilité dynamique en JavaScript dans `CalendarModule.js` :
  - Au changement du commutateur, afficher `.project-task-fields` et masquer `.free-appointment-fields` si "Tâche de projet" est sélectionné.
  - Afficher `.free-appointment-fields` et masquer `.project-task-fields` si "Rendez-vous libre" est sélectionné.
  - Adapter les attributs `required` sur les sélecteurs de tâche/projet pour qu'ils soient obligatoires uniquement en mode "Tâche de projet" (et non requis en mode "Rendez-vous libre"), et inversement pour `#appointment-title`.

### 🔄 3. Comportement, Rendu & Positionnement dans la Grille
- [ ] TODO : Mettre à jour la logique de récupération des données hebdomadaires dans `CalendarModule.js` pour effectuer une récupération unifiée :
  - Charger à la fois les tâches de projets planifiées (contenant des dates de planification) et les rendez-vous libres stockés dans la table `appointments` pour la plage de dates de la semaine courante.
- [ ] TODO : Implémenter le rendu des rendez-vous libres dans la grille hebdomadaire :
  - Créer un élément HTML de classe `.calendar-event.appointment-event` pour représenter chaque rendez-vous.
  - Y insérer une icône FontAwesome `fa-calendar-day` (`<i class="fas fa-calendar-day"></i>`), suivie du titre de l'événement et de son lieu si spécifié (ex: "Déjeuner (Restaurant L'ardoise)").
  - Appliquer un style CSS spécifique dans `src/styles/calendar.css` :
    - Fond de couleur bleu/indigo (ex: `background-color: var(--blue-bg)` ou un liseré coloré distinctif) et des bordures soignées avec un liseré doré subtil à gauche (`border-left: 4px solid var(--gold-color)`).
    - Un contraste de texte adéquat pour respecter l'accessibilité en mode sombre et clair.
- [ ] TODO : Positionner les blocs de rendez-vous libres selon la présence ou l'absence d'heure :
  - **Avec heure spécifiée** : Calculer le positionnement absolu dans la colonne du jour correspondant : `top = (heure_rendez_vous - 8) * 60px` et `height = duree_rendez_vous * 60px` (en supposant une grille débutant à 08:00 avec 60px par heure).
  - **Sans heure spécifiée (toute la journée)** : Injecter le bloc de rendez-vous dans la zone dédiée "Toute la journée" (all-day section) en haut de la colonne du jour.
- [ ] TODO : Ajouter un bouton de suppression (`&times;` ou icône de corbeille `#delete-appointment-btn`) dans le coin supérieur droit de chaque bloc de rendez-vous `.appointment-event`.
- [ ] TODO : Attacher un gestionnaire d'événement au clic sur ce bouton de suppression :
  - Afficher une boîte de dialogue de confirmation native ou personnalisée (ex: "Voulez-vous vraiment supprimer ce rendez-vous ?").
  - En cas de confirmation, appeler `Database.deleteAppointment(id)`, notifier la suppression via un toast, mettre à jour l'état de l'application et rafraîchir l'affichage de la grille du calendrier.

---

## 🧪 Critères d'acceptation (pour QATester)

- **QA-CAL-APP-1 : Commutateur de la Modale et Validation des Champs**
  - *Étapes de test* :
    1. Accéder au Calendrier et cliquer sur le bouton de planification présent dans le header dynamique en haut à droite.
    2. Vérifier que la modale s'ouvre avec l'option "Tâche de projet" activée par défaut, affichant les listes de sélection pour les projets et tâches.
    3. Cliquer sur le commutateur pour sélectionner "Rendez-vous libre".
    4. Constater que les sélecteurs de projets et de tâches disparaissent et que les champs "Titre", "Lieu" et "Notes" deviennent visibles.
    5. Laisser le champ "Titre" vide et cliquer sur le bouton de soumission de la modale. Vérifier qu'un message de validation natif du navigateur demande de remplir ce champ obligatoire.
    6. Renseigner le titre "Réunion hebdomadaire" et valider le formulaire. La modale doit se fermer et l'événement doit apparaître dans la grille.

- **QA-CAL-APP-2 : Positionnement et Rendu Visuel des Rendez-vous**
  - *Étapes de test* :
    1. Ouvrir la modale de planification, sélectionner "Rendez-vous libre" et créer un rendez-vous intitulé "Session de Brainstorming" pour le Mardi de la semaine en cours de 10:00 à 12:00 (Durée : 2h).
    2. Créer un autre rendez-vous libre intitulé "Anniversaire Jean-Marc" pour le Jeudi de la semaine en cours en laissant le champ Heure vide.
    3. Valider l'affichage de la grille : le premier rendez-vous doit se situer précisément entre 10h00 et 12h00 dans la colonne du Mardi, affublé de la classe `.appointment-event` avec un fond bleu/indigo, une icône de calendrier `fa-calendar-day` et un liseré doré.
    4. Le second rendez-vous doit se situer dans la zone "Toute la journée" en haut de la colonne du Jeudi.

- **QA-CAL-APP-3 : Persistance dans IndexedDB**
  - *Étapes de test* :
    1. Ajouter un rendez-vous libre nommé "RDV Médical" le Vendredi à 15:00 pour 1h, avec le Lieu "Cabinet Médical" et la note "Apporter les résultats d'analyses".
    2. Recharger complètement l'application (F5) et naviguer à nouveau vers la semaine en cours si nécessaire.
    3. Confirmer que le rendez-vous "RDV Médical" est toujours présent dans la grille du Vendredi à 15:00.
    4. Ouvrir les outils de développement du navigateur, aller dans l'onglet "Application" (ou "Stockage"), sélectionner IndexedDB -> `DeadAngleDatabase` -> table `appointments`.
    5. Vérifier qu'une ligne a été créée avec les attributs correspondants : `title: "RDV Médical"`, `date: "YYYY-MM-DD"`, `time: "15:00"`, `duration: 1`, `location: "Cabinet Médical"`, `notes: "Apporter les résultats d'analyses"`.

- **QA-CAL-APP-4 : Suppression d'un Rendez-vous**
  - *Étapes de test* :
    1. Localiser le rendez-vous "RDV Médical" créé précédemment dans la grille du calendrier.
    2. Cliquer sur le bouton de suppression (croix ou icône corbeille) situé sur le bloc de l'événement.
    3. Une boîte de dialogue de confirmation doit apparaître. Cliquer sur "Annuler". Le rendez-vous ne doit pas être supprimé.
    4. Cliquer à nouveau sur le bouton de suppression, puis cliquer sur "Confirmer" (ou "OK"). Le bloc doit disparaître instantanément de l'affichage.
    5. Recharger la page (F5) et vérifier que le rendez-vous n'apparaît plus à l'écran et a bien été retiré de la table IndexedDB `appointments`.
