# API Testing with cURL Commands

## Register User
curl -X POST https://edugeniebe-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "role": "student"
  }'

## Login User
curl -X POST https://edugeniebe-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

## Get Profile (replace YOUR_TOKEN with actual token)
curl -X GET https://edugeniebe-production.up.railway.app/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

## Windows PowerShell version (if above doesn't work)
Invoke-RestMethod -Uri "https://edugeniebe-production.up.railway.app/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"email":"test@test.com","password":"123456","name":"Test User","role":"student"}'
