#!/usr/bin/env node

/**
 * Knowledge Extraction Tool
 * 
 * This script uses AI to extract structured knowledge from Lenny's Podcast transcripts:
 * - Frameworks and models
 * - Best practices
 * - Methodologies
 * - Actionable advice
 * - Mental models
 */

import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

const TRANSCRIPTS_PATH = process.env.LENNY_TRANSCRIPTS_PATH || path.join(process.cwd(), 'episodes');
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(process.cwd(), 'knowledge');

interface ExtractedKnowledge {
  frameworks: Array<{
    name: string;
    description: string;
    source: { guest: string; episode: string };
    steps?: string[];
    application: string;
  }>;
  bestPractices: Array<{
    topic: string;
    practice: string;
    context: string;
    source: { guest: string; episode: string };
    quote?: string;
  }>;
  mentalModels: Array<{
    name: string;
    description: string;
    whenToUse: string;
    source: { guest: string; episode: string };
  }>;
  actionableAdvice: Array<{
    situation: string;
    advice: string;
    source: { guest: string; episode: string };
  }>;
}

/**
 * Parse transcript file
 */
function parseTranscript(filePath: string): { metadata: any; content: string } {
  const content = fs.readFileSync(filePath, 'utf-8');
  const parts = content.split('---');
  
  if (parts.length >= 3) {
    const metadata = yaml.load(parts[1].trim());
    const transcript = parts.slice(2).join('---').trim();
    return { metadata, content: transcript };
  }
  
  return { metadata: {}, content };
}

/**
 * Extract knowledge from a single transcript
 * In a real implementation, this would call Claude API or use embeddings
 */
function extractKnowledgeFromTranscript(
  metadata: any,
  content: string
): Partial<ExtractedKnowledge> {
  
  const knowledge: Partial<ExtractedKnowledge> = {
    frameworks: [],
    bestPractices: [],
    mentalModels: [],
    actionableAdvice: [],
  };

  // Look for framework mentions
  const frameworkKeywords = [
    'framework', 'model', 'RICE', 'OKR', 'JTBD', 'jobs to be done',
    'north star', 'growth loop', 'flywheel', 'funnel'
  ];

  for (const keyword of frameworkKeywords) {
    const regex = new RegExp(`${keyword}[^.!?]*[.!?]`, 'gi');
    const matches = content.match(regex);
    
    if (matches && matches.length > 2) {
      // Extract context around framework mentions
      // This is simplified - production version would use Claude API
      console.log(`Found ${matches.length} mentions of "${keyword}" in ${metadata.guest}`);
    }
  }

  // Look for best practices indicators
  const practiceIndicators = [
    'the best way', 'what works', 'what I recommend', 'the key is',
    'most important', 'critical to', 'always', 'never', 'you should'
  ];

  // Look for mental models
  const mentalModelIndicators = [
    'think of it as', 'mental model', 'way to think about', 'framework for thinking'
  ];

  return knowledge;
}

/**
 * Prompt template for Claude API to extract frameworks
 */
const FRAMEWORK_EXTRACTION_PROMPT = `Analyze this podcast transcript and extract any product management frameworks or models mentioned.

For each framework found, provide:
1. Name of the framework
2. Clear description (2-3 sentences)
3. When and how to apply it
4. Step-by-step process (if mentioned)
5. Any examples given

Transcript excerpt:
{transcript}

Return as JSON array with this structure:
[{
  "name": "Framework name",
  "description": "What it is and what it solves",
  "application": "When and how to use it",
  "steps": ["Step 1", "Step 2", ...],
  "examples": ["Example 1", ...]
}]`;

/**
 * Prompt template for extracting best practices
 */
const BEST_PRACTICES_PROMPT = `Extract actionable best practices and advice from this podcast transcript.

Focus on:
- Concrete recommendations (do X, don't do Y)
- Lessons learned from experience
- Common mistakes to avoid
- Success patterns

For each practice, include:
1. The practice/advice
2. Context (why it matters, when to apply)
3. Supporting quote (if available)

Transcript excerpt:
{transcript}

Return as JSON array.`;

/**
 * Main extraction process
 */
async function main() {
  console.log('Lenny Podcast Knowledge Extraction');
  console.log('===================================\n');

  if (!fs.existsSync(TRANSCRIPTS_PATH)) {
    console.error(`Error: Transcripts path not found: ${TRANSCRIPTS_PATH}`);
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  // Get all episode directories
  const guestDirs = fs.readdirSync(TRANSCRIPTS_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${guestDirs.length} episodes\n`);

  const allKnowledge: ExtractedKnowledge = {
    frameworks: [],
    bestPractices: [],
    mentalModels: [],
    actionableAdvice: [],
  };

  // Process each episode
  for (const guestDir of guestDirs) {
    const transcriptPath = path.join(TRANSCRIPTS_PATH, guestDir, 'transcript.md');
    
    if (!fs.existsSync(transcriptPath)) continue;

    console.log(`Processing: ${guestDir}...`);

    const { metadata, content } = parseTranscript(transcriptPath);
    const knowledge = extractKnowledgeFromTranscript(metadata, content);

    // Merge knowledge
    if (knowledge.frameworks) allKnowledge.frameworks.push(...knowledge.frameworks);
    if (knowledge.bestPractices) allKnowledge.bestPractices.push(...knowledge.bestPractices);
    if (knowledge.mentalModels) allKnowledge.mentalModels.push(...knowledge.mentalModels);
    if (knowledge.actionableAdvice) allKnowledge.actionableAdvice.push(...knowledge.actionableAdvice);
  }

  // Save extracted knowledge
  console.log('\nSaving knowledge base...');

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'frameworks.json'),
    JSON.stringify(allKnowledge.frameworks, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'best-practices.json'),
    JSON.stringify(allKnowledge.bestPractices, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'mental-models.json'),
    JSON.stringify(allKnowledge.mentalModels, null, 2)
  );

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'actionable-advice.json'),
    JSON.stringify(allKnowledge.actionableAdvice, null, 2)
  );

  console.log('\nKnowledge extraction complete!');
  console.log(`Output directory: ${OUTPUT_PATH}`);
  console.log(`\nNext steps:`);
  console.log(`1. Review extracted knowledge in ${OUTPUT_PATH}`);
  console.log(`2. Refine with AI (use Claude API for better extraction)`);
  console.log(`3. Build MCP server using the knowledge base`);
}

main().catch(console.error);
