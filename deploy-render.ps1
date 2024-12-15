# Deploy to Render using their API
$RENDER_API_KEY = "NzaRyPblypU"  # Your Render API key
$SERVICE_ID = "srv-ct7utod6l47c73cc47e0"  # Your Render service ID

# Trigger deploy
$Headers = @{
    "Accept" = "application/json"
    "Authorization" = "Bearer $RENDER_API_KEY"
}

$DeployUrl = "https://api.render.com/v1/services/$SERVICE_ID/deploys"

Write-Host "Triggering deployment on Render..."
Invoke-RestMethod -Uri $DeployUrl -Method POST -Headers $Headers

Write-Host "Deployment triggered. Check your Render dashboard for status."
Write-Host "Dashboard URL: https://dashboard.render.com"
