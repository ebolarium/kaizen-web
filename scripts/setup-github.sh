#!/bin/bash

# GitHub Setup Script for Kaizen Website
# This script helps set up the GitHub repository and initial configuration

echo "🚀 Kaizen Website - GitHub Setup Script"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "✅ Git repository already initialized"
fi

# Check if we have files to commit
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ No changes to commit"
else
    echo "📝 Adding files to Git..."
    git add .
    
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Kaizen Education NGO website"
fi

# Check if remote origin exists
if git remote get-url origin > /dev/null 2>&1; then
    echo "✅ Remote origin already configured"
    echo "📍 Current remote: $(git remote get-url origin)"
else
    echo ""
    echo "🔗 Please add your GitHub repository URL:"
    echo "   Example: https://github.com/yourusername/kaizen-website.git"
    echo ""
    read -p "Enter GitHub repository URL: " REPO_URL
    
    if [ -n "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo "✅ Remote origin added: $REPO_URL"
    else
        echo "❌ No repository URL provided. Please add it manually:"
        echo "   git remote add origin https://github.com/yourusername/kaizen-website.git"
    fi
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "🔄 Renaming branch to 'main'..."
    git branch -M main
fi

# Push to GitHub
echo ""
echo "🚀 Ready to push to GitHub!"
echo ""
read -p "Do you want to push to GitHub now? (y/n): " PUSH_NOW

if [ "$PUSH_NOW" = "y" ] || [ "$PUSH_NOW" = "Y" ]; then
    echo "📤 Pushing to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "📋 Next steps:"
        echo "1. Go to your GitHub repository settings"
        echo "2. Enable GitHub Pages (Settings → Pages)"
        echo "3. Add repository secrets (Settings → Secrets and variables → Actions)"
        echo "4. Follow the GITHUB_SETUP.md guide for detailed configuration"
        echo ""
        echo "🔗 Repository URL: $(git remote get-url origin)"
    else
        echo "❌ Failed to push to GitHub. Please check your repository URL and permissions."
    fi
else
    echo ""
    echo "📋 Manual push command:"
    echo "   git push -u origin main"
    echo ""
    echo "📖 Follow GITHUB_SETUP.md for detailed configuration steps"
fi

echo ""
echo "🎉 GitHub setup script completed!"
echo "📖 Read GITHUB_SETUP.md for detailed configuration instructions"
