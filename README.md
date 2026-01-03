# SLM Application - Full Stack Report Management System

**Production-ready deployment for salam-ev.de**

## 📋 Architecture

- **Frontend**: Angular 21 + TailwindCSS + AG Grid
- **Backend**: Spring Boot 3.2 + MySQL 8
- **Reverse Proxy**: Nginx with SSL/TLS
- **Deployment**: Docker Compose
- **Domain**: salam-ev.de

---

## 🚀 Quick Deployment

### Option 1: One-Command Deployment (Recommended)

SSH into your Hostinger VPS and run:

```bash
ssh root@YOUR_VPS_IP

# Clone repository
mkdir -p /docker/slm && cd /docker/slm
git clone YOUR_REPO_URL .

# Run deployment script
chmod +x deploy.sh
bash deploy.sh
```

The script will:
- ✅ Install Docker automatically
- ✅ Generate secure passwords
- ✅ Setup all services
- ✅ Configure nginx
- ✅ Optionally setup SSL/HTTPS

---

### Option 2: Manual Deployment

See [DEPLOY-QUICK-START.md](DEPLOY-QUICK-START.md) for detailed step-by-step instructions.

---

## 📚 Documentation

- **[DEPLOY-QUICK-START.md](DEPLOY-QUICK-START.md)** - Complete deployment guide
- **[QUICK-REFERENCE.md](QUICK-REFERENCE.md)** - Command reference card
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Original detailed deployment guide
- **[COMPLETE-SETUP.md](COMPLETE-SETUP.md)** - Setup and configuration details

---

## 🌐 Access Your Application

After deployment, access your application at:

- **Frontend**: https://salam-ev.de
- **Backend API**: https://salam-ev.de/api
- **Health Check**: https://salam-ev.de/api/actuator/health

---

## 🛠️ Local Development

### Prerequisites
- Node.js 20+
- Java 17+
- Docker & Docker Compose
- Git

### Setup

```bash
# Clone repository
git clone YOUR_REPO_URL
cd slm

# Setup environment
cp .env.example .env

# Start services
docker compose up -d

# Access locally
# Frontend: http://localhost:4200
# Backend: http://localhost:3000/api
# MySQL: localhost:3306
```

---

## 📦 Project Structure

```
slm/
├── slm-frontend/          # Angular 21 frontend
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── slm-backend/           # Spring Boot backend
│   ├── src/
│   ├── Dockerfile
│   └── build.gradle
│
├── nginx/                 # Nginx reverse proxy config
│   └── conf.d/
│       ├── salam-ev.conf                    # HTTP config
│       └── salam-ev-https.conf.template     # HTTPS config
│
├── docker-compose-production.yml   # Production setup
├── .env.example                    # Environment template
├── deploy.sh                       # One-command deployment
├── get-ssl-cert.sh                 # SSL certificate setup
├── finalize-https.sh               # HTTPS finalization
└── README.md
```

---

## 🔐 Security

### Environment Variables

**NEVER commit `.env` to git!** It contains sensitive data:

```bash
# Generate secure passwords
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64
```

### Firewall Setup

```bash
# Allow necessary ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### SSL/HTTPS

```bash
# Get free SSL certificate from Let's Encrypt
./get-ssl-cert.sh

# Finalize HTTPS setup
./finalize-https.sh
```

---

## 📊 Common Commands

### Service Management

```bash
# View all containers
docker compose ps

# View logs
docker compose logs -f

# Restart services
docker compose restart

# Update application
git pull
docker compose down
docker compose up -d --build
```

### Database Backup

```bash
# Backup
docker exec slm-mysql mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} slmdb > backup.sql

# Restore
docker exec -i slm-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} slmdb < backup.sql
```

See [QUICK-REFERENCE.md](QUICK-REFERENCE.md) for more commands.

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
sudo systemctl stop nginx
sudo systemctl stop apache2
docker compose restart
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

For more troubleshooting, see [DEPLOY-QUICK-START.md](DEPLOY-QUICK-START.md).

---

## 🔄 Update Application

```bash
cd /docker/slm

# Pull latest changes
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build

# Check status
docker compose ps
```

---

## 🧪 Testing

### Frontend Tests
```bash
cd slm-frontend
npm test
```

### Backend Tests
```bash
cd slm-backend
./gradlew test
```

---

## 📞 Support & Maintenance

### Monitoring

```bash
# Container health
docker compose ps

# Resource usage
docker stats

# Disk space
docker system df
```

### Updates

```bash
# System updates
apt update && apt upgrade -y

# Docker images update
docker compose pull
docker compose up -d
```

### SSL Certificate Renewal

Certificates auto-renew, but to manually renew:

```bash
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew

docker compose restart nginx
```

---

## 🎯 Features

### Frontend
- ✅ Modern Angular 21 framework
- ✅ Responsive design with TailwindCSS
- ✅ Advanced data grids with AG Grid
- ✅ Production-optimized build
- ✅ Nginx serving static files

### Backend
- ✅ Spring Boot 3.2 REST API
- ✅ MySQL 8 database
- ✅ JWT authentication
- ✅ File upload support
- ✅ Health check endpoints
- ✅ CORS configuration

### Infrastructure
- ✅ Docker containerization
- ✅ Nginx reverse proxy
- ✅ SSL/TLS encryption
- ✅ Let's Encrypt certificates
- ✅ Automatic health checks
- ✅ Volume persistence

---

## 📄 License

Private project for salam-ev.de

---

## 🤝 Contributing

This is a private project. For questions or support, contact the development team.

---

## 📝 Changelog

### v1.0.0 - 2026-01-03
- ✅ Initial production deployment
- ✅ Configured for salam-ev.de
- ✅ Docker Compose setup
- ✅ SSL/HTTPS support
- ✅ Automated deployment script
- ✅ Comprehensive documentation

---

**Deployed at**: https://salam-ev.de
**Deployment Path**: /docker/slm
**Contact**: info@salam-ev.de
