# SLM Application - Quick Reference Card

## 🚀 Deployment

```bash
# One-command deployment
ssh root@YOUR_VPS_IP
bash deploy.sh

# Or manual
cd /docker/slm
docker compose -f docker-compose-production.yml up -d
```

## 🔍 Status & Monitoring

```bash
# Check all containers
docker compose ps

# View logs (all)
docker compose logs -f

# View specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f nginx
docker compose logs -f mysql
```

## 🔄 Service Management

```bash
# Start all
docker compose up -d

# Stop all
docker compose down

# Restart all
docker compose restart

# Restart specific
docker compose restart backend
```

## 🌐 URLs

- Frontend: https://salam-ev.de
- Backend: https://salam-ev.de/api
- Health: https://salam-ev.de/api/actuator/health

## 🔐 SSL/HTTPS

```bash
# Get certificate
./get-ssl-cert.sh

# Finalize HTTPS
./finalize-https.sh

# Renew certificate
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot renew
```

## 💾 Backup & Restore

```bash
# Backup database
docker exec slm-mysql mysqldump -uroot -p${MYSQL_ROOT_PASSWORD} slmdb > backup.sql

# Restore database
docker exec -i slm-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD} slmdb < backup.sql

# Backup uploads
docker run --rm -v slm_upload-data:/data -v $(pwd):/backup alpine tar czf /backup/uploads.tar.gz -C /data .
```

## 🔧 Update Application

```bash
cd /docker/slm
git pull
docker compose down
docker compose up -d --build
```

## 🐛 Troubleshooting

```bash
# Port already in use
sudo lsof -i :80
sudo systemctl stop nginx
sudo systemctl stop apache2

# Reset database
docker compose down
docker volume rm slm_mysql-data
docker compose up -d

# Rebuild container
docker compose build --no-cache backend
docker compose up -d backend

# Check DNS
nslookup salam-ev.de 8.8.8.8

# Test HTTPS
curl -I https://salam-ev.de
```

## 📁 Important Files

- `/docker/slm/.env` - Environment variables (NEVER commit!)
- `/docker/slm/nginx/conf.d/salam-ev.conf` - Nginx config
- `/docker/slm/docker-compose-production.yml` - Docker services

## 🎯 Common Tasks

### Change MySQL Password
```bash
# Update .env
nano .env

# Reset database
docker compose down
docker volume rm slm_mysql-data
docker compose up -d
```

### View Environment Variables
```bash
docker exec slm-backend env
docker exec slm-mysql env
```

### Access MySQL Database
```bash
docker exec -it slm-mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD}
```

### Check Disk Space
```bash
df -h
docker system df
docker system prune -a  # Clean unused images
```

### Update DNS
```bash
# Check current DNS
nslookup salam-ev.de

# Update A record to point to VPS IP
# Wait 5-10 minutes for propagation
```

## 📊 Performance Monitoring

```bash
# Container stats
docker stats

# Disk usage
docker system df

# View container resource usage
docker compose top
```

## 🔒 Security

```bash
# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Update system
apt update && apt upgrade -y

# Check SSL certificate expiry
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  certbot/certbot certificates
```

## 💡 Tips

- Always use `docker compose` (not `docker-compose`)
- Check logs when something fails
- Backup before major updates
- Test HTTP before enabling HTTPS
- Keep `.env` file secure and private

---

**Domain**: salam-ev.de
**Deployment Path**: /docker/slm
**Email**: info@salam-ev.de
