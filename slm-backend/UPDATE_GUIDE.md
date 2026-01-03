# How to Update Hostinger Docker Container with Latest Code

This guide covers multiple methods to update your Docker containers on Hostinger with the latest codebase.

## Method 1: Using SSH (Recommended)

### Step 1: SSH into Your Hostinger VPS

```bash
ssh your-username@your-server-ip
```

### Step 2: Navigate to Your Project Directory

```bash
cd /var/www/slm-backend  # or wherever your project is located
```

### Step 3: Pull Latest Code from Git

```bash
# Stash any local changes (if needed)
git stash

# Pull latest code
git pull origin main

# If you stashed changes, you can reapply them
# git stash pop
```

### Step 4: Update Environment Variables (if needed)

```bash
# Edit .env file if there are new environment variables
nano .env

# Compare with .env.example to see if anything new was added
diff .env .env.example
```

### Step 5: Rebuild and Restart Containers

```bash
# Stop current containers
docker-compose down

# Rebuild the backend image (forces rebuild with latest code)
docker-compose build --no-cache backend

# Start containers with new image
docker-compose up -d

# Alternative: Single command to rebuild and restart
# docker-compose up -d --build
```

### Step 6: Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs to ensure everything started correctly
docker-compose logs -f backend

# Test the API
curl http://localhost:3000/api/
```

### Quick Update Script

Create a script for easier updates:

```bash
# Create update script
nano update.sh
```

Add this content:

```bash
#!/bin/bash

echo "🔄 Updating SLM Backend..."

# Pull latest code
echo "📥 Pulling latest code from Git..."
git pull origin main

# Check if pull was successful
if [ $? -ne 0 ]; then
    echo "❌ Git pull failed. Please resolve conflicts manually."
    exit 1
fi

# Rebuild and restart
echo "🔨 Rebuilding Docker containers..."
docker compose down
docker compose build --no-cache backend
docker compose up -d

# Wait a moment for containers to start
sleep 5

# Check status
echo "✅ Checking container status..."
docker-compose ps

echo "📋 Recent logs:"
docker-compose logs --tail=20 backend

echo "✅ Update complete!"
```

Make it executable:

```bash
chmod +x update.sh
```

Run it:

```bash
./update.sh
```

## Method 2: Using Hostinger Docker Manager Interface

### Step 1: Access Docker Manager

1. Log in to Hostinger hPanel
2. Navigate to **VPS → Docker Manager**
3. Find your project (e.g., `slm-backend`)

### Step 2: Stop Containers

1. Click on your project
2. Click **"Verwalten"** (Manage) for each container
3. Click **"Stop"**

### Step 3: Update Code via Terminal

In the Hostinger Docker Manager:
1. Click **"Terminal"** button
2. Run:

```bash
cd /var/www/slm-backend
git pull origin main
```

### Step 4: Rebuild via Interface

1. Go back to Docker Manager
2. Click on your project
3. Click **"Compose"** button
4. Click **"Rebuild"** or update the compose configuration
5. Click **"Deploy"**

## Method 3: Zero-Downtime Update (Blue-Green Deployment)

For production environments where you can't afford downtime:

### Step 1: Pull Latest Code

```bash
ssh your-username@your-server-ip
cd /var/www/slm-backend
git pull origin main
```

### Step 2: Build New Image with Different Tag

```bash
# Build new image with timestamp tag
docker-compose build backend
docker tag slm-backend:latest slm-backend:$(date +%Y%m%d_%H%M%S)
```

### Step 3: Start New Container on Different Port

Create a temporary compose file:

```bash
cp docker-compose.yml docker-compose.new.yml
nano docker-compose.new.yml
```

Modify the backend service port:
```yaml
backend:
  container_name: slm-backend-new
  ports:
    - "3001:3000"  # Different external port
```

Start new version:
```bash
docker-compose -f docker-compose.new.yml up -d backend
```

### Step 4: Test New Version

```bash
curl http://localhost:3001/api/
```

### Step 5: Switch Traffic

Update Nginx to point to new container:

```bash
sudo nano /etc/nginx/sites-available/slm-backend
```

Change `proxy_pass` from `http://localhost:3000` to `http://localhost:3001`

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: Remove Old Container

```bash
docker-compose down
rm docker-compose.new.yml
docker-compose up -d
```

## Method 4: Automated Updates with Git Webhooks

Set up automatic updates when you push to Git:

### Step 1: Create Update Endpoint

Add a simple webhook endpoint to your backend or create a separate script.

### Step 2: Configure Git Webhook

In your GitHub/GitLab repository:
1. Go to **Settings → Webhooks**
2. Add webhook URL: `https://yourdomain.com/webhook/update`
3. Select **Push events**

### Step 3: Create Webhook Handler Script

```bash
nano /var/www/webhook-handler.sh
```

```bash
#!/bin/bash

cd /var/www/slm-backend
git pull origin main
docker-compose down
docker-compose up -d --build
```

Make it executable:
```bash
chmod +x /var/www/webhook-handler.sh
```

## Troubleshooting

### Issue: "Image is being used by running container"

```bash
# Force remove old containers and images
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

### Issue: "Port already in use"

```bash
# Find what's using the port
sudo lsof -i :3000

# Kill the process or stop the old container
docker stop slm-backend
docker rm slm-backend
```

### Issue: Database migration needed

```bash
# Backup database first
docker-compose exec mysql mysqldump -u root -p slmdb > backup_$(date +%Y%m%d).sql

# Then update
docker-compose up -d --build
```

### Issue: Environment variables not updating

```bash
# Recreate containers with new environment
docker-compose up -d --force-recreate
```

## Best Practices

### 1. Always Backup Before Updating

```bash
# Backup database
docker-compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} slmdb > backup_$(date +%Y%m%d).sql

# Backup uploaded files
tar -czf uploads_backup_$(date +%Y%m%d).tar.gz ./uploads
```

### 2. Test in Staging First

If possible, test updates in a staging environment before production.

### 3. Use Git Tags for Versions

```bash
# Tag releases
git tag -a v1.0.1 -m "Release version 1.0.1"
git push origin v1.0.1

# Deploy specific version
git checkout v1.0.1
docker-compose up -d --build
```

### 4. Monitor Logs During Update

```bash
# Watch logs in real-time during update
docker-compose logs -f backend
```

### 5. Health Check After Update

```bash
# Check API is responding
curl -f http://localhost:3000/api/ || echo "API is down!"

# Check database connection
docker-compose exec backend wget -q --spider http://localhost:3000/api/health || echo "Health check failed!"
```

## Quick Reference Commands

```bash
# Pull and rebuild
git pull && docker-compose up -d --build

# View logs
docker-compose logs -f backend

# Restart specific service
docker-compose restart backend

# Check status
docker-compose ps

# Clean rebuild (removes cache)
docker-compose build --no-cache && docker-compose up -d

# Emergency rollback
git reset --hard HEAD~1  # Go back one commit
docker-compose up -d --build
```

## Rollback Procedure

If something goes wrong:

```bash
# Method 1: Git rollback
git log --oneline  # Find commit hash
git reset --hard <commit-hash>
docker-compose up -d --build

# Method 2: Use previous image
docker images  # Find previous image
docker tag slm-backend:<previous-tag> slm-backend:latest
docker-compose up -d

# Method 3: Restore from backup
docker-compose down
git checkout <previous-commit>
docker-compose up -d --build
```

## Maintenance Mode (Optional)

Create a simple maintenance page:

```bash
# In Nginx config, add maintenance mode check
if (-f /var/www/maintenance.html) {
    return 503;
}

error_page 503 @maintenance;
location @maintenance {
    root /var/www;
    rewrite ^(.*)$ /maintenance.html break;
}
```

Enable maintenance:
```bash
echo "Under Maintenance - Be back soon!" > /var/www/maintenance.html
```

Disable maintenance:
```bash
rm /var/www/maintenance.html
```

## Automated Update Schedule

Use cron for scheduled updates:

```bash
# Edit crontab
crontab -e

# Add scheduled update (e.g., every Sunday at 2 AM)
0 2 * * 0 cd /var/www/slm-backend && git pull origin main && docker-compose up -d --build
```
