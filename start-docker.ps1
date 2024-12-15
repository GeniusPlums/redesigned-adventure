# Database Configuration
$env:DATABASE_URL="postgresql://astrazen_user:YlENu30fCsf3qpjzKggLBm0EWJb6LbMS@dpg-otc292ogph6c73aabl50-a/astrazen"
$env:DATABASE_SSL="true"

# Redis Configuration
$env:REDIS_HOST="redis-12988.c283.us-east-1-4.ec2.redns.redis-cloud.com"
$env:REDIS_PORT="12988"
$env:REDIS_PASSWORD="cYRKTgLTXTiI1asnwQgsgISDy3ctHm8R"
$env:REDIS_USERNAME="default"

# Clickhouse Configuration
$env:CLICKHOUSE_HOST="okai3ae0ad.ap-south-1.aws.clickhouse.cloud"
$env:CLICKHOUSE_PORT="8443"
$env:CLICKHOUSE_USER="default"
$env:CLICKHOUSE_PASSWORD="fFc.5FoDUOZZQ"
$env:CLICKHOUSE_DB="default"

# MongoDB Configuration
$env:MONGODB_URI="mongodb+srv://2f1YzyuwkogQRbWa:2f1YzyuwkogQRbWaaastrazen.q4mjj.mongodb.net/?authSource=admin"

# Kafka Configuration
$env:KAFKA_BROKERS="kafka1:20092"
$env:KAFKA_CLIENT_ID="laudspeaker-client"
$env:KAFKA_GROUP_ID="laudspeaker-consumer-group"

# Application Configuration
$env:JOURNEY_ONBOARDING="true"
$env:SYNCHRONIZE="true"
$env:NODE_ENV="production"

Write-Host "Building and starting containers..."
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

Write-Host "Containers are starting... You can check their status with 'docker ps'"
