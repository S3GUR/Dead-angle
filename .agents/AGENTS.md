# 🧭 Règles de Développement : Wink (AGENTS.md)

Ce fichier définit les consignes d'architecture, de workflow Git et d'ingénierie logicielle que tout agent IA doit rigoureusement respecter pour le développement du projet Wink.

---

## 🏗️ 1. Architecture Fichiers & Code Propre (Clean Architecture)
Il est strictement interdit de continuer à accumuler du code dans des fichiers monolithiques géants (`app.js` ou `style.css`).
- **Principe de Responsabilité Unique (SRP) :** Chaque module doit avoir sa propre classe JavaScript autonome et son propre fichier.
- **Structure modulaire ES6 :** L'application doit utiliser l'import/export ES6 natif.
- **Architecture de dossiers cible :**
  - `src/core/` : Cœur de l'application (Gestion de l'état central `StateCoordinator`, gestion des bases de données).
  - `src/modules/` : Classes de modules autonomes (`DashboardModule.js`, `ProjectsModule.js`, `FinanceModule.js`, `PayslipsModule.js`, `RatesModule.js`, `GamingModule.js`, `AnimesModule.js`).
  - `src/styles/` : Fichiers CSS séparés par module, importés ou référencés dynamiquement.

---

## ⚙️ 2. Modulabilité & Feature Toggles
- **Optionnalité obligatoire :** Toute fonctionnalité ajoutée "sur le côté" (en dehors du noyau central du tableau de bord) doit pouvoir être activée ou désactivée à la demande de l'utilisateur.
- **Case à cocher (Paramètres) :** Un toggle (switch ou case à cocher) doit obligatoirement être présent dans l'onglet **Paramètres** pour chaque module.
- **Masquage dynamique :** Désactiver un module doit masquer instantanément son onglet dans la navigation latérale et désactiver toute interactivité s'y rapportant (redirection vers le Dashboard en cas de tentative d'accès).

---

## 📊 3. Centralisation & Base de Données
- **Transition technologique :** Le stockage local `localStorage` brut doit être remplacé par IndexedDB (via une bibliothèque performante comme Dexie.js) pour gérer des volumes de données plus importants de manière asynchrone (ex: centaines d'animes et de jeux avec images sans saturation).
- **Structure des tables :** La base de données doit proprement modéliser les tables pour :
  - Les configurations utilisateur (clés API, thèmes, préférences de modules).
  - Les projets et leurs listes de tâches.
  - Les comptes financiers, flux récurrents, et transactions.
  - Les fiches de paie.
  - La bibliothèque de jeux (Steam) et la liste d'animes (MAL).
  - Le journal système (diagnostic logs) et le journal d'activité.

---

## 🔀 4. Stratégie Git & Workflow de Commits
- **Feature Branching :** Chaque développement de fonctionnalité ou de correctif doit s'effectuer sur une branche Git dédiée (ex: `feature/nom-de-la-feature` ou `bugfix/nom-du-bug`).
- **Fin des micro-commits :** Fini les commits au compte-gouttes directement sur la branche principale (`main`).
- **Validation avant Merge :** La fonctionnalité doit être entièrement validée localement par l'agent IA, puis testée, avant de faire l'objet d'un unique merge propre de la branche vers la branche principale `main` (ou via Pull Request propre).

---

## 🔗 5. Interconnexion des Modules
Les données ne doivent pas vivre en silo. Chaque module doit interagir logiquement avec les autres :
- **Finance ⟷ Paies :** Enregistrer une fiche de paie doit pouvoir créditer automatiquement le compte bancaire courant associé.
- **Finance ⟷ Projets :** Le budget défini sur un projet doit pouvoir être lié à une catégorie d'actifs financiers de type "projets/dépenses".
- **Finance ⟷ Gaming/Animes :** L'achat de jeux ou abonnements d'animes doit pouvoir générer des flux de dépenses récurrents ou des transactions ponctuelles dans le module Finance.

---

## 🔒 6. Limites d'Autonomie & Sécurité des Données
- **Interdiction de merge automatique :** L'agent IA ne doit jamais fusionner (merge) de branche vers `main` de manière autonome sans une validation explicite de l'utilisateur dans le chat.
- **Protection des données locales :** Toute action ou commande de terminal susceptible de modifier de manière destructive ou de supprimer des fichiers sources ou des bases de données locales (fichiers `.json`, bases Dexie/IndexedDB, `localStorage`) doit faire l'objet d'une validation humaine préalable.

