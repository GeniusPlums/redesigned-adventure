# Set environment variables for build
$env:DATABASE_URL="postgresql://astrazen_user:YlENu30fCsf3qpjzKggLBm0EWJb6LbMS@dpg-otc292ogph6c73aabl50-a/astrazen"
$env:DATABASE_SSL="true"
$env:REDIS_HOST="redis-12988.c283.us-east-1-4.ec2.redns.redis-cloud.com"
$env:REDIS_PORT="12988"
$env:REDIS_PASSWORD="cYRKTgLTXTiI1asnwQgsgISDy3ctHm8R"
$env:REDIS_USERNAME="default"
$env:CLICKHOUSE_HOST="okai3ae0ad.ap-south-1.aws.clickhouse.cloud"
$env:CLICKHOUSE_PORT="8443"
$env:CLICKHOUSE_USER="default"
$env:CLICKHOUSE_PASSWORD="fFc.5FoDUOZZQ"
$env:CLICKHOUSE_DB="default"
$env:MONGODB_URI="mongodb+srv://2f1YzyuwkogQRbWa:2f1YzyuwkogQRbWaaastrazen.q4mjj.mongodb.net/?authSource=admin"
$env:KAFKA_BROKERS="kafka1:20092"
$env:KAFKA_CLIENT_ID="laudspeaker-client"
$env:KAFKA_GROUP_ID="laudspeaker-consumer-group"
$env:JOURNEY_ONBOARDING="true"
$env:SYNCHRONIZE="true"
$env:NODE_ENV="production"

# Set npm config for better network reliability
npm config set fetch-retry-mintimeout 100000
npm config set fetch-retry-maxtimeout 600000
npm config set fetch-timeout 600000
npm config set registry https://registry.npmjs.org/

Write-Host "Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache --progress=plain
