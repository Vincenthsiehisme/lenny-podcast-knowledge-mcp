# Lenny's Podcast Knowledge MCP

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io)

A Model Context Protocol (MCP) server that provides **structured product management knowledge** extracted from [Lenny's Podcast](https://www.lennysnewsletter.com/podcast). Get instant access to frameworks, best practices, and expert advice from 300+ episodes - not as raw transcripts, but as **actionable, structured knowledge**.

## 🎯 What Makes This Different?

**This is NOT a search tool.** Instead of searching through transcripts, you get:

| Traditional Search | Knowledge MCP (This Project) |
|-------------------|------------------------------|
| "Here are 5 excerpts mentioning RICE..." | **Complete framework:** Steps, formula, examples |
| "Brian mentioned product-market fit at 23:45..." | **Structured advice:** When to measure, how to act |
| Raw conversation content | Distilled, actionable knowledge |

## ✨ What's Inside

- 🎯 **5 Core Frameworks** - RICE, JTBD, North Star Metric, 40% Rule, Kano Model
- 💡 **15+ Best Practices** - User research, PMF, hiring, growth, leadership
- 🧠 **Expert Methodologies** - Continuous Discovery, Dual-Track Agile
- 💬 **Situation-Specific Advice** - Pricing, hiring, feature decisions

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- Claude Desktop (or any MCP-compatible client)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/lenny-podcast-knowledge-mcp.git
cd lenny-podcast-knowledge-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

### Configure Claude Desktop

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lenny-knowledge": {
      "command": "node",
      "args": ["/absolute/path/to/lenny-podcast-knowledge-mcp/dist/index.js"]
    }
  }
}
```

**Restart Claude Desktop** and you're ready to go!

## 💡 Usage Examples

### Learning a Framework

**You:** "I need to prioritize features in my backlog"

**Claude:** *[uses `get_framework("prioritization")`]*

```
# RICE Prioritization Framework

A scoring model to objectively compare features:
RICE = (Reach × Impact × Confidence) / Effort

Steps:
1. Estimate Reach: How many users per quarter? (e.g., 5000)
2. Estimate Impact: 0.25 (minimal) to 3 (massive)
3. Estimate Confidence: 50% to 100%
4. Estimate Effort: Person-months required
5. Calculate RICE score

Example:
- New onboarding flow
- Reach: 5000 users/quarter
- Impact: 2 (high)  
- Confidence: 80%
- Effort: 2 months
- RICE Score = (5000 × 2 × 0.8) / 2 = 4000

Would you like me to help you score your features?
```

### Getting Best Practices

**You:** "How should I approach user research?"

**Claude:** *[uses `get_best_practices("user-research")`]*

```
Best Practices for User Research:

1. Talk to customers every single week (Teresa Torres)
   - Make it a habit, not a project
   - Weekly cadence keeps you connected to user needs
   "The best product teams are talking to customers every single week"

2. Ask about past behavior, not future intent (Bob Moesta)
   - Don't ask "Would you use this?"
   - Ask "Tell me about the last time you..."
   - Past behavior predicts future better than hypotheticals

3. Focus on the job, not the feature (JTBD)
   - Understand what job users are hiring your product for
   - Design for the complete job, not just features
```

### Solving Specific Problems

**You:** "Our retention is dropping, what should we do?"

**Claude:** *[uses `get_expert_advice("retention problems")`]*

```
Expert Advice on Retention:

From Brian Balfour:
"Fix retention before growth. Growth on a leaky bucket 
is just expensive."

Action steps:
1. Measure weekly cohort retention
2. Find your "aha moment" - when do users get value?
3. Interview churned users
4. Get users to the aha moment faster

From Rahul Vohra (40% Rule):
- Survey users: "How disappointed if you couldn't use this?"
- If <40% say "very disappointed", you don't have PMF yet
- Segment: Who ARE the disappointed users? Build for them.
```

## 🛠️ Available Tools

### `get_framework`
Get complete framework with steps and examples

**Parameters:**
- `name` (string): Framework name or keyword

**Examples:**
```
"RICE prioritization"
"jobs to be done"
"north star metric"
"product-market fit"
```

### `get_best_practices`
Get proven best practices for a topic

**Parameters:**
- `topic` (string): Topic area

**Available topics:**
- `user-research` - Interview techniques, discovery habits
- `product-market-fit` - Measuring and achieving PMF
- `prioritization` - Feature prioritization strategies
- `growth` - Growth strategies and metrics
- `hiring` - PM hiring best practices
- `leadership` - Team management and leadership
- `metrics` - Choosing and tracking metrics
- `pricing` - Pricing strategy and models
- `onboarding` - User onboarding optimization

### `get_methodology`
Get complete methodologies used by experts

**Parameters:**
- `query` (string, optional): Methodology name

**Examples:**
```
"continuous discovery"
"dual-track agile"
```

### `get_expert_advice`
Get situation-specific advice from multiple experts

**Parameters:**
- `situation` (string): Describe your situation

**Examples:**
```
"We need to decide on pricing"
"How to hire first PM"
"Should we build this feature?"
"Our growth has stalled"
```

### `list_topics`
List all available knowledge topics

## 📚 Knowledge Base Structure

```
knowledge/
├── frameworks.json          # 5 core PM frameworks
├── best-practices.json      # 15+ actionable practices
├── mental-models.json       # Thinking patterns (coming soon)
└── methodologies.json       # Complete workflows (coming soon)
```

Each entry includes:
- ✅ Clear description and context
- ✅ Source attribution (guest, episode)
- ✅ Practical application guidance
- ✅ Step-by-step instructions (for frameworks)
- ✅ Real examples

## 🔧 Expanding the Knowledge Base

### Option 1: Manual Curation (Recommended)

Edit JSON files directly:

```bash
code knowledge/frameworks.json
```

Follow the schema in [CONTRIBUTING.md](CONTRIBUTING.md)

### Option 2: AI-Powered Extraction (Optional)

If you have access to the [transcript repository](https://github.com/ChatPRD/lennys-podcast-transcripts):

```bash
# Set up environment
export ANTHROPIC_API_KEY=your_api_key
export LENNY_TRANSCRIPTS_PATH=/path/to/episodes
export MAX_EPISODES=10  # Start small for testing

# Extract knowledge using AI
npm run extract

# Review and refine the output
code knowledge/
```

**Note:** AI extraction requires the Claude API and manual review for quality.

## 🤝 Contributing

We welcome contributions! Help us grow this knowledge base.

**How to contribute:**
1. Fork the repository
2. Add your knowledge to appropriate JSON file
3. Follow the schema format
4. Submit a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

**High-value contributions:**
- ✨ New frameworks with clear steps
- 💡 Best practices with real examples
- 🧠 Mental models and thinking patterns
- 📝 Expert advice for common situations

## 📖 Related Projects

- [Lenny's Podcast Transcripts](https://github.com/ChatPRD/lennys-podcast-transcripts) - Source transcripts
- [Lenny MCP by Akshay](https://github.com/akshayvkt/lenny-mcp) - Search-based MCP
- [Lenny Skills Database](https://refoundai.com/lenny-skills/) - Searchable skills DB
- [Learn from Lenny](https://x.com/learnfromlenny) - AI agent on X

## 🏗️ Technical Details

**Built with:**
- TypeScript
- Model Context Protocol SDK
- Node.js 18+

**Project structure:**
```
├── src/
│   └── index.ts              # MCP server implementation
├── knowledge/                # JSON knowledge base
├── scripts/
│   └── extract-with-ai.ts   # Optional AI extraction tool
└── package.json
```

## 📊 Roadmap

- [x] Core frameworks (RICE, JTBD, North Star, Kano, 40% Rule)
- [x] Best practices across key topics
- [ ] Mental models and thinking patterns
- [ ] More methodologies (OKRs, Shape Up, etc.)
- [ ] Semantic search over knowledge base
- [ ] Knowledge graph visualization
- [ ] Web interface for browsing

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

**Important:** The podcast content is the intellectual property of Lenny Rachitsky. This knowledge base is created for educational purposes and should be used accordingly.

## 🙏 Acknowledgments

- **Lenny Rachitsky** and all podcast guests for sharing their wisdom
- **ChatPRD** for maintaining the transcript archive
- **Anthropic** for the Model Context Protocol
- All contributors to this knowledge base

## 💬 Support & Community

- 🐛 [Report a bug](https://github.com/YOUR_USERNAME/lenny-podcast-knowledge-mcp/issues)
- 💡 [Request a feature](https://github.com/YOUR_USERNAME/lenny-podcast-knowledge-mcp/issues)
- 🤝 [Contribute knowledge](CONTRIBUTING.md)
- 💬 [Discussions](https://github.com/YOUR_USERNAME/lenny-podcast-knowledge-mcp/discussions)

---

**Made with ❤️ for the Product Management community**

If this helps you, please ⭐ star the repo and share it with other PMs!
