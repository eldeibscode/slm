#!/bin/bash
# Git Setup and Push Script

echo "================================"
echo " Git Setup for SLM Application"
echo "================================"
echo ""

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "Initializing Git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git already initialized"
fi

# Add all files
echo ""
echo "Adding files to Git..."
git add .

# Show status
echo ""
echo "Git Status:"
git status

# Create initial commit
echo ""
echo "Creating commit..."
git commit -m "Initial commit: SLM Application with Docker setup

- Angular 21 frontend with production build configuration
- Spring Boot 3.2 backend with MySQL
- Docker Compose production setup
- Nginx reverse proxy with SSL support
- Environment configuration templates
- Deployment documentation"

echo ""
echo "✓ Commit created"

echo ""
echo "================================"
echo " Next Steps:"
echo "================================"
echo ""
echo "1. Create a new repository on GitHub/GitLab/Bitbucket"
echo ""
echo "2. Add remote origin:"
echo "   git remote add origin YOUR_GIT_REPO_URL"
echo ""
echo "3. Push to remote:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. On VPS, clone and deploy:"
echo "   cd /docker/slm"
echo "   git clone YOUR_GIT_REPO_URL ."
echo "   cp .env.example .env"
echo "   nano .env  # Update with production values"
echo "   docker compose -f docker-compose-production.yml up -d"
echo ""
