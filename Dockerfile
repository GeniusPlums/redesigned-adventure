# To build: docker-compose -f docker-compose.prod.yml build
# To run: docker-compose -f docker-compose.prod.yml up

FROM node:18-slim AS base
WORKDIR /app

# Install SSL certificates and other necessary packages
RUN apt-get update && \
    apt-get install -y \
    ca-certificates \
    openssl \
    wget \
    curl \
    docker-compose-plugin \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Set Node to use system CA certificates
ENV NODE_OPTIONS="--use-openssl-ca"
ENV NODE_TLS_REJECT_UNAUTHORIZED="0"
ENV PGSSLMODE="require"

# Copy package files
COPY package*.json ./
COPY packages/client/package*.json ./packages/client/
COPY packages/server/package*.json ./packages/server/

# Install dependencies
RUN npm install -g npm@10.9.2 && \
    npm install --legacy-peer-deps && \
    cd packages/client && npm install && \
    cd ../server && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd packages/client && \
    DISABLE_ESLINT_PLUGIN=true \
    EXTEND_ESLINT=false \
    ESLINT_NO_DEV_ERRORS=true \
    GENERATE_SOURCEMAP=false \
    TSC_COMPILE_ON_ERROR=true \
    CI=false \
    npm run build:prod

# Build backend
RUN cd packages/server && \
    NODE_ENV=production \
    npm run build

# Install production dependencies
RUN npm install --production --legacy-peer-deps && \
    npm install -g typescript@4.9.5 tslib@2.6.2 ts-node@10.9.1

# Copy and set permissions for entrypoint script before user switch
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Setup user and directories
RUN adduser --uid 1001 --disabled-password --gecos "" appuser && \
    mkdir -p \
        /app/packages/server/src \
        /app/migrations \
        /app/client \
        /app/node_modules \
        /home/appuser/.npm-global && \
    chown -R appuser:appuser /app /home/appuser && \
    chmod -R 755 /app

# Install Docker Compose
RUN curl -L "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

USER appuser

ENV PORT=3000 \
    NODE_ENV=production \
    FORCE_HTTPS=false \
    LAUDSPEAKER_PROCESS_TYPE=WEB \
    PATH="/home/appuser/.npm-global/bin:$PATH" \
    NPM_CONFIG_PREFIX=/home/appuser/.npm-global

EXPOSE 80 3001