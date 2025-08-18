#!/bin/bash

# GitHub Setup Script for Tunebook
# This script helps set up the GitHub repository

echo "🎵 Tunebook GitHub Setup"
echo "======================="

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed."
    echo "Please install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is logged in to GitHub CLI
if ! gh auth status &> /dev/null; then
    echo "🔐 Please log in to GitHub CLI first:"
    echo "gh auth login"
    exit 1
fi

echo "📝 Repository Information:"
echo "Name: tunebook"
echo "Description: A monorepo for exploring Irish traditional music resources"
echo ""

read -p "Do you want to create a new GitHub repository? (y/N): " create_repo

if [[ $create_repo =~ ^[Yy]$ ]]; then
    echo "🚀 Creating GitHub repository..."
    
    # Create the repository
    gh repo create tunebook \
        --description "A monorepo for exploring Irish traditional music resources" \
        --public \
        --clone=false \
        --add-readme=false
    
    if [ $? -eq 0 ]; then
        echo "✅ Repository created successfully!"
        
        # Add remote origin
        gh repo set-default
        git remote add origin "https://github.com/$(gh api user --jq .login)/tunebook.git"
        
        echo "🔗 Remote origin added"
        
        # Push the initial commit
        read -p "Push initial commit to GitHub? (y/N): " push_commit
        if [[ $push_commit =~ ^[Yy]$ ]]; then
            git push -u origin main
            echo "✅ Initial commit pushed to GitHub!"
            echo ""
            echo "🎉 Your Tunebook repository is now set up on GitHub!"
            echo "🌐 Repository URL: https://github.com/$(gh api user --jq .login)/tunebook"
        fi
    else
        echo "❌ Failed to create repository"
        exit 1
    fi
else
    echo "ℹ️  Skipping repository creation"
    echo ""
    echo "To manually set up GitHub:"
    echo "1. Create a new repository on GitHub named 'tunebook'"
    echo "2. Add the remote: git remote add origin <your-repo-url>"
    echo "3. Push: git push -u origin main"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Copy .env.example to .env and configure your environment"
echo "2. Run 'pnpm install' to install dependencies"
echo "3. Run 'pnpm setup' to start the development environment"
echo "4. Start implementing tasks from .kiro/specs/tunebook-monorepo/tasks.md"
echo ""
echo "🎵 Happy coding with Tunebook!"