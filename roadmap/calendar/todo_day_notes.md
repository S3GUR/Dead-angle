# Todo - Calendrier : Notes journalières sur le Calendrier

Ce fichier détaille les tâches pour l'intégration de notes textuelles libres pour chaque jour de la semaine directement au sein de l'interface du calendrier hebdomadaire.

## TODOs de développement

### 🗄️ 1. Persistance & Base de Données (IndexedDB / Dexie)
- [ ] TODO : Déclarer la nouvelle table `dayNotes` dans la configuration de la base de données `DeadAngleDatabase` (dans `src/core/Database.js`).
  - Schéma de la table : `&date, content` (où `date` est la clé primaire unique au format de chaîne `YYYY-MM-DD` et `content` est une chaîne de caractères).
- [ ] TODO : Mettre en place un état réactif central pour les notes dans `StateCoordinator.js` sous la clé `dayNotes` pour le stockage en cache mémoire de la session courante.
- [ ] TODO : Écrire une méthode helper dans `Database.js` pour insérer, mettre à jour ou supprimer des entrées de la table `dayNotes` de manière unitaire.
  - Comportement attendu : Si la valeur de `content` transmise est une chaîne vide ou uniquement composée d'espaces, l'enregistrement correspondant à cette date doit être entièrement supprimé de la table `dayNotes` afin d'optimiser l'espace de stockage.

### 🎨 2. Interface Utilisateur (UI)
- [ ] TODO : Dans le module `CalendarModule.js`, modifier le rendu des en-têtes de colonnes de jours dans la vue hebdomadaire.
- [ ] TODO : Ajouter une zone de saisie textuelle de type `<textarea>` ou `<input type="text">` discrète avec la classe CSS `.day-note-textarea` (ou `.calendar-day-note`) en haut de chaque colonne de jour, idéalement juste sous la date du jour.
- [ ] TODO : Configurer l'aspect visuel de cette zone de note dans `src/styles/calendar.css` :
  - Style épuré sans bordure visible par défaut (`border: none; background: transparent; outline: none;`).
  - Effet glassmorphic léger et subtil au survol (`:hover`) ou lors de la prise de focus (`:focus`).
  - Largeur de 100% de la colonne du jour, hauteur fixe d'environ 45px à 60px, avec scrollbar masquée et redimensionnement désactivé (`resize: none;`).
  - Afficher un texte indicatif (placeholder) très discret tel que "Note..." ou "Saisir une note..." uniquement au survol ou lors du focus.
  - Couleur du texte adaptée au mode sombre général avec une opacité réduite (ex: `rgba(255, 255, 255, 0.7)`).

### 🔄 3. Comportement, Chargement & Sauvegarde
- [ ] TODO : Lors du rendu de la semaine active dans le calendrier, récupérer les notes correspondantes aux 7 dates affichées depuis la table `dayNotes` en IndexedDB.
- [ ] TODO : Pré-remplir la valeur de chaque zone de texte `.day-note-textarea` avec le contenu récupéré. Si aucune note n'existe pour ce jour, laisser le champ vide.
- [ ] TODO : Attacher un écouteur d'événement `blur` (perte de focus) sur chaque champ de note.
- [ ] TODO : Mettre en place un mécanisme de sauvegarde automatique :
  - Lors du `blur`, récupérer la valeur textuelle du champ et la date correspondante (stockée dans un attribut `data-date` au format `YYYY-MM-DD` sur le textarea).
  - Si la valeur a changé par rapport à la valeur initiale :
    - Déclencher une mise à jour d'état via `StateCoordinator.updateState` pour la clé `dayNotes`.
    - Sauvegarder la note dans IndexedDB (ou la supprimer si vide).
    - Afficher un indicateur de sauvegarde visuel discret et temporaire (petite coche verte ou micro-animation de fondu) ou une notification toast discrète pour confirmer la persistance de la note.
- [ ] TODO : Optimiser les performances en limitant les requêtes en base : charger l'ensemble des notes de la semaine en une seule requête de type bulk (ex: en utilisant l'opérateur `.where('date').anyOf(datesDeLaSemaine)`) lors de l'initialisation et du changement de semaine.
- [ ] TODO : Gérer le rechargement réactif : si la semaine change (navigation via `#prev-week-btn` ou `#next-week-btn`), vider les champs textuels et charger les notes de la nouvelle plage de dates.

## 🧪 Critères d'acceptation (pour QATester)
- **QA-CAL-NOTES-1** : Écrire le texte "Rendez-vous dentiste 14h" dans la zone de note du Lundi de la semaine en cours, puis cliquer en dehors du champ pour déclencher le `blur`. Recharger complètement la page (`F5`) : la note saisie doit toujours être affichée sur le Lundi de cette même semaine.
- **QA-CAL-NOTES-2** : Naviguer vers la semaine suivante à l'aide du bouton `#next-week-btn`. Vérifier que la note saisie précédemment sur le Lundi de la semaine passée n'est plus visible. Revenir sur la semaine précédente via `#prev-week-btn` : la note doit réapparaître sur le Lundi.
- **QA-CAL-NOTES-3** : Effacer complètement le contenu de la note du Lundi, puis cliquer ailleurs pour perdre le focus. Inspecter la base de données IndexedDB (via l'onglet Application de la console développeur) : l'entrée correspondant à la date du Lundi dans la table `dayNotes` doit avoir été complètement supprimée.
