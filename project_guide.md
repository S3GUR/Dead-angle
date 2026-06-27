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
    *   Barre de progression dynamique ajustée en pourcentage.
    *   Temps investi (en heures) avec des boutons **`+`** et **`-`** rapides directement sur la carte pour incrémenter ou décrémenter facilement votre investissement temporel.
    *   Détails sur le budget alloué et la date limite (échéance).
*   **Système de Filtres :** Filtrez instantanément vos projets par statut (Tous, En cours, Non commencés, En pause, Terminés).
*   **Formulaire Modale :** Ajouter ou modifier un projet en un clic.

### 3. Finances & Actifs
*   **Catégorisation libre :** Créez vos comptes bancaires (*Boursorama*, *N26*), vos livrets d'épargne (*Livret A*, *LDD*), vos investissements (*PEA*, *Crypto*), ou vos biens matériels (*PC Gamer*, *Voiture*).
*   **Calcul de Fortune Nette :** Somme automatisée de vos actifs calculée en temps réel.
*   **Graphique à Barres Horizontal :** Pour analyser le montant présent dans chaque sous-catégorie d'actif.

### 4. Fiches de Paie (Revenus)
*   Consignez vos bulletins de salaire mensuels avec l'employeur, le salaire brut, le salaire net perçu, l'impôt prélevé à la source et le nombre d'heures.
*   Gerez l'historique complet pour suivre l'évolution de vos revenus salariés au fil des mois.

### 5. Données & Sauvegarde (LocalStorage)
*   **Export JSON :** Téléchargez l'intégralité de vos données Wink sous forme de fichier `.json` en un clic pour créer des sauvegardes externes.
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
