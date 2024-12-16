#!/bin/bash
set -e

echo "Waiting for dependencies..."
sleep 10

echo "Running clickhouse-migrations"
clickhouse-migrations migrate

echo "Running Typeorm migrations"
cd packages/server && npm run typeorm migration:run

echo "Starting LaudSpeaker Process: $LAUDSPEAKER_PROCESS_TYPE"
if [ "$NODE_ENV" = "production" ]; then
  echo "Starting application in production mode..."
  node dist/src/main.js
else
  echo "Starting application in development mode..."
  npm run start:dev
fi
