# Contributing to Lenny's Podcast Knowledge MCP

Thank you for your interest in contributing! This project aims to make product management wisdom from Lenny's Podcast easily accessible and actionable.

## 🎯 What We're Looking For

### High-Value Contributions

1. **Frameworks** - Product management frameworks with clear steps and examples
2. **Best Practices** - Actionable advice from podcast guests with context
3. **Mental Models** - Thinking patterns and problem-solving approaches
4. **Methodologies** - Complete workflows and processes
5. **Expert Advice** - Situation-specific guidance

### Quality Standards

Each knowledge entry should include:

✅ **Clear, concise description** (2-3 sentences)  
✅ **Source attribution** (guest name, episode title)  
✅ **Practical application** (when and how to use it)  
✅ **Examples** (real examples from the podcast or your experience)  
✅ **Steps/process** (for frameworks)

## 📝 How to Contribute

### 1. Choose What to Add

Pick one:
- A framework you learned from the podcast
- A best practice that helped you
- A mental model you use regularly
- Expert advice for common PM situations

### 2. Find the Right File

```
knowledge/
├── frameworks.json          # For frameworks and models
├── best-practices.json      # For actionable advice
├── mental-models.json       # For thinking patterns
└── methodologies.json       # For complete processes
```

### 3. Follow the Schema

#### For Frameworks

```json
{
  "name": "Framework Name",
  "description": "What it is and what problem it solves (2-3 sentences)",
  "application": "When and how to use it (1-2 sentences)",
  "steps": [
    "Step 1: Clear, actionable instruction",
    "Step 2: Next action to take",
    "Step 3: How to complete it"
  ],
  "examples": [
    "Real example: Feature X - Reach=5000, Impact=2, Confidence=80%, Effort=2 → Score=4000"
  ],
  "source": {
    "guest": "Guest Name",
    "episode": "Episode Title",
    "url": "https://youtube.com/watch?v=... (optional)"
  }
}
```

#### For Best Practices

```json
{
  "topic": "Category (e.g., user-research, growth, hiring)",
  "practice": "The specific advice or practice (1 sentence)",
  "context": "Why it matters and when to apply it (2-3 sentences)",
  "source": {
    "guest": "Guest Name",
    "episode": "Episode Title"
  },
  "quotes": [
    "Direct quote from the podcast (optional but valuable)"
  ]
}
```

#### For Mental Models

```json
{
  "name": "Mental Model Name",
  "description": "What it is and how it helps you think",
  "whenToUse": "Situations where this model is useful",
  "example": "Concrete example of applying this model",
  "source": {
    "guest": "Guest Name",
    "episode": "Episode Title"
  }
}
```

### 4. Validate Your JSON

Before submitting, check that your JSON is valid:

```bash
# Install jq if you don't have it
# macOS: brew install jq
# Ubuntu: sudo apt-get install jq

# Validate the JSON
cat knowledge/frameworks.json | jq .

# Should output formatted JSON with no errors
```

### 5. Test Locally

```bash
# Build the project
npm run build

# Start the MCP server
npm start

# In another terminal, test with Claude Desktop
```

### 6. Submit a Pull Request

1. Fork the repository
2. Create a new branch: `git checkout -b add-framework-name`
3. Make your changes
4. Commit: `git commit -m "Add [Framework Name] framework"`
5. Push: `git push origin add-framework-name`
6. Open a Pull Request on GitHub

## 📋 PR Checklist

Before submitting your PR, ensure:

- [ ] JSON is valid (no syntax errors)
- [ ] Follows the schema format exactly
- [ ] Includes source attribution
- [ ] Has clear description and examples
- [ ] Tested locally (if possible)
- [ ] PR description explains what you're adding

## 🎨 Style Guide

### Writing Style

- **Be concise**: 2-3 sentences for descriptions
- **Be practical**: Focus on "how to apply" not "what it is"
- **Be specific**: "Estimate Reach as users per quarter" not "Think about reach"
- **Use examples**: Real numbers, scenarios, outcomes

### Good vs. Bad Examples

#### ❌ Bad

```json
{
  "name": "RICE",
  "description": "It's a prioritization framework",
  "steps": ["Do RICE"]
}
```

#### ✅ Good

```json
{
  "name": "RICE Prioritization",
  "description": "A scoring model that helps product teams prioritize features objectively by calculating: (Reach × Impact × Confidence) / Effort",
  "application": "Use RICE when you have many features to choose from and need an objective way to compare them",
  "steps": [
    "Estimate Reach: How many users will this impact per quarter?",
    "Estimate Impact: How much will it improve their experience? (0.25 to 3)",
    "Estimate Confidence: How sure are you? (50% to 100%)",
    "Estimate Effort: How many person-months will it take?",
    "Calculate RICE Score: (Reach × Impact × Confidence) / Effort"
  ],
  "examples": [
    "New onboarding: Reach=5000, Impact=2, Confidence=80%, Effort=2 → Score=4000"
  ]
}
```

## 🔍 Topics We Need

High-priority topics that need more content:

- [ ] OKRs and goal-setting frameworks
- [ ] A/B testing best practices
- [ ] User feedback collection methods
- [ ] Roadmap creation and communication
- [ ] Stakeholder management
- [ ] Product analytics and metrics
- [ ] Technical product management
- [ ] Platform product strategies
- [ ] AI/ML product management

## 🚫 What Not to Include

Please avoid:

- ❌ Generic advice without source ("Always talk to users")
- ❌ Incomplete frameworks (missing steps or examples)
- ❌ Personal opinions without attribution
- ❌ Duplicate content already in the knowledge base
- ❌ Advice contradicting established PM practices without context

## 🤔 Questions?

- Not sure if your contribution fits? Open an issue first!
- Need help with JSON format? See examples in existing files
- Want to discuss major changes? Create a discussion thread

## 🌟 Recognition

All contributors will be:
- Listed in the project's contributors page
- Credited in release notes
- Part of building a valuable resource for the PM community

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Every contribution, no matter how small, helps make product management knowledge more accessible to everyone. Thank you for being part of this!

---

**Questions?** Open an issue or start a discussion. We're here to help!
