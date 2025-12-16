#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Checking Backend API..."
echo ""

BACKEND_URL="https://ghrs-backend.onrender.com"

# Check if backend is up
echo "1. Checking if backend is running..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL)
if [ $STATUS -eq 200 ]; then
    echo -e "${GREEN}✓${NC} Backend is running (Status: $STATUS)"
else
    echo -e "${RED}✗${NC} Backend returned status: $STATUS"
fi
echo ""

# Check API endpoints
echo "2. Checking API endpoints..."

endpoints=(
    "/api/categories"
    "/api/articles"
    "/api/blogs"
    "/api/sets"
    "/api/courses"
)

for endpoint in "${endpoints[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL$endpoint")
    if [ $STATUS -eq 200 ]; then
        echo -e "${GREEN}✓${NC} $endpoint (Status: $STATUS)"
    else
        echo -e "${RED}✗${NC} $endpoint (Status: $STATUS)"
    fi
done

echo ""
echo "3. Testing sample API call..."
echo "GET $BACKEND_URL/api/categories"
echo ""
curl -s "$BACKEND_URL/api/categories" | head -200
echo ""
echo ""
echo "Done!"
