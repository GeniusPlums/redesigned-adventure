# Set your Docker Hub username or registry URL
$DOCKER_USERNAME = "your-docker-username"  # Replace with your Docker Hub username

# Build the images
Write-Host "Building server image..."
docker build -f Dockerfile.prod.server -t $DOCKER_USERNAME/laudspeaker-server:latest .

Write-Host "Building client image..."
docker build -f Dockerfile.prod.client -t $DOCKER_USERNAME/laudspeaker-client:latest .

# Push the images
Write-Host "Pushing server image..."
docker push $DOCKER_USERNAME/laudspeaker-server:latest

Write-Host "Pushing client image..."
docker push $DOCKER_USERNAME/laudspeaker-client:latest
