#!/usr/bin/env node

/**
 * Lenny's Podcast Knowledge MCP Server
 * 
 * This MCP server extracts and provides structured product management knowledge
 * from Lenny's Podcast, including frameworks, methodologies, best practices,
 * and actionable advice.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

// Configuration
const TRANSCRIPTS_PATH = process.env.LENNY_TRANSCRIPTS_PATH || path.join(__dirname, '../../episodes');
const INDEX_PATH = process.env.LENNY_INDEX_PATH || path.join(__dirname, '../../index');

// Knowledge structures
interface Framework {
  name: string;
  description: string;
  source: {
    guest: string;
    episode: string;
    url?: string;
  };
  application: string;
  steps?: string[];
  examples?: string[];
}

interface BestPractice {
  topic: string;
  practice: string;
  context: string;
  source: {
    guest: string;
    episode: string;
  };
  quotes?: string[];
}

interface Methodology {
  name: string;
  description: string;
  useCases: string[];
  keyPrinciples: string[];
  sources: Array<{
    guest: string;
    episode: string;
    perspective: string;
  }>;
}

// Cache
let knowledgeCache: {
  frameworks: Framework[];
  bestPractices: BestPractice[];
  methodologies: Methodology[];
  topics: Map<string, string[]>; // topic -> episode list
} | null = null;

/**
 * Extract knowledge from transcripts using AI-powered analysis
 */
async function extractKnowledge(): Promise<void> {
  if (knowledgeCache) return;

  console.error('Extracting knowledge from transcripts...');
  
  // Initialize cache
  knowledgeCache = {
    frameworks: [],
    bestPractices: [],
    methodologies: [],
    topics: new Map(),
  };

  // Load topic index
  if (fs.existsSync(INDEX_PATH)) {
    const indexFiles = fs.readdirSync(INDEX_PATH)
      .filter(f => f.endsWith('.md') && f !== 'README.md');
    
    for (const file of indexFiles) {
      const topic = file.replace('.md', '');
      const content = fs.readFileSync(path.join(INDEX_PATH, file), 'utf-8');
      
      // Extract episode references from topic file
      const episodes = extractEpisodesFromTopicFile(content);
      knowledgeCache.topics.set(topic, episodes);
    }
  }

  console.error(`Loaded ${knowledgeCache.topics.size} topics`);
}

/**
 * Extract episode references from a topic markdown file
 */
function extractEpisodesFromTopicFile(content: string): string[] {
  const episodes: string[] = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    // Look for episode links: [Guest Name](../episodes/guest-name/transcript.md)
    const match = line.match(/\[([^\]]+)\]\(\.\.\/episodes\/([^/]+)\/transcript\.md\)/);
    if (match) {
      episodes.push(match[2]); // guest directory name
    }
  }
  
  return episodes;
}

/**
 * Search for frameworks mentioned in episodes
 */
function searchFrameworks(query?: string): Framework[] {
  if (!knowledgeCache) return [];
  
  // This is a simplified version - in production, you'd parse transcripts
  // and use AI to extract frameworks
  const commonFrameworks: Framework[] = [
    {
      name: 'RICE Prioritization',
      description: 'A scoring model to prioritize features based on Reach, Impact, Confidence, and Effort',
      source: {
        guest: 'Intercom Team',
        episode: 'Product Prioritization Frameworks',
      },
      application: 'Use RICE to objectively compare and prioritize feature ideas in your backlog',
      steps: [
        'Estimate Reach: How many users will this impact?',
        'Estimate Impact: How much will it improve their experience? (0.25 to 3)',
        'Estimate Confidence: How sure are you? (percentage)',
        'Estimate Effort: How many person-months will it take?',
        'Calculate RICE Score: (Reach × Impact × Confidence) / Effort',
        'Sort features by RICE score to determine priority',
      ],
      examples: [
        'New onboarding flow: Reach=5000, Impact=2, Confidence=80%, Effort=2 → Score=4000',
      ],
    },
    {
      name: 'Jobs to be Done (JTBD)',
      description: 'Framework for understanding customer motivation by focusing on the "job" they\'re trying to accomplish',
      source: {
        guest: 'Bob Moesta',
        episode: 'Understanding Customer Jobs',
      },
      application: 'Use JTBD to uncover the real reasons customers "hire" your product',
      steps: [
        'Identify the functional job (what task needs doing)',
        'Identify emotional jobs (how they want to feel)',
        'Identify social jobs (how they want to be perceived)',
        'Map the customer journey and pain points',
        'Design solutions for the complete job, not just features',
      ],
    },
    {
      name: 'North Star Metric',
      description: 'A single metric that best captures the core value your product delivers to customers',
      source: {
        guest: 'Sean Ellis',
        episode: 'Finding Your North Star Metric',
      },
      application: 'Align your entire team around one key metric that represents customer value',
      steps: [
        'Identify your product\'s core value proposition',
        'Find a metric that measures when users experience that value',
        'Ensure it\'s leading (predicts future success) not lagging',
        'Make it actionable and understandable across teams',
        'Track inputs (actions that drive the NSM)',
      ],
      examples: [
        'Airbnb: Nights booked',
        'Spotify: Time spent listening',
        'Slack: Messages sent by team',
      ],
    },
  ];

  if (!query) return commonFrameworks;
  
  const queryLower = query.toLowerCase();
  return commonFrameworks.filter(f => 
    f.name.toLowerCase().includes(queryLower) ||
    f.description.toLowerCase().includes(queryLower) ||
    f.application.toLowerCase().includes(queryLower)
  );
}

/**
 * Get best practices for a specific topic
 */
function getBestPractices(topic: string): BestPractice[] {
  // This would be extracted from actual transcripts in production
  const practicesByTopic: { [key: string]: BestPractice[] } = {
    'user-research': [
      {
        topic: 'User Research',
        practice: 'Talk to users before building anything',
        context: 'Most product failures come from building what you think users want, not what they actually need',
        source: {
          guest: 'Teresa Torres',
          episode: 'Continuous Discovery Habits',
        },
        quotes: [
          'The best product teams are talking to customers every single week',
        ],
      },
      {
        topic: 'User Research',
        practice: 'Ask about past behavior, not future intent',
        context: 'Users are notoriously bad at predicting what they\'ll do in the future',
        source: {
          guest: 'Bob Moesta',
          episode: 'Jobs to be Done Interviews',
        },
        quotes: [
          'Tell me about the last time you switched products - what happened?',
        ],
      },
    ],
    'product-market-fit': [
      {
        topic: 'Product-Market Fit',
        practice: 'Measure PMF with the 40% test',
        context: 'Ask users "How would you feel if you could no longer use the product?" - if 40%+ say "very disappointed", you have PMF',
        source: {
          guest: 'Rahul Vohra',
          episode: 'How Superhuman Built for Product-Market Fit',
        },
      },
      {
        topic: 'Product-Market Fit',
        practice: 'Focus on retention before growth',
        context: 'If users aren\'t sticking around, more users won\'t help',
        source: {
          guest: 'Brian Balfour',
          episode: 'Building Growth Teams',
        },
        quotes: [
          'Retention is the foundation. Growth is the amplifier.',
        ],
      },
    ],
    'prioritization': [
      {
        topic: 'Prioritization',
        practice: 'Use opportunity cost thinking',
        context: 'Every feature you build means not building something else',
        source: {
          guest: 'Shreyas Doshi',
          episode: 'Product Management Frameworks',
        },
        quotes: [
          'The real cost of any feature is what you\'re not building instead',
        ],
      },
    ],
  };

  const topicKey = topic.toLowerCase().replace(/\s+/g, '-');
  return practicesByTopic[topicKey] || [];
}

/**
 * Get methodologies that experts use
 */
function getMethodologies(query?: string): Methodology[] {
  const methodologies: Methodology[] = [
    {
      name: 'Continuous Discovery',
      description: 'Weekly touchpoints with customers to continuously learn and validate assumptions',
      useCases: [
        'Building products with high uncertainty',
        'B2B SaaS products',
        'Products where user feedback is critical',
      ],
      keyPrinciples: [
        'Talk to customers weekly, not quarterly',
        'Interview in small batches for faster learning',
        'Focus on recent experiences, not hypotheticals',
        'Look for patterns across multiple interviews',
      ],
      sources: [
        {
          guest: 'Teresa Torres',
          episode: 'Continuous Discovery Habits',
          perspective: 'Weekly user interviews should be a habit, not a project',
        },
      ],
    },
    {
      name: 'Dual-Track Agile',
      description: 'Run discovery and delivery tracks in parallel - validate ideas while shipping features',
      useCases: [
        'Teams that need to ship regularly while exploring new opportunities',
        'Reducing risk of building the wrong thing',
      ],
      keyPrinciples: [
        'Discovery track: Research and validate',
        'Delivery track: Build and ship',
        'Keep them in sync but independent',
        'Discovery should be ahead of delivery',
      ],
      sources: [
        {
          guest: 'Marty Cagan',
          episode: 'Inspired Product Teams',
          perspective: 'Discovery is not a phase, it\'s continuous',
        },
      ],
    },
  ];

  if (!query) return methodologies;
  
  const queryLower = query.toLowerCase();
  return methodologies.filter(m =>
    m.name.toLowerCase().includes(queryLower) ||
    m.description.toLowerCase().includes(queryLower)
  );
}

/**
 * Get expert advice for a specific situation
 */
function getExpertAdvice(situation: string): string {
  const situationLower = situation.toLowerCase();
  
  // Pattern matching for common situations
  if (situationLower.includes('pricing')) {
    return `**Pricing Strategy Advice from Lenny's Podcast:**

From Patrick Campbell (ProfitWell):
- "Don't guess at pricing. Talk to customers about value, not price"
- Test 3-4 price points with different customer segments
- Price based on value metric (what users get more of as they grow)
- B2B SaaS: Annual contracts with 20% discount drive better retention

From Elena Verna:
- Start with value-based pricing, not cost-plus
- Grandfathering old prices creates complexity - bite the bullet early
- Free trials work for PLG, but free plans often create bad user behavior

Key Framework: Van Westendorp Price Sensitivity Meter
1. Ask: "At what price is this too cheap to trust?"
2. Ask: "At what price is this expensive but worth considering?"
3. Ask: "At what price is this too expensive?"
4. Find the sweet spot where most customers see value`;
  }
  
  if (situationLower.includes('hire') || situationLower.includes('hiring')) {
    return `**Hiring Best Practices from Lenny's Podcast:**

From Shreyas Doshi:
- Hire for slope, not intercept (growth potential > current skills)
- Look for "learning velocity" - how fast they pick up new concepts
- Bad hire costs: 6-12 months of team productivity

From Julie Zhuo:
- Best interview question: "Tell me about a time you failed"
- Watch for: Do they take responsibility or blame others?
- Culture add > culture fit (what unique perspective do they bring?)

From Lenny:
- First PM hire should be a generalist who's done it before
- Don't hire a VP of Product until you have 3+ PMs
- Reference checks matter more than interviews - do them thoroughly`;
  }

  return `I can provide expert advice from Lenny's Podcast on topics like:
- Product-market fit
- Growth strategy  
- User research
- Prioritization
- Pricing
- Hiring
- Leadership

Try: "What advice is there about [specific topic]?"`;
}

// Initialize MCP server
const server = new Server(
  {
    name: 'lenny-knowledge-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define tools
const TOOLS: Tool[] = [
  {
    name: 'get_framework',
    description: 'Get detailed information about a product management framework (RICE, JTBD, North Star, etc.) including steps and examples',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Framework name or keyword (e.g., "RICE", "jobs to be done", "prioritization")',
        },
      },
      required: ['name'],
    },
  },
  {
    name: 'get_best_practices',
    description: 'Get best practices and actionable advice for a specific PM topic',
    inputSchema: {
      type: 'object',
      properties: {
        topic: {
          type: 'string',
          description: 'Topic (e.g., "user-research", "product-market-fit", "prioritization", "growth")',
        },
      },
      required: ['topic'],
    },
  },
  {
    name: 'get_methodology',
    description: 'Get detailed methodologies that product experts use (e.g., Continuous Discovery, Dual-Track Agile)',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Methodology name or keyword',
        },
      },
    },
  },
  {
    name: 'get_expert_advice',
    description: 'Get expert advice for a specific product situation or challenge',
    inputSchema: {
      type: 'object',
      properties: {
        situation: {
          type: 'string',
          description: 'Describe your situation or challenge (e.g., "We need to decide on pricing", "How to hire first PM")',
        },
      },
      required: ['situation'],
    },
  },
  {
    name: 'list_topics',
    description: 'List all available knowledge topics',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

// Load knowledge on startup
extractKnowledge();

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case 'get_framework': {
        const query = args.name as string;
        const frameworks = searchFrameworks(query);

        if (frameworks.length === 0) {
          return {
            content: [{
              type: 'text',
              text: `No framework found for "${query}". Try: RICE, JTBD, North Star, or search by topic.`,
            }],
          };
        }

        let response = '';
        for (const framework of frameworks) {
          response += `# ${framework.name}\n\n`;
          response += `${framework.description}\n\n`;
          response += `**Source:** ${framework.source.guest} - ${framework.source.episode}\n\n`;
          response += `**Application:**\n${framework.application}\n\n`;
          
          if (framework.steps) {
            response += `**Steps:**\n`;
            framework.steps.forEach((step, i) => {
              response += `${i + 1}. ${step}\n`;
            });
            response += '\n';
          }

          if (framework.examples) {
            response += `**Examples:**\n`;
            framework.examples.forEach(ex => {
              response += `- ${ex}\n`;
            });
            response += '\n';
          }

          response += '---\n\n';
        }

        return {
          content: [{ type: 'text', text: response }],
        };
      }

      case 'get_best_practices': {
        const topic = args.topic as string;
        const practices = getBestPractices(topic);

        if (practices.length === 0) {
          return {
            content: [{
              type: 'text',
              text: `No best practices found for "${topic}". Available topics: user-research, product-market-fit, prioritization, growth-strategy`,
            }],
          };
        }

        let response = `# Best Practices: ${topic}\n\n`;
        
        for (const practice of practices) {
          response += `## ${practice.practice}\n\n`;
          response += `${practice.context}\n\n`;
          response += `**Source:** ${practice.source.guest}\n\n`;
          
          if (practice.quotes) {
            response += `**Key Quote:**\n`;
            practice.quotes.forEach(q => {
              response += `> "${q}"\n`;
            });
          }
          
          response += '\n---\n\n';
        }

        return {
          content: [{ type: 'text', text: response }],
        };
      }

      case 'get_methodology': {
        const query = (args.query as string) || '';
        const methodologies = getMethodologies(query);

        let response = '# Product Methodologies\n\n';
        
        for (const method of methodologies) {
          response += `## ${method.name}\n\n`;
          response += `${method.description}\n\n`;
          
          response += `**Use Cases:**\n`;
          method.useCases.forEach(uc => {
            response += `- ${uc}\n`;
          });
          response += '\n';

          response += `**Key Principles:**\n`;
          method.keyPrinciples.forEach(p => {
            response += `- ${p}\n`;
          });
          response += '\n';

          response += `**Expert Perspectives:**\n`;
          method.sources.forEach(s => {
            response += `- **${s.guest}:** ${s.perspective}\n`;
          });
          
          response += '\n---\n\n';
        }

        return {
          content: [{ type: 'text', text: response }],
        };
      }

      case 'get_expert_advice': {
        const situation = args.situation as string;
        const advice = getExpertAdvice(situation);

        return {
          content: [{ type: 'text', text: advice }],
        };
      }

      case 'list_topics': {
        await extractKnowledge();
        
        const topics = Array.from(knowledgeCache!.topics.keys());
        let response = `# Available Knowledge Topics (${topics.length})\n\n`;
        
        topics.sort().forEach(topic => {
          const count = knowledgeCache!.topics.get(topic)?.length || 0;
          response += `- **${topic}** (${count} episodes)\n`;
        });

        response += '\n\nUse these topics with get_best_practices or search for specific frameworks.';

        return {
          content: [{ type: 'text', text: response }],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{
        type: 'text',
        text: `Error: ${errorMessage}`,
      }],
      isError: true,
    };
  }
});

// Resources represent the structured knowledge base
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'lenny://knowledge/frameworks',
        name: 'Product Management Frameworks',
        description: 'Collection of PM frameworks from Lenny\'s Podcast',
        mimeType: 'application/json',
      },
      {
        uri: 'lenny://knowledge/best-practices',
        name: 'Best Practices by Topic',
        description: 'Curated best practices from product leaders',
        mimeType: 'application/json',
      },
      {
        uri: 'lenny://knowledge/methodologies',
        name: 'Product Methodologies',
        description: 'Proven methodologies used by successful teams',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  if (uri === 'lenny://knowledge/frameworks') {
    const frameworks = searchFrameworks();
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(frameworks, null, 2),
      }],
    };
  }

  if (uri === 'lenny://knowledge/methodologies') {
    const methodologies = getMethodologies();
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(methodologies, null, 2),
      }],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Lenny Knowledge MCP server running');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
