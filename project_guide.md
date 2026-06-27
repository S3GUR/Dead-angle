# Guide de l'Application : Wink 🧭

**Wink** est un outil de gestion personnelle haut de gamme conçu pour centraliser vos objectifs de vie (projets) et suivre votre patrimoine global (comptes, épargne, investissements, biens matériels) au même endroit.

L'interface utilise un style **Dark Mode Glassmorphism** avec des dégradés de néon violet/bleu, du verre dépoli, et des animations dynamiques.

---

## 🏗️ Structure du Projet

L'application est entièrement développée sans frameworks lourds pour garantir une vitesse maximale et aucun besoin de compilation.

*   [index.html](file:///J:/Wink/index.html) : Contient la structure sémantique HTML5 de l'interface, les fenêtres modales de saisie de données et les liaisons avec les CDN pour les polices, icônes et graphiques.
*   [style.css](file:///J:/Wink/style.css) : Gère toute la charte graphique premium (filtres de flou de verre dépoli, dégradés d'arrière-plan animés, styles de cartes, de formulaires et de barres de progression).
*   [app.js](file:///J:/Wink/app.js) : Contient la logique applicative, le stockage local (`localStorage`), la mise à jour dynamique des graphiques Chart.js et la gestion des événements utilisateurs.

---

## 🌟 Fonctionnalités Implémentées

### 1. Tableau de Bord (Dashboard)
*   **Indicateurs Clés (KPI) :** Affichage en temps réel du Patrimoine Brut, du nombre de Projets Actifs, du Temps Total investi (heures cumulées) et de l'Épargne totale.
*   **Graphique de Répartition :** Un graphique circulaire interactif (Doughnut) qui illustre visuellement la part de chaque classe d'actifs (Comptes courants, Épargne, Bourse/Crypto, Matériel).
*   **Journal d'Activité :** Liste historique dynamique des dernières actions effectuées (création de projets, mise à jour de soldes, etc.).

### 2. Gestion des Projets
*   **Fiches Projets :**
    *   Statut du projet sous forme de badge coloré (*Non commencé*, *En cours*, *En pause*, *Terminé*).
    *   **Checklist de Tâches :** Chaque projet peut contenir une liste de tâches avec des niveaux de **priorité** (*Haute*, *Moyenne*, *Faible*).
    *   **Progression automatique (%) :** Cochez ou décochez les tâches directement depuis la carte du projet pour recalculer et animer la progression en temps réel (ex: 2/4 tâches faites = 50%).
    *   Temps investi (en heures) avec des boutons **`+`** et **`-`** rapides directement sur la carte.
    *   Détails sur le budget alloué et la date limite (échéance).
*   **Système de Filtres :** Filtrez instantanément vos projets par statut (Tous, En cours, Non commencés, En pause, Terminés).
*   **Formulaire Modale :** Saisir ou modifier un projet et gérer ses tâches en un clic.

### 3. Finances & Actifs
*   **Catégorisation libre :** Créez vos comptes bancaires, livrets d'épargne, investissements ou biens matériels.
*   **Calcul de Fortune Nette :** Somme automatisée de vos actifs calculée en temps réel.
*   **Flux Récurrents (Cash Flow) :** 
    *   Saisissez vos revenus (freelancing, loyers perçus, salaires) et vos dépenses fixes (abonnements, loyer, factures).
    *   Choisissez la fréquence (*Hebdomadaire*, *Mensuelle*, *Annuelle*).
    *   **Calculateur d'Épargne Réelle :** L'application normalise tous vos flux sur une base mensuelle pour calculer votre **Capacité d'Épargne Mensuelle** nette et votre **Taux d'Engagement des Revenus** (le pourcentage de vos gains absorbé par les charges).
*   **Graphiques Interactifs :** Doughnut pour la répartition des actifs sur le Tableau de bord et graphique à barres pour l'onglet Finances.

### 4. Fiches de Paie (Revenus)
*   Consignez vos bulletins de salaire mensuels avec l'employeur, le salaire brut, le salaire net perçu, l'impôt prélevé à la source et le nombre d'heures.
*   Gerez l'historique complet pour suivre l'évolution de vos revenus salariés au fil des mois.

### 5. Comparateur d'Épargne & Taux
*   **Données réelles (Juin 2026) :** Comparatif intégrant les livrets réglementés (LEP à 2.5%, Livret A & LDDS à 1.5%) et les livrets en ligne fiscalisés (Distingo Bank, Trade Republic, Bourso+, Fortuneo).
*   **Simulateur d'intérêts interactif :** Modifiez la somme à simuler (ex: 10 000 €) pour voir immédiatement les gains nets à 1 an générés.
*   **Intelligence fiscale & plafonds :**
    *   Les calculs d'intérêts respectent les plafonds de dépôt (ex: Livret A à 22 950 €). Les fonds au-delà du plafond ne génèrent pas d'intérêts simulés sur ce livret.
    *   Prise en compte de la **Flat Tax française (30%)** : Une option permet de déduire automatiquement les impôts sur les livrets fiscalisés pour comparer les vrais rendements nets.
*   **Graphique de comparaison (Chart.js) :** Pour identifier d'un coup d'œil le livret le plus avantageux selon la somme simulée.

### 6. Suivi Gaming & Intégration Steam
*   **Bibliothèque de jeux :** Suivez vos jeux préférés avec leur temps de jeu, votre pic d'Elo ou de rang (ex: Diamond I, Global Elite, 2000 Elo), et votre progression de succès.
*   **Incrémentation rapide :** Des boutons `+5h` et `-5h` directement sur les cartes de jeux vous permettent d'ajuster votre temps de jeu en un clic.
*   **Bannières officielles :** Renseignez le Steam AppID (ex: `730` pour CS2, `1245620` pour Elden Ring) pour charger automatiquement l'affiche officielle du jeu depuis le CDN Steam.
*   **Importation simplifiée (SANS clé API) :** Cliquez sur **« Importer via Profil Steam »** et entrez simplement votre identifiant public (ex : `Wiseee`). L'application va lire votre page de profil public en tâche de fond et importer d'un coup tous vos jeux avec leurs heures de jeu respectives.
*   **Synchronisation complète (AVEC clé API) :** Si vous renseignez votre clé API Steam et votre SteamID64 dans les paramètres, un bouton de synchronisation complète s'activera pour mettre également à jour vos succès en direct.

### 7. Données & Sauvegarde (LocalStorage)
*   **Export JSON :** Téléchargez l'intégralité de vos données Wink (projets, tâches, finances, paies, flux et jeux) sous forme de fichier `.json`.
*   **Import JSON :** Restaurez une sauvegarde précédente en glissant/déposant votre fichier JSON.
*   **Réinitialisation :** Bouton pour effacer l'ensemble de la base locale et recharger les données d'exemple.

---

## 🔌 Lancement Local

L'application est servie localement sur votre ordinateur. Un serveur Node.js ultra-léger a été lancé en tâche de fond.

> [!TIP]
> Vous pouvez accéder à votre application à l'adresse suivante :
> 👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

Pour arrêter ou relancer le serveur manuellement :
*   Le serveur tourne en tâche de fond via la commande : `npx http-server -p 8000`.
*   Toutes les données sont stockées de façon sécurisée directement dans la base locale de votre navigateur Web.

---

## 📊 Modèle de Données Local (LocalStorage)

Voici la structure de l'objet JSON utilisé pour stocker l'état de l'application :

```json
{
  "projects": [
    {
      "id": "string (timestamp)",
      "name": "string",
      "description": "string",
      "status": "not-started | in-progress | on-hold | completed",
      "progress": 0, // 0 to 100
      "timeSpent": 0, // float
      "deadline": "YYYY-MM-DD",
      "budget": 0 // float
    }
  ],
  "finances": [
    {
      "id": "string",
      "name": "string",
      "type": "bank | savings | investment | asset | other",
      "balance": 0.0,
      "lastUpdated": "ISO date string"
    }
  ],
  "payslips": [
    {
      "id": "string",
      "month": "string",
      "year": 2026,
      "employer": "string",
      "gross": 0.0,
      "net": 0.0,
      "tax": 0.0,
      "hours": 0.0
    }
  ],
  "activities": [
    {
      "id": "string",
      "type": "project | finance",
      "text": "string",
      "time": "string"
    }
  ]
}
```
