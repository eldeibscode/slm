# SLM Application - Production Deployment Guide

## Quick Setup on Hostinger VPS

### 1. Server Preparation
```bash
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install docker-compose-plugin -y
```

### 2. Clone and Deploy
```bash
mkdir -p /docker/slm
cd /docker/slm
git clone YOUR_GIT_REPO_URL .

# Create .env from template
cp .env.example .env
nano .env
# Update: passwords, JWT secret, domain name

# Start containers
docker compose -f docker-compose-production.yml up -d
docker compose ps
```

### 3. Setup SSL (After DNS points to server)
```bash
cd /docker/slm
./get-ssl-cert.sh
# Follow prompts

# After SSL certificate is obtained
./finalize-https.sh
```

### 4. Verify
- Frontend: https://your-domain.com
- Backend: https://your-domain.com/api
- Check logs: `docker compose logs -f`

## Troubleshooting

### Backend keeps restarting
```bash
# Check MySQL password
docker exec slm-mysql printenv MYSQL_PASSWORD
# Should match .env file

# Reset if needed
docker compose down
docker volume rm slm_mysql-data
docker compose up -d
```

### Frontend shows API errors  
```bash
# Frontend must use production build
docker compose build frontend
docker compose up -d frontend
```

### Port 80 already in use
```bash
sudo systemctl stop nginx
sudo systemctl stop apache2
docker compose up -d
```
