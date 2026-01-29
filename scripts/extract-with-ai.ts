#!/usr/bin/env node

/**
 * AI-Powered Knowledge Extraction
 * 
 * Uses Claude API to extract structured knowledge from transcripts
 */

import * as fs from 'fs';
import * as path from 'path';
import yaml from 'js-yaml';

const TRANSCRIPTS_PATH = process.env.LENNY_TRANSCRIPTS_PATH || path.join(process.cwd(), 'episodes');
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(process.cwd(), 'knowledge');
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const EXTRACTION_PROMPTS = {
  frameworks: `Analyze this podcast transcript excerpt and extract any product management frameworks or models mentioned.

For each framework, provide:
- name: Clear, concise name
- description: What it is in 2-3 sentences
- application: When and how to use it
- steps: Array of step-by-step instructions (if mentioned)
- examples: Array of real examples (if given)

Return ONLY valid JSON array with no markdown formatting:
[{
  "name": "string",
  "description": "string",
  "application": "string",
  "steps": ["string"],
  "examples": ["string"]
}]

Transcript excerpt:
---
{excerpt}
---

Extract frameworks now:`,

  bestPractices: `Extract actionable best practices from this podcast transcript.

For each practice:
- practice: The specific advice/practice (1 sentence)
- context: Why it matters, when to apply (2-3 sentences)
- quote: Best supporting quote from the transcript (if available)

Return ONLY valid JSON array:
[{
  "practice": "string",
  "context": "string",
  "quote": "string"
}]

Transcript excerpt:
---
{excerpt}
---

Extract practices now:`,

  mentalModels: `Extract mental models for product thinking from this transcript.

For each mental model:
- name: Name of the mental model
- description: What it is
- whenToUse: When to apply this thinking
- example: Concrete example from the transcript

Return ONLY valid JSON array:
[{
  "name": "string",
  "description": "string",
  "whenToUse": "string",
  "example": "string"
}]

Transcript excerpt:
---
{excerpt}
---

Extract mental models now:`,
};

/**
 * Call Claude API to extract knowledge
 */
async function callClaudeAPI(prompt: string): Promise<any> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable not set');
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: prompt,
        }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.content[0].text;
    
    // Try to parse JSON from response
    try {
      // Remove markdown code blocks if present
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      console.error('Failed to parse JSON response:', text.substring(0, 200));
      return [];
    }
  } catch (error) {
    console.error('API call error:', error);
    return [];
  }
}

/**
 * Split transcript into manageable chunks
 */
function chunkTranscript(content: string, chunkSize: number = 8000): string[] {
  const chunks: string[] = [];
  const words = content.split(/\s+/);
  
  for (let i = 0; i < words.length; i += chunkSize) {
    chunks.push(words.slice(i, i + chunkSize).join(' '));
  }
  
  return chunks;
}

/**
 * Extract knowledge from one episode
 */
async function processEpisode(
  guestDir: string,
  metadata: any,
  content: string
): Promise<{
  frameworks: any[];
  bestPractices: any[];
  mentalModels: any[];
}> {
  
  console.log(`Processing: ${metadata.guest || guestDir}`);
  
  const result = {
    frameworks: [],
    bestPractices: [],
    mentalModels: [],
  };

  // Only process first 15000 words to save API costs
  const excerpt = content.split(/\s+/).slice(0, 15000).join(' ');

  // Extract frameworks
  console.log('  Extracting frameworks...');
  const frameworkPrompt = EXTRACTION_PROMPTS.frameworks.replace('{excerpt}', excerpt);
  const frameworks = await callClaudeAPI(frameworkPrompt);
  
  if (Array.isArray(frameworks) && frameworks.length > 0) {
    result.frameworks = frameworks.map(f => ({
      ...f,
      source: {
        guest: metadata.guest || guestDir,
        episode: metadata.title || guestDir,
        url: metadata.youtube_url,
      },
    }));
    console.log(`  ✓ Found ${frameworks.length} frameworks`);
  }

  // Small delay to avoid rate limits
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Extract best practices
  console.log('  Extracting best practices...');
  const practicesPrompt = EXTRACTION_PROMPTS.bestPractices.replace('{excerpt}', excerpt);
  const practices = await callClaudeAPI(practicesPrompt);
  
  if (Array.isArray(practices) && practices.length > 0) {
    result.bestPractices = practices.map(p => ({
      ...p,
      source: {
        guest: metadata.guest || guestDir,
        episode: metadata.title || guestDir,
      },
    }));
    console.log(`  ✓ Found ${practices.length} best practices`);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Extract mental models
  console.log('  Extracting mental models...');
  const modelsPrompt = EXTRACTION_PROMPTS.mentalModels.replace('{excerpt}', excerpt);
  const models = await callClaudeAPI(modelsPrompt);
  
  if (Array.isArray(models) && models.length > 0) {
    result.mentalModels = models.map(m => ({
      ...m,
      source: {
        guest: metadata.guest || guestDir,
        episode: metadata.title || guestDir,
      },
    }));
    console.log(`  ✓ Found ${models.length} mental models`);
  }

  return result;
}

/**
 * Main function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('Lenny Podcast - AI Knowledge Extraction');
  console.log('='.repeat(60));
  console.log();

  if (!ANTHROPIC_API_KEY) {
    console.error('Error: ANTHROPIC_API_KEY environment variable not set');
    console.error('Set it with: export ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  if (!fs.existsSync(TRANSCRIPTS_PATH)) {
    console.error(`Error: Transcripts path not found: ${TRANSCRIPTS_PATH}`);
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(OUTPUT_PATH)) {
    fs.mkdirSync(OUTPUT_PATH, { recursive: true });
  }

  // Get episodes
  const guestDirs = fs.readdirSync(TRANSCRIPTS_PATH, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  console.log(`Found ${guestDirs.length} episodes`);
  console.log();

  // Ask user how many to process (API costs)
  const maxEpisodes = process.env.MAX_EPISODES 
    ? parseInt(process.env.MAX_EPISODES) 
    : 5; // Default to 5 for testing

  console.log(`Processing first ${maxEpisodes} episodes (set MAX_EPISODES env var to change)`);
  console.log();

  const allKnowledge = {
    frameworks: [],
    bestPractices: [],
    mentalModels: [],
  };

  // Process episodes
  for (const guestDir of guestDirs.slice(0, maxEpisodes)) {
    const transcriptPath = path.join(TRANSCRIPTS_PATH, guestDir, 'transcript.md');
    
    if (!fs.existsSync(transcriptPath)) continue;

    try {
      const content = fs.readFileSync(transcriptPath, 'utf-8');
      const parts = content.split('---');
      
      if (parts.length < 3) continue;
      
      const metadata = yaml.load(parts[1].trim());
      const transcript = parts.slice(2).join('---').trim();

      const knowledge = await processEpisode(guestDir, metadata, transcript);

      allKnowledge.frameworks.push(...knowledge.frameworks);
      allKnowledge.bestPractices.push(...knowledge.bestPractices);
      allKnowledge.mentalModels.push(...knowledge.mentalModels);

      console.log();
    } catch (error) {
      console.error(`Error processing ${guestDir}:`, error.message);
    }
  }

  // Save results
  console.log('='.repeat(60));
  console.log('Saving knowledge base...');
  console.log();

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'frameworks.json'),
    JSON.stringify(allKnowledge.frameworks, null, 2)
  );
  console.log(`✓ Saved ${allKnowledge.frameworks.length} frameworks`);

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'best-practices.json'),
    JSON.stringify(allKnowledge.bestPractices, null, 2)
  );
  console.log(`✓ Saved ${allKnowledge.bestPractices.length} best practices`);

  fs.writeFileSync(
    path.join(OUTPUT_PATH, 'mental-models.json'),
    JSON.stringify(allKnowledge.mentalModels, null, 2)
  );
  console.log(`✓ Saved ${allKnowledge.mentalModels.length} mental models`);

  console.log();
  console.log('Knowledge extraction complete!');
  console.log(`Output: ${OUTPUT_PATH}`);
  console.log();
  console.log('Next steps:');
  console.log('1. Review extracted knowledge in knowledge/ directory');
  console.log('2. Edit and refine as needed');
  console.log('3. Build MCP server: npm run build');
  console.log('4. Add to Claude Desktop config');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
