# To build: docker build -f Dockerfile -t laudspeaker/laudspeaker:latest .
# To run: docker-compose -f docker-compose.prod.yml up
FROM node:16 as frontend_build
ARG EXTERNAL_URL
ARG FRONTEND_SENTRY_AUTH_TOKEN
ARG FRONTEND_SENTRY_ORG=laudspeaker-rb
ARG FRONTEND_SENTRY_PROJECT=javascript-react
ARG FRONTEND_SENTRY_DSN_URL=https://2444369e8e13b39377ba90663ae552d1@o4506038702964736.ingest.sentry.io/4506038705192960
ARG REACT_APP_POSTHOG_HOST
ARG REACT_APP_POSTHOG_KEY
ARG REACT_APP_ONBOARDING_API_KEY
ENV SENTRY_AUTH_TOKEN=${FRONTEND_SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${FRONTEND_SENTRY_ORG}
ENV SENTRY_PROJECT=${FRONTEND_SENTRY_PROJECT}
ENV REACT_APP_SENTRY_DSN_URL_FRONTEND=${FRONTEND_SENTRY_DSN_URL}
ENV REACT_APP_WS_BASE_URL=${EXTERNAL_URL}
ENV REACT_APP_POSTHOG_HOST=${REACT_APP_POSTHOG_HOST}
ENV REACT_APP_POSTHOG_KEY=${REACT_APP_POSTHOG_KEY}
ENV REACT_APP_ONBOARDING_API_KEY=${REACT_APP_ONBOARDING_API_KEY}
WORKDIR /app

# Set npm config for better network reliability
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 300000 \
    && npm config set fetch-retries 5 \
    && npm config set registry https://registry.npmjs.org/

COPY ./packages/client/package.json /app/
COPY ./package-lock.json /app/
RUN npm install --legacy-peer-deps --network-timeout=300000 --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
COPY . /app
RUN npm run format:client
RUN npm run build:client
# Basically an if else but more readable in two lines
RUN if [ -z "$FRONTEND_SENTRY_AUTH_TOKEN" ] ; then echo "Not building sourcemaps, FRONTEND_SENTRY_AUTH_TOKEN not provided" ; fi
# Need to add sentry_release here because of: https://stackoverflow.com/a/41864647
RUN if [ ! -z "$FRONTEND_SENTRY_AUTH_TOKEN" ] ; then REACT_APP_SENTRY_RELEASE=$(./node_modules/.bin/sentry-cli releases propose-version) npm run build:client:sourcemaps ; fi

FROM node:16 as backend_build
ARG BACKEND_SENTRY_AUTH_TOKEN
ARG BACKEND_SENTRY_ORG=laudspeaker-rb
ARG BACKEND_SENTRY_PROJECT=node
ENV SENTRY_AUTH_TOKEN=${BACKEND_SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${BACKEND_SENTRY_ORG}
ENV SENTRY_PROJECT=${BACKEND_SENTRY_PROJECT}
WORKDIR /app

# Set npm config for better network reliability
RUN npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm config set fetch-timeout 300000 \
    && npm config set fetch-retries 5 \
    && npm config set registry https://registry.npmjs.org/

# Install global dependencies needed for build
RUN npm install -g rimraf @nestjs/cli --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY --from=frontend_build /app/packages/client/package.json /app/
COPY ./packages/server/package.json /app
RUN npm install --legacy-peer-deps --network-timeout=300000 --fetch-retries=5 --fetch-retry-factor=2 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000
COPY . /app
RUN npm run build:server
# Basically an if else but more readable in two lines
RUN if [ -z "$BACKEND_SENTRY_AUTH_TOKEN" ] ; then echo "Not building sourcemaps, BACKEND_SENTRY_AUTH_TOKEN not provided" ; fi
RUN if [ ! -z "$BACKEND_SENTRY_AUTH_TOKEN" ] ; then npm run build:server:sourcemaps ; fi

RUN ./node_modules/.bin/sentry-cli releases propose-version > /app/SENTRY_RELEASE

FROM node:16-slim as final
# Env vars
ARG BACKEND_SENTRY_DSN_URL=https://15c7f142467b67973258e7cfaf814500@o4506038702964736.ingest.sentry.io/4506040630640640
ENV SENTRY_DSN_URL_BACKEND=${BACKEND_SENTRY_DSN_URL}
ENV NODE_ENV=production
ENV ENVIRONMENT=production
ENV SERVE_CLIENT_FROM_NEST=true
ENV CLIENT_PATH=/app/client
ENV PATH /app/node_modules/.bin:$PATH
ENV FRONTEND_URL=${EXTERNAL_URL}
ENV POSTHOG_HOST=https://app.posthog.com
ENV POSTHOG_KEY=RxdBl8vjdTwic7xTzoKTdbmeSC1PCzV6sw-x-FKSB-k

# Install Docker Compose
RUN apt-get update && apt-get install -y \
    curl \
    && curl -L "https://github.com/docker/compose/releases/download/v2.23.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose \
    && chmod +x /usr/local/bin/docker-compose \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Setting working directory
WORKDIR /app

# Copy docker-compose files
COPY docker-compose.prod.yml /app/
COPY .env.example /app/.env

#Copy package.json from server over
COPY ./packages/server/package.json /app

#Copy over all app files
COPY --from=frontend_build /app/packages/client/build /app/client
COPY --from=backend_build /app/packages/server/dist /app/dist
COPY --from=backend_build /app/node_modules /app/node_modules
COPY --from=backend_build /app/packages /app/packages
COPY --from=backend_build /app/SENTRY_RELEASE /app/
COPY ./scripts /app/scripts/

#Expose web ports
EXPOSE 80 3001

COPY docker-entrypoint.sh /app/docker-entrypoint.sh

RUN ["chmod", "+x", "/app/docker-entrypoint.sh"]

# Modify entrypoint to use docker-compose
ENTRYPOINT ["docker-compose", "-f", "docker-compose.prod.yml", "up"]
