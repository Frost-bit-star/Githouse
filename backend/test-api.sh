#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api"
TEST_EMAIL="test@example.com"
TEST_PASSWORD="TestPassword123!"
TEST_USERNAME="testuser"

echo -e "${YELLOW}=== Githouse Backend API Test ===${NC}\n"

# Test 1: Health Check
echo -e "${YELLOW}1. Testing health endpoint...${NC}"
HEALTH=$(curl -s http://localhost:5000/health)
if echo "$HEALTH" | grep -q "OK"; then
    echo -e "${GREEN}✓ Health check passed${NC}\n"
else
    echo -e "${RED}✗ Health check failed${NC}\n"
    exit 1
fi

# Test 2: Register User
echo -e "${YELLOW}2. Testing user registration...${NC}"
REGISTER=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"confirmPassword\": \"$TEST_PASSWORD\",
    \"username\": \"$TEST_USERNAME\",
    \"fullName\": \"Test User\"
  }")

if echo "$REGISTER" | grep -q "success"; then
    TOKEN=$(echo "$REGISTER" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Registration successful${NC}"
    echo -e "Token: ${TOKEN:0:20}...${NC}\n"
else
    echo -e "${RED}✗ Registration failed${NC}"
    echo "$REGISTER" | head -c 200
    echo -e "\n\n"
fi

# Test 3: Get Current User
if [ ! -z "$TOKEN" ]; then
    echo -e "${YELLOW}3. Testing get current user...${NC}"
    USER=$(curl -s -X GET "$API_URL/auth/me" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json")
    
    if echo "$USER" | grep -q "$TEST_EMAIL"; then
        echo -e "${GREEN}✓ Get user successful${NC}\n"
    else
        echo -e "${RED}✗ Get user failed${NC}\n"
    fi
fi

# Test 4: Get Communities
echo -e "${YELLOW}4. Testing get communities...${NC}"
COMMUNITIES=$(curl -s -X GET "$API_URL/communities?page=1&limit=5" \
  -H "Content-Type: application/json")

if echo "$COMMUNITIES" | grep -q "pagination"; then
    echo -e "${GREEN}✓ Get communities successful${NC}\n"
else
    echo -e "${RED}✗ Get communities failed${NC}\n"
fi

# Test 5: Get Posts
echo -e "${YELLOW}5. Testing get posts...${NC}"
POSTS=$(curl -s -X GET "$API_URL/posts?page=1&limit=5" \
  -H "Content-Type: application/json")

if echo "$POSTS" | grep -q "success"; then
    echo -e "${GREEN}✓ Get posts successful${NC}\n"
else
    echo -e "${RED}✗ Get posts failed${NC}\n"
fi

echo -e "${GREEN}=== All tests completed ===${NC}"
