# To build: docker build .
# To run: docker run -p 3000:3000 <image-name>

FROM node:18-bullseye-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Create a non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app

# Copy and set permissions for entrypoint script
COPY docker-entrypoint.sh /app/
RUN chmod +x /app/docker-entrypoint.sh

# Switch to non-root user
USER appuser

# Expose ports
EXPOSE 80 3001

# Set entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]