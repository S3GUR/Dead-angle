# Todo - Infos : Intégration des agents experts

Ce fichier détaille les tâches pour le requêtage, la structuration et la récupération des données provenant des trois agents experts IA.

## TODOs de développement

### 🧠 1. Rôles et Spécifications des Agents Experts
- [ ] TODO : Définir la logique de spécialisation des trois agents experts :
  - **`FinanceExpert`** : En charge de l'actualité économique, des marchés financiers, de la macroéconomie, des entreprises du CAC40/Nasdaq et des technologies de la fintech.
  - **`HighTechExpert`** : En charge de la veille technologique, des avancées en Intelligence Artificielle (modèles, frameworks), des semi-conducteurs, du développement logiciel, de la cybersécurité et de la culture geek.
  - **`GeneralNewsExpert`** : En charge de l'actualité généraliste (faits de société marquants, politique nationale/internationale, grands événements géopolitiques).

### 🌐 2. Service d'Appels & Prompt Engineering (AgentsService.js)
- [ ] TODO : Créer le fichier `src/core/AgentsService.js` gérant les appels d'agents IA (via un pont API LLM local ou distant comme Ollama, OpenAI, Claude ou un proxy dédié).
- [ ] TODO : Écrire les prompts système (`systemPrompt`) structurant le comportement de chaque agent pour assurer une réponse au format JSON brut valide sans fioritures (pas de markdown en dehors du JSON).
  - Exemple de structure de prompt système :
    > "Tu es [Expert]. Ton rôle est de fournir 3 articles résumés d'actualité pour le pays cible : [Pays]. Tu dois répondre STRICTEMENT sous la forme d'un tableau JSON d'objets contenant les champs : title, sourceName, sourceUrl, publishedAt, summary. N'écris aucun texte explicatif avant ou après le JSON."
- [ ] TODO : Écrire la fonction d'orchestration `fetchNewsFromAgents(country)` qui :
  - Identifie le pays sélectionné (`fr`, `us`, `global`).
  - Lance l'invocation asynchrone des trois agents en parallèle à l'aide de `Promise.allSettled`.

### 🛡️ 3. Mécanisme de Fallback et Générateur de Mocks (Hors-ligne / Sans clé API)
- [ ] TODO : Implémenter un mode simulation (mocking) robuste dans `AgentsService.js` :
  - Si aucune connexion Internet n'est détectée ou si aucune clé API LLM n'est configurée, basculer automatiquement sur la génération d'actualités simulées.
  - Le simulateur doit générer des titres et des résumés d'actualité cohérents et réalistes en français, spécifiques au pays sélectionné (ex: des sujets sur l'inflation en France pour `fr` / `FinanceExpert`, ou sur la Silicon Valley pour `us` / `HighTechExpert`).
  - Les dates de publication des mocks doivent être dynamiques (générées dans les dernières 24 heures).

### 🚨 4. Gestion des Erreurs et Diagnostics
- [ ] TODO : Gérer les échecs partiels d'appels réseau ou d'analyse JSON (Parsing JSON) :
  - Si un agent renvoie une réponse invalide, rejeter sa réponse mais conserver et stocker les réponses valides des autres agents.
  - Enregistrer chaque erreur de parsing ou d'indisponibilité dans le journal de diagnostic système de l'application via `StateCoordinator.logSystemError('news-agent-error', errorMessage, errorDetails)`.
  - Afficher un bandeau d'avertissement non bloquant sur l'interface IHM pour informer l'utilisateur qu'une partie des sources n'a pas pu être actualisée.

## 🧪 Critères d'acceptation (pour QATester)

- **QA-NEWS-AGENTS-1** : Cliquer sur le bouton "Actualiser" doit déclencher l'appel asynchrone des trois agents experts. La grille doit se remplir d'articles pour chacune des trois catégories (Économie, Tech, Général).
- **QA-NEWS-AGENTS-2** : Couper la connexion réseau du navigateur (mode Offline dans les outils développeur) puis cliquer sur "Actualiser" doit déclencher le mode dégradé (simulation) sans bloquer l'IHM. Des articles simulés mais réalistes et localisés selon le pays sélectionné doivent s'afficher en moins de 1,5 seconde.
- **QA-NEWS-AGENTS-3** : Si un appel d'agent échoue ou renvoie un JSON malformé, un log d'erreur doit être enregistré et visible dans l'onglet Paramètres (section Diagnostics et logs système). L'application doit tout de même afficher les articles des autres agents ayant répondu correctement.
