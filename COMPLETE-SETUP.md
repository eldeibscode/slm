# COMPLETE SETUP GUIDE - SLM Application

## What I've Fixed

### 1. Frontend Configuration ✅
- Updated Dockerfile to build with `--configuration production`
- Production environment already configured with `apiUrl: '/api'`
- Frontend will now call backend through nginx reverse proxy

### 2. Docker Compose Optimized ✅
- docker-compose-production.yml includes all services (mysql, backend, frontend, nginx)
- Correct network configuration
- Health checks for all services
- SSL/TLS support ready

### 3. Nginx Configuration ✅
- HTTP configuration for initial setup (biedle.conf)
- HTTPS configuration template (biedle-https.conf.template)
- Proper proxy settings for frontend and backend

### 4. Git Ready ✅
- .gitignore created (excludes node_modules, build files, .env)
- .env.example template for deployment
- Deployment documentation

## Step-by-Step: Local to Production

### STEP 1: Push Code to Git (On Your Windows Machine)

```bash
cd E:/dev/slm

# Run the git setup script
bash git-setup.sh

# Create repository on GitHub/GitLab and get the URL

# Add remote
git remote add origin YOUR_REPO_URL

# Push to remote
git branch -M main
git push -u origin main
```

### STEP 2: Deploy on Hostinger VPS

```bash
# SSH into VPS
ssh root@72.62.146.133

# Install Docker (if not already done)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install docker-compose-plugin -y

# Create deployment directory
mkdir -p /docker/slm
cd /docker/slm

# Clone your repository
git clone YOUR_REPO_URL .

# Create environment file
cp .env.example .env
nano .env
```

### STEP 3: Configure Environment

Edit `/docker/slm/.env`:
```env
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=slmdb
MYSQL_USER=slm_user
MYSQL_PASSWORD=slm_password
JWT_SECRET=your_generated_secret_here
JWT_EXPIRATION=86400000
APP_UPLOAD_URL_PREFIX=https://biedle.de
CORS_ALLOWED_ORIGINS=https://biedle.de,http://biedle.de,https://www.biedle.de,http://www.biedle.de
```

### STEP 4: Start Application

```bash
cd /docker/slm

# Create directories
mkdir -p nginx/conf.d certbot/conf certbot/www

# Stop old frontend if running
pkill -f "ng serve" || true

# Stop system nginx if running
systemctl stop nginx || true

# Start containers
docker compose -f docker-compose-production.yml up -d

# Wait 30 seconds
sleep 30

# Check status
docker compose ps

# All containers should be healthy!
```

### STEP 5: Setup SSL Certificate

```bash
cd /docker/slm

# Make scripts executable
chmod +x get-ssl-cert.sh finalize-https.sh

# Get SSL certificate
./get-ssl-cert.sh

# After certificate is obtained, finalize HTTPS
./finalize-https.sh
```

### STEP 6: Verify

- Frontend: https://biedle.de
- Backend API: https://biedle.de/api/reports
- Check logs: `docker compose logs -f`

## Current Status on VPS

### What's Currently Running:
- Frontend: Port 4200 (dev mode) - WILL BE REPLACED
- Backend: Docker container (broken due to MySQL password)
- MySQL: Docker container
- System Nginx: Port 80 (will be stopped)

### What Will Happen:
1. Stop old frontend (port 4200)
2. Stop system nginx (port 80)
3. Start new Docker Compose stack:
   - MySQL (with correct password)
   - Backend (Spring Boot)
   - Frontend (Angular production build)
   - Nginx (reverse proxy on port 80/443)

## Troubleshooting

### If backend won't start:
```bash
# Check logs
docker compose logs backend

# MySQL password issue - reset database
docker compose down
docker volume rm slm_mysql-data
docker compose up -d
```

### If frontend shows API errors:
```bash
# Ensure production build
docker compose build --no-cache frontend
docker compose up -d frontend
```

### If port 80 is in use:
```bash
# Stop conflicting services
sudo systemctl stop nginx
sudo systemctl stop apache2
sudo pkill -f "ng serve"

# Restart
docker compose up -d
```

## Next Actions for You

1. **Push to Git:**
   ```bash
   cd E:/dev/slm
   bash git-setup.sh
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy on VPS:**
   - SSH into VPS
   - Clone repository
   - Configure .env
   - Run docker compose

3. **Setup HTTPS:**
   - Run get-ssl-cert.sh
   - Run finalize-https.sh

That's it! Your application will be fully deployed with HTTPS!
