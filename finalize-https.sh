#!/bin/bash
# =============================================================================
# Finalize HTTPS - Update Backend and Database
# =============================================================================

echo "=========================================="
echo " Finalize HTTPS Setup"
echo "=========================================="
echo ""

cd /docker/slm

# Step 1: Update .env to use HTTPS
echo "Step 1: Updating .env file..."
sed -i 's|http://[^/]*|https://salam-ev.de|g' .env

echo "✓ APP_UPLOAD_URL_PREFIX = https://salam-ev.de"
echo ""

# Step 2: Restart backend
echo "Step 2: Restarting backend..."
docker compose restart backend

echo "Waiting 15 seconds..."
sleep 15

# Step 3: Check environment variables
echo ""
echo "Step 3: Checking environment variables..."
docker exec slm-backend env | grep APP_UPLOAD

# Step 4: Update database URLs
echo ""
echo "Step 4: Updating database URLs..."
echo ""

# Get MySQL password
MYSQL_PASS=$(docker exec slm-mysql printenv MYSQL_ROOT_PASSWORD 2>/dev/null)

if [ -z "$MYSQL_PASS" ]; then
    echo "Using slm_user..."
    docker exec -i slm-mysql mysql -uslm_user -pslm_password <<EOF
USE slmdb;

UPDATE report_images
SET url = REPLACE(url, 'http://', 'https://');

SELECT COUNT(*) as 'Updated Images' FROM report_images WHERE url LIKE 'https://salam-ev.de%';
EOF
else
    echo "Using root..."
    docker exec -i slm-mysql mysql -uroot -p"$MYSQL_PASS" <<EOF
USE slmdb;

UPDATE report_images
SET url = REPLACE(url, 'http://', 'https://');

SELECT COUNT(*) as 'Updated Images' FROM report_images WHERE url LIKE 'https://salam-ev.de%';
EOF
fi

echo ""
echo "=========================================="
echo " ✓ DONE! 🎉"
echo "=========================================="
echo ""
echo "Your application is now fully running on HTTPS:"
echo ""
echo "  Frontend:  https://salam-ev.de"
echo "  Backend:   https://salam-ev.de/api"
echo "  Images:    https://salam-ev.de/api/uploads/reports/..."
echo ""
echo "Test in browser: https://salam-ev.de"
echo ""
