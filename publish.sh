#!/bin/bash

# Lenny's Podcast Knowledge MCP - Quick Publish Script
# This script helps you publish to GitHub quickly

echo "🚀 Lenny's Podcast Knowledge MCP - GitHub Publisher"
echo "=================================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Are you in the project directory?"
    exit 1
fi

echo "✅ Git found"
echo "✅ Project files found"
echo ""

# Get GitHub username
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

echo ""
echo "📝 Setting up repository for: $github_username"
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Set git config if not set
if [ -z "$(git config user.name)" ]; then
    read -p "Enter your name for git commits: " git_name
    git config user.name "$git_name"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "Enter your email for git commits: " git_email
    git config user.email "$git_email"
fi

echo "✅ Git config set"
echo ""

# Update README with correct username
echo "Updating README with your GitHub username..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/YOUR_USERNAME/$github_username/g" README.md
    sed -i '' "s/YOUR_USERNAME/$github_username/g" CONTRIBUTING.md
else
    # Linux
    sed -i "s/YOUR_USERNAME/$github_username/g" README.md
    sed -i "s/YOUR_USERNAME/$github_username/g" CONTRIBUTING.md
fi
echo "✅ Username updated in documentation"
echo ""

# Add all files
echo "Adding files to git..."
git add .
echo "✅ Files staged"
echo ""

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Knowledge-based MCP server for Lenny's Podcast

- 5 core PM frameworks (RICE, JTBD, North Star, 40% Rule, Kano)
- 15+ best practices across key topics
- Expert advice for common situations
- Complete with examples and step-by-step guides"
echo "✅ Initial commit created"
echo ""

# Set main branch
git branch -M main
echo "✅ Main branch set"
echo ""

# Add remote
repo_url="https://github.com/$github_username/lenny-podcast-knowledge-mcp.git"
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
echo "✅ Remote added: $repo_url"
echo ""

echo "=================================================="
echo "✅ Repository ready to push!"
echo "=================================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Create the repository on GitHub:"
echo "   → Go to: https://github.com/new"
echo "   → Repository name: lenny-podcast-knowledge-mcp"
echo "   → Make it Public"
echo "   → Choose MIT License"
echo "   → Click 'Create repository'"
echo ""
echo "2. Push your code:"
echo "   → Run: git push -u origin main"
echo ""
echo "3. Set up the repository:"
echo "   → Add topics: mcp, product-management, lenny-podcast"
echo "   → Create a release (v1.0.0)"
echo ""
echo "4. Share your project!"
echo "   → Tweet about it and tag @lennysan"
echo "   → Post on r/ProductManagement"
echo "   → Share on LinkedIn"
echo ""
echo "Need help? Check GITHUB_PUBLISH_GUIDE.md for detailed steps."
echo ""
