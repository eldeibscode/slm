#!/bin/bash
# =============================================================================
# Get SSL Certificate for salam-ev.de
# =============================================================================

echo "=========================================="
echo " SSL Certificate for salam-ev.de"
echo "=========================================="
echo ""

cd /docker/slm

# Step 1: Stop nginx temporarily
echo "Step 1: Stopping nginx temporarily..."
docker compose stop nginx

# Step 2: Get SSL certificate from Let's Encrypt
echo "Step 2: Getting SSL certificate from Let's Encrypt..."
echo "Domain: salam-ev.de, www.salam-ev.de"
echo "Email: info@salam-ev.de"
echo ""

docker run --rm -p 80:80 \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly --standalone \
  -d salam-ev.de \
  -d www.salam-ev.de \
  --agree-tos \
  --email info@salam-ev.de \
  --non-interactive

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ SSL Certificate obtained successfully!"
    echo ""

    # Step 3: Switch nginx configuration to HTTPS
    echo "Step 3: Switching nginx to HTTPS configuration..."
    cd nginx/conf.d

    # Backup HTTP config
    if [ -f salam-ev.conf ]; then
        mv salam-ev.conf salam-ev-http-backup.conf
    fi

    # Activate HTTPS config
    cp salam-ev-https.conf.template salam-ev.conf
    cd ../..

    # Step 4: Restart nginx with HTTPS
    echo "Step 4: Starting nginx with HTTPS..."
    docker compose up -d nginx

    echo ""
    echo "Waiting 10 seconds..."
    sleep 10

    # Step 5: Test HTTPS access
    echo ""
    echo "Step 5: Testing HTTPS access..."
    HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://salam-ev.de 2>/dev/null || echo "000")
    echo "HTTPS Status: $HTTPS_CODE"

    echo ""
    echo "=========================================="
    echo " ✓ HTTPS Setup Complete!"
    echo "=========================================="
    echo ""
    echo "Your site is now running on:"
    echo "  https://salam-ev.de"
    echo "  https://www.salam-ev.de"
    echo ""
    echo "Next steps:"
    echo "  1. Update .env file to use HTTPS"
    echo "  2. Restart backend"
    echo "  3. Update database URLs"
    echo ""
    echo "Run:"
    echo "  ./finalize-https.sh"
    echo ""
else
    echo ""
    echo "✗ ERROR getting SSL certificate!"
    echo ""
    echo "Possible causes:"
    echo "  - DNS not pointing to this server yet"
    echo "  - Port 80 is blocked"
    echo "  - Domain is not reachable"
    echo ""
    echo "Check DNS:"
    echo "  nslookup salam-ev.de 8.8.8.8"
    echo ""
    # Restart nginx
    docker compose start nginx
fi
