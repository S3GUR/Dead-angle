import { StateCoordinator } from './StateCoordinator.js';

// Realistic mock news bank to guarantee perfect French simulation when offline or without API key.
const MOCK_NEWS_BANK = {
  fr: {
    finance: [
      {
        title: "Le CAC 40 franchit un nouveau cap historique porté par le luxe",
        sourceName: "Les Échos",
        sourceUrl: "https://www.lesechos.fr/finance-marches",
        summary: "L'indice phare de la Bourse de Paris a dépassé ses plus hauts historiques ce matin, tiré par les résultats exceptionnels des géants du luxe LVMH et Hermès, ainsi que par des perspectives d'inflation plus rassurantes en zone euro."
      },
      {
        title: "Inflation en France : Recul à 1,8% en rythme annuel selon l'Insee",
        sourceName: "Le Monde",
        sourceUrl: "https://www.lemonde.fr/economie",
        summary: "La baisse des prix de l'énergie et la stabilisation des produits alimentaires ont permis à l'inflation française de repasser sous la barre symbolique des 2% pour la première fois depuis plus de trois ans, offrant un répit au pouvoir d'achat."
      },
      {
        title: "La French Tech face au défi du refinancement des startups",
        sourceName: "La Tribune",
        sourceUrl: "https://www.latribune.fr/technos",
        summary: "Malgré un dynamisme persistant dans le secteur de l'intelligence artificielle, les levées de fonds globales des startups françaises ont baissé de 15% ce trimestre. Les investisseurs privilégient désormais la rentabilité à la croissance rapide."
      }
    ],
    tech: [
      {
        title: "Mistral AI dévoile son nouveau modèle de langage open-source",
        sourceName: "L'Usine Digitale",
        sourceUrl: "https://www.usine-digitale.fr/ia",
        summary: "La pépite française de l'intelligence artificielle a annoncé la sortie d'un modèle ultra-léger et hautement optimisé, capable de tourner localement sur des smartphones. Il rivalise avec les performances des meilleurs modèles fermés du marché."
      },
      {
        title: "Souveraineté numérique : Vers un cloud d'État 100% européen",
        sourceName: "ZDNet France",
        sourceUrl: "https://www.zdnet.fr/actualites",
        summary: "Le gouvernement français annonce un plan d'investissement massif pour migrer les données ministérielles sensibles vers des infrastructures exclusivement opérées par des acteurs européens, répondant aux préoccupations sur le Cloud Act américain."
      },
      {
        title: "Cybersécurité : Vague de ransomwares ciblée sur les hôpitaux français",
        sourceName: "Le Figaro Tech",
        sourceUrl: "https://www.lefigaro.fr/secteur/high-tech",
        summary: "L'Agence nationale de la sécurité des systèmes d'information (ANSSI) a émis une alerte critique suite à une recrudescence d'attaques informatiques visant plusieurs centres hospitaliers régionaux. Des mesures d'urgence ont été déployées."
      }
    ],
    general: [
      {
        title: "Lancement des grands chantiers de transition écologique pour 2026",
        sourceName: "Le Point",
        sourceUrl: "https://www.lepoint.fr/societe",
        summary: "Le Premier ministre a présenté un plan d'action visant à accélérer la rénovation énergétique des bâtiments publics et à étendre le réseau ferroviaire régional, soutenu par une enveloppe verte de plusieurs milliards d'euros."
      },
      {
        title: "Festival de Cannes : Les temps forts de la cérémonie d'ouverture",
        sourceName: "Télérama",
        sourceUrl: "https://www.telerama.fr/cinema",
        summary: "Le tapis rouge a accueilli les plus grandes stars du cinéma mondial sous les projecteurs de la Croisette. Cette année, une attention particulière est portée aux créations explorant l'impact sociétal des nouvelles technologies."
      },
      {
        title: "Éducation : Réforme du baccalauréat et retour aux épreuves traditionnelles",
        sourceName: "Libération",
        sourceUrl: "https://www.liberation.fr/societe",
        summary: "Le ministère de l'Éducation nationale a officialisé des ajustements majeurs pour la session prochaine du baccalauréat, avec une part accrue accordée aux épreuves terminales écrites au détriment du contrôle continu."
      }
    ]
  },
  us: {
    finance: [
      {
        title: "Fed Interest Rate Decision: Powell Hints at Future Cuts",
        sourceName: "Wall Street Journal",
        sourceUrl: "https://www.wsj.com/finance",
        summary: "Federal Reserve Chairman Jerome Powell indicated that the central bank is satisfied with the progress on inflation, sparking optimism on Wall Street that interest rate cuts could begin as early as next quarter."
      },
      {
        title: "NVIDIA Stock Surges as AI Chip Demand Reaches All-Time High",
        sourceName: "Bloomberg",
        sourceUrl: "https://www.bloomberg.com/markets",
        summary: "NVIDIA shares jumped another 6% today, pushing the company's valuation to new records. Global tech giants continue to place massive orders for H200 and Blackwell GPUs to train their next-generation LLMs."
      },
      {
        title: "US Retail Sales Beat Expectations, Showing Consumer Resilience",
        sourceName: "CNBC",
        sourceUrl: "https://www.cnbc.com/economy",
        summary: "Consumer spending in the United States remains robust despite high borrowing costs. Retail sales rose by 0.6% last month, driven by strong online shopping performance and automotive sales."
      }
    ],
    tech: [
      {
        title: "OpenAI Launches Advanced Reasoning Model GPT-5 Search Edition",
        sourceName: "TechCrunch",
        sourceUrl: "https://techcrunch.com/artificial-intelligence",
        summary: "OpenAI has announced its newest model featuring real-time web execution and deep multi-step planning. The model is designed to autonomously solve complex engineering problems and search the web with high precision."
      },
      {
        title: "Silicon Valley Tech Giants Form Alliance for Safe Artificial Intelligence",
        sourceName: "Wired",
        sourceUrl: "https://www.wired.com/category/gear",
        summary: "Meta, Google, Microsoft, and Apple have signed a voluntary pact outlining ethical guidelines and safety evaluations for frontier models, aiming to self-regulate before comprehensive federal laws are enacted."
      },
      {
        title: "US Cyber Defense Agency CISA Warns of New Critical Infrastructure Exploit",
        sourceName: "The Verge",
        sourceUrl: "https://www.theverge.com/tech",
        summary: "CISA has issued an emergency directive ordering federal agencies to patch a newly discovered zero-day vulnerability currently being exploited in the wild to target water utilities and grid systems."
      }
    ],
    general: [
      {
        title: "US Midterm Elections: Campaign Rallies Kick Off Nationwide",
        sourceName: "The New York Times",
        sourceUrl: "https://www.nytimes.com/section/politics",
        summary: "Political parties have officially launched their nationwide tours. Key debates are centering around economic policies, border security, healthcare access, and the role of tech regulations."
      },
      {
        title: "NASA's Artemis Crew Completes Simulation for Upcoming Moon Mission",
        sourceName: "Scientific American",
        sourceUrl: "https://www.scientificamerican.com/space",
        summary: "The four astronauts selected for the next lunar flyby have successfully finished an intense 30-day isolation simulation in Houston, validating the environmental control systems of the Orion spacecraft."
      },
      {
        title: "Historic Heatwave Grips the West Coast, Straining Power Grids",
        sourceName: "CNN",
        sourceUrl: "https://www.cnn.com/weather",
        summary: "Temperatures have exceeded 110 degrees Fahrenheit in several California cities, leading to rolling blackouts and warnings from local authorities to limit electricity usage during peak afternoon hours."
      }
    ]
  },
  global: {
    finance: [
      {
        title: "Le FMI réajuste ses prévisions de croissance mondiale à la hausse",
        sourceName: "Financial Times",
        sourceUrl: "https://www.ft.com/global-economy",
        summary: "Le Fonds Monétaire International estime que l'économie mondiale fera preuve d'une meilleure résilience que prévu en 2026, notamment grâce à la reprise vigoureuse de l'activité en Asie et à la baisse généralisée de l'inflation."
      },
      {
        title: "Marché du Pétrole : L'OPEP+ maintient ses quotas de réduction de production",
        sourceName: "Reuters",
        sourceUrl: "https://www.reuters.com/business/energy",
        summary: "Les pays exportateurs de pétrole se sont mis d'accord pour prolonger la réduction volontaire de leur offre de brut jusqu'à la fin de l'année, maintenant le cours du baril de Brent stable autour de 82 dollars."
      },
      {
        title: "La Banque Mondiale lance un fonds d'aide d'urgence pour la dette climatique",
        sourceName: "Le Monde Économique",
        sourceUrl: "https://www.lemonde.fr/economie",
        summary: "Un nouveau mécanisme de financement a été validé pour permettre aux pays en développement les plus vulnérables de suspendre le remboursement de leur dette publique nationale en cas de catastrophe naturelle majeure."
      }
    ],
    tech: [
      {
        title: "Semi-conducteurs : TSMC investit massivement dans de nouvelles fonderies",
        sourceName: "Nikkei Asia",
        sourceUrl: "https://asia.nikkei.com/Business/Tech/Semiconductors",
        summary: "Le géant taïwanais TSMC a validé un plan d'expansion de 12 milliards de dollars pour de nouvelles usines de gravure en 2 nanomètres. Cet investissement vise à répondre à la demande insatiable de puces de calcul IA à travers le globe."
      },
      {
        title: "Régulation mondiale de l'IA : L'ONU adopte sa première charte éthique",
        sourceName: "Courrier International",
        sourceUrl: "https://www.courrierinternational.com/sujet/technologies",
        summary: "L'Assemblée générale des Nations Unies a voté une résolution historique pour encadrer le développement des systèmes autonomes, insistant sur le contrôle humain, la transparence des algorithmes et la protection des droits individuels."
      },
      {
        title: "Une faille zero-day affecte des millions de routeurs à travers le monde",
        sourceName: "Wired Security",
        sourceUrl: "https://www.wired.com/category/security",
        summary: "Des experts en sécurité informatique ont détecté une vulnérabilité critique activement exploitée par un groupe cybercriminel international, permettant de prendre le contrôle d'équipements de réseau domestiques et d'entreprise."
      }
    ],
    general: [
      {
        title: "Climat : Conclusion du sommet mondial sur la biodiversité avec un accord clé",
        sourceName: "BBC News",
        sourceUrl: "https://www.bbc.com/news/science-environment-ecology",
        summary: "Les délégations de 190 pays se sont engagées à protéger officiellement 30% des terres et des océans de la planète d'ici 2030, une victoire saluée par les organisations écologistes mondiales malgré des interrogations sur le financement."
      },
      {
        title: "Sécurité Alimentaire : L'ONU s'alarme des sécheresses prolongées en Afrique",
        sourceName: "Jeune Afrique",
        sourceUrl: "https://www.jeuneafrique.com/actualites",
        summary: "Le Programme Alimentaire Mondial signale qu'une sécheresse sans précédent menace les récoltes dans l'Est africain, et appelle les pays donateurs à débloquer des aides financières d'urgence pour éviter une crise humanitaire majeure."
      },
      {
        title: "Espace : La mission internationale de retour d'échantillons martiens progresse",
        sourceName: "Futura Sciences",
        sourceUrl: "https://www.futura-sciences.com/sciences/actualites-espace",
        summary: "Les agences spatiales ont validé la conception du robot récupérateur autonome. La sonde de transport décollera au début de l'année prochaine pour ramener sur Terre les premiers prélèvements de sol martien."
      }
    ]
  }
};

export class AgentsServiceClass {
  // Helper to generate dynamic publishedAt timestamps within the last 24 hours
  getRandomDateInLast24Hours() {
    const now = new Date();
    const hoursAgo = Math.random() * 24; // Random decimal between 0 and 24
    const date = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    return date.toISOString();
  }

  // Fallback simulator generating French localization of mock news items
  generateMockNews(country) {
    const localizedMocks = MOCK_NEWS_BANK[country] || MOCK_NEWS_BANK['global'];
    const articles = [];
    const fetchedAt = new Date().toISOString();

    const categories = ['finance', 'tech', 'general'];
    categories.forEach(category => {
      const categoryArticles = localizedMocks[category] || [];
      categoryArticles.forEach((art, idx) => {
        articles.push({
          id: `news-${category}-${country}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
          title: art.title,
          sourceName: art.sourceName,
          sourceUrl: art.sourceUrl,
          publishedAt: this.getRandomDateInLast24Hours(),
          summary: art.summary,
          country: country,
          agentType: category,
          fetchedAt: fetchedAt
        });
      });
    });

    return articles;
  }

  // Core invocation logic querying AI Expert Agents or falling back to simulations
  async fetchNewsFromAgents(country) {
    console.log(`[AgentsService] Déclenchement de la récupération des actualités pour le pays : ${country}`);
    
    const state = StateCoordinator.state;
    // Check if network is online
    const isOnline = navigator.onLine;

    // Check if user has defined a custom LLM API Key (stored in settings)
    const llmConfig = state.settings?.llmConfig || {};
    const apiKey = llmConfig.apiKey || '';
    const apiEndpoint = llmConfig.endpoint || ''; // e.g., OpenAI or local Ollama URL
    const apiModel = llmConfig.model || '';

    // If offline or no keys & endpoints configured, fall back to mock news immediately
    if (!isOnline || (!apiKey && !apiEndpoint)) {
      console.log(`[AgentsService] Mode Simulation/Offline activé.`);
      // Short artificial delay of 800ms for realistic user feedback
      await new Promise(resolve => setTimeout(resolve, 800));
      return this.generateMockNews(country);
    }

    // List of experts to request
    const experts = [
      {
        type: 'finance',
        name: 'FinanceExpert',
        prompt: `Tu es FinanceExpert. Ton rôle est de fournir 3 articles d'actualité économique, de marchés financiers, de macroéconomie ou de fintech pour le pays cible : ${country === 'fr' ? 'France' : country === 'us' ? 'USA' : 'Monde/Global'}.`
      },
      {
        type: 'tech',
        name: 'HighTechExpert',
        prompt: `Tu es HighTechExpert. Ton rôle est de fournir 3 articles de veille technologique, d'intelligence artificielle, de développement, de cybersécurité ou de culture geek pour le pays cible : ${country === 'fr' ? 'France' : country === 'us' ? 'USA' : 'Monde/Global'}.`
      },
      {
        type: 'general',
        name: 'GeneralNewsExpert',
        prompt: `Tu es GeneralNewsExpert. Ton rôle est de fournir 3 articles d'actualité généraliste, faits de société, politique nationale ou internationale ou événements majeurs pour le pays cible : ${country === 'fr' ? 'France' : country === 'us' ? 'USA' : 'Monde/Global'}.`
      }
    ];

    const fetchedAt = new Date().toISOString();
    
    // Request all agents in parallel
    const promises = experts.map(async (expert) => {
      try {
        const result = await this.queryLLMAgent(apiKey, apiEndpoint, apiModel, expert.name, expert.prompt);
        // Map and validate response structure
        if (!Array.isArray(result)) {
          throw new Error("La réponse de l'agent n'est pas un tableau JSON.");
        }

        return result.map((art, idx) => {
          if (!art.title || !art.summary) {
            throw new Error("L'article retourné par l'agent manque de propriétés obligatoires.");
          }
          return {
            id: `news-${expert.type}-${country}-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
            title: String(art.title),
            sourceName: String(art.sourceName || 'Média'),
            sourceUrl: String(art.sourceUrl || 'https://www.google.com'),
            publishedAt: String(art.publishedAt || new Date().toISOString()),
            summary: String(art.summary),
            country: country,
            agentType: expert.type,
            fetchedAt: fetchedAt
          };
        });
      } catch (err) {
        const errorMsg = `L'agent ${expert.name} a échoué.`;
        console.error(`[AgentsService] ${errorMsg}`, err);
        // Log to diagnostics logs
        await StateCoordinator.logSystemError('news-agent-error', errorMsg, err.message);
        throw err; // Re-throw so Promise.allSettled knows it failed
      }
    });

    const results = await Promise.allSettled(promises);
    
    const validArticles = [];
    let partialFail = false;

    results.forEach((res, index) => {
      if (res.status === 'fulfilled') {
        validArticles.push(...res.value);
      } else {
        partialFail = true;
      }
    });

    // If all agents failed, fall back to mock news so the interface does not lock up, 
    // but keep track that a partial/full error occurred.
    if (validArticles.length === 0) {
      console.warn("[AgentsService] Tous les appels d'agents ont échoué. Utilisation des actualités simulées.");
      return this.generateMockNews(country);
    }

    if (partialFail) {
      // Return both retrieved articles and fill the missing categories with mocks
      const fetchedTypes = new Set(validArticles.map(a => a.agentType));
      const categories = ['finance', 'tech', 'general'];
      const missingCategories = categories.filter(c => !fetchedTypes.has(c));
      
      const mockNews = this.generateMockNews(country);
      missingCategories.forEach(cat => {
        const missingMocks = mockNews.filter(m => m.agentType === cat);
        validArticles.push(...missingMocks);
      });
      
      // Inject a warning flag on articles array
      validArticles.hasPartialErrors = true;
    }

    return validArticles;
  }

  // Call the LLM (handles Ollama local format or OpenAI generic endpoint)
  async queryLLMAgent(apiKey, endpoint, model, agentName, agentPrompt) {
    const systemInstruction = `${agentPrompt}
Tu dois répondre STRICTEMENT sous la forme d'un tableau JSON d'objets contenant exactement les clés suivantes :
- title : string (Titre en français)
- sourceName : string (Média source réaliste)
- sourceUrl : string (Lien URL valide et réaliste, ex: https://www.lemonde.fr/economie)
- publishedAt : string (Date de publication ISO 8601 actuelle ou récente)
- summary : string (Résumé court de 2-3 phrases maximum de l'actualité)

Règles impératives :
1. Aucun texte de préambule, d'explication ou de salutation.
2. Pas de blocs de code markdown (comme \`\`\`json). Renvoie UNIQUEMENT le JSON valide.
3. Réponds en français.`;

    const targetUrl = endpoint || 'https://api.openai.com/v1/chat/completions';
    const targetModel = model || 'gpt-4o-mini';

    const headers = {
      'Content-Type': 'application/json'
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Handle Ollama vs OpenAI payload structure
    const isOllama = targetUrl.includes('localhost') || targetUrl.includes('127.0.0.1') || targetUrl.includes('/api/chat');
    
    let body;
    if (isOllama) {
      body = JSON.stringify({
        model: targetModel || 'llama3',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: "Donne-moi les 3 actualités récentes." }
        ],
        stream: false,
        format: 'json'
      });
    } else {
      body = JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: "Génère les 3 actualités récentes." }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
    }

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`Erreur réseau API LLM : Code ${response.status}`);
    }

    const data = await response.json();
    let jsonString = '';

    if (isOllama) {
      jsonString = data.message?.content || '';
    } else {
      jsonString = data.choices?.[0]?.message?.content || '';
    }

    // Clean any markdown formatting wrap if any
    jsonString = jsonString.trim();
    if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/^```/, '').replace(/```$/, '').trim();
    }

    return JSON.parse(jsonString);
  }
}

export const AgentsService = new AgentsServiceClass();
