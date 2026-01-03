#!/bin/bash
# =============================================================================
# SUPER SIMPLE DEPLOYMENT SCRIPT FOR salam-ev.de
# =============================================================================
# This script automates the entire deployment process on Hostinger VPS
# =============================================================================

set -e  # Exit on any error

DOMAIN="salam-ev.de"
WWW_DOMAIN="www.salam-ev.de"
EMAIL="info@salam-ev.de"
DEPLOY_DIR="/docker/slm"

echo "=========================================="
echo " SLM Application Deployment"
echo " Domain: $DOMAIN"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (use: sudo bash deploy.sh)"
    exit 1
fi

# Step 1: Install Docker if needed
echo "Step 1: Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    apt-get update
    apt-get install -y docker-compose-plugin
    echo "✓ Docker installed"
else
    echo "✓ Docker already installed"
fi

# Verify docker compose
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose plugin..."
    apt-get update
    apt-get install -y docker-compose-plugin
fi

echo ""

# Step 2: Setup deployment directory
echo "Step 2: Setting up deployment directory..."
mkdir -p $DEPLOY_DIR
cd $DEPLOY_DIR

# Check if this is first deployment or update
if [ -d ".git" ]; then
    echo "Updating existing deployment..."
    git pull
else
    echo "First time deployment..."
    # If directory is not empty and not a git repo, backup
    if [ "$(ls -A .)" ]; then
        echo "Backing up existing files..."
        mkdir -p ../slm-backup-$(date +%Y%m%d-%H%M%S)
        mv * ../slm-backup-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true
    fi
fi

echo "✓ Deployment directory ready"
echo ""

# Step 3: Create/Update .env file
echo "Step 3: Configuring environment..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        echo "Creating .env file..."
        cat > .env <<EOF
# MySQL Database Configuration
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
MYSQL_DATABASE=slmdb
MYSQL_USER=slm_user
MYSQL_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 64 | tr -d "=+/" | cut -c1-64)
JWT_EXPIRATION=86400000

# Application Configuration
APP_UPLOAD_URL_PREFIX=https://$DOMAIN

# CORS Configuration
CORS_ALLOWED_ORIGINS=https://$DOMAIN,http://$DOMAIN,https://$WWW_DOMAIN,http://$WWW_DOMAIN
EOF
    fi
    echo "✓ Environment file created with secure random passwords"
else
    echo "✓ Environment file already exists"
fi

echo ""

# Step 4: Create required directories
echo "Step 4: Creating required directories..."
mkdir -p nginx/conf.d certbot/conf certbot/www
echo "✓ Directories created"
echo ""

# Step 5: Stop conflicting services
echo "Step 5: Stopping conflicting services..."
systemctl stop nginx 2>/dev/null || echo "System nginx not running"
systemctl stop apache2 2>/dev/null || echo "Apache not running"
pkill -f "ng serve" 2>/dev/null || echo "No Angular dev server running"
echo "✓ Conflicting services stopped"
echo ""

# Step 6: Start application
echo "Step 6: Starting application containers..."
echo "This may take a few minutes on first run..."
echo ""

docker compose -f docker-compose-production.yml up -d

echo ""
echo "Waiting for services to start (60 seconds)..."
sleep 60

# Check status
echo ""
echo "Checking container status..."
docker compose ps

echo ""
echo "=========================================="
echo " ✓ Application Deployed!"
echo "=========================================="
echo ""
echo "Your application is now running on:"
echo "  HTTP:  http://$DOMAIN"
echo "  HTTP:  http://$WWW_DOMAIN"
echo ""
echo "Next steps:"
echo ""
echo "1. Test HTTP access:"
echo "   curl http://$DOMAIN"
echo ""
echo "2. Setup HTTPS (recommended):"
echo "   bash get-ssl-cert.sh"
echo "   bash finalize-https.sh"
echo ""
echo "3. Check logs:"
echo "   docker compose logs -f"
echo ""
echo "4. View specific service logs:"
echo "   docker compose logs -f backend"
echo "   docker compose logs -f frontend"
echo "   docker compose logs -f nginx"
echo ""
echo "=========================================="
echo ""

# Ask if user wants to setup SSL now
read -p "Do you want to setup SSL/HTTPS now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Setting up SSL certificate..."
    bash get-ssl-cert.sh
    bash finalize-https.sh
fi

echo ""
echo "Deployment complete!"
