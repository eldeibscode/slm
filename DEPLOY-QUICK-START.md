# SLM Application - Ultra-Simple Deployment Guide for salam-ev.de

## Prerequisites

- ✅ Domain `salam-ev.de` DNS A record pointing to your VPS IP
- ✅ Fresh Hostinger VPS with Ubuntu
- ✅ SSH access to your VPS

---

## 🚀 ONE-COMMAND DEPLOYMENT

SSH into your VPS and run:

```bash
ssh root@YOUR_VPS_IP

# Download and run the deployment script
curl -fsSL https://raw.githubusercontent.com/YOUR_REPO/main/deploy.sh -o deploy.sh
bash deploy.sh
```

**That's it!** The script will:
1. ✅ Install Docker
2. ✅ Setup deployment directory
3. ✅ Generate secure passwords
4. ✅ Start all services
5. ✅ Optionally setup SSL/HTTPS

---

## 🔧 MANUAL DEPLOYMENT (If You Prefer)

### Step 1: SSH into VPS

```bash
ssh root@YOUR_VPS_IP
```

### Step 2: Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt-get install -y docker-compose-plugin
```

### Step 3: Clone Repository

```bash
mkdir -p /docker/slm
cd /docker/slm
git clone YOUR_GITHUB_REPO_URL .
```

### Step 4: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Generate secure passwords
openssl rand -base64 32

# Edit .env and update passwords
nano .env
```

Update these values in `.env`:
- `MYSQL_ROOT_PASSWORD` - Strong password for MySQL root
- `MYSQL_PASSWORD` - Strong password for MySQL user
- `JWT_SECRET` - Generate with: `openssl rand -base64 64`

### Step 5: Deploy Application

```bash
# Stop conflicting services
systemctl stop nginx 2>/dev/null
systemctl stop apache2 2>/dev/null

# Create directories
mkdir -p nginx/conf.d certbot/conf certbot/www

# Start all services
docker compose -f docker-compose-production.yml up -d

# Wait and check status
sleep 60
docker compose ps
```

### Step 6: Setup HTTPS

```bash
# Get SSL certificate
chmod +x get-ssl-cert.sh finalize-https.sh
./get-ssl-cert.sh

# Finalize HTTPS setup
./finalize-https.sh
```

---

## 🌐 Access Your Application

- **Frontend**: https://salam-ev.de
- **Backend API**: https://salam-ev.de/api
- **Health Check**: https://salam-ev.de/api/actuator/health

---

## 📊 Useful Commands

### Check Status
```bash
cd /docker/slm
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
```

### Restart Services
```bash
# Restart all
docker compose restart

# Restart specific service
docker compose restart backend
docker compose restart frontend
```

### Update Application
```bash
cd /docker/slm
git pull
docker compose down
docker compose up -d --build
```

### Backup Database
```bash
docker exec slm-mysql mysqldump -uroot -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) slmdb > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
docker exec -i slm-mysql mysql -uroot -p$(grep MYSQL_ROOT_PASSWORD .env | cut -d '=' -f2) slmdb < backup_20260103.sql
```

---

## ❌ Troubleshooting

### Port 80 Already in Use
```bash
sudo lsof -i :80
sudo systemctl stop nginx
sudo systemctl stop apache2
docker compose restart nginx
```

### Backend Won't Start
```bash
# Check logs
docker compose logs backend

# Reset database
docker compose down
docker volume rm slm_mysql-data
docker compose up -d
```

### SSL Certificate Issues
```bash
# Check DNS
nslookup salam-ev.de 8.8.8.8

# Retry certificate
./get-ssl-cert.sh
```

### Frontend Shows API Errors
```bash
# Rebuild frontend
docker compose build --no-cache frontend
docker compose up -d frontend
```

---

## 🔐 Security Checklist

- ✅ Use strong passwords in `.env`
- ✅ Never commit `.env` to git
- ✅ Enable HTTPS (SSL certificate)
- ✅ Configure firewall (UFW):
  ```bash
  ufw allow 22    # SSH
  ufw allow 80    # HTTP
  ufw allow 443   # HTTPS
  ufw enable
  ```
- ✅ Regular backups
- ✅ Keep Docker images updated:
  ```bash
  docker compose pull
  docker compose up -d
  ```

---

## 📞 Support

If you encounter any issues:

1. Check logs: `docker compose logs -f`
2. Verify DNS: `nslookup salam-ev.de`
3. Check container status: `docker compose ps`
4. Review `.env` configuration

---

## 🎉 Success!

Your SLM application is now deployed and running on **salam-ev.de**!

Enjoy your fully functional application with Angular frontend, Spring Boot backend, and MySQL database!
