# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=23.4.0
FROM node:${NODE_VERSION}-slim AS base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install pnpm
ARG PNPM_VERSION=10.20.0
RUN npm install -g pnpm@$PNPM_VERSION


# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

RUN mkdir /app/client
RUN mkdir /app/server

# Install node modules
COPY client/package.json client/pnpm-lock.yaml /app/client
COPY server/package.json server/pnpm-lock.yaml /app/server



WORKDIR /app/client
RUN pnpm install --frozen-lockfile --prod=false

WORKDIR /app/server
RUN pnpm install --frozen-lockfile --prod=false

WORKDIR /app/client
# Copy application code
COPY /client .
# Build application
RUN pnpm run build
# Remove development dependencies
RUN pnpm prune --prod

WORKDIR /app/server
# Copy application code
COPY /server .
# Build application
RUN pnpm run build
# Remove development dependencies
RUN pnpm prune --prod


# Production Stage
FROM nginx:stable-alpine AS production
RUN apk add --no-cache nodejs

COPY Nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
COPY --from=build /app/server /server
EXPOSE 80

# Copy the start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Use the start script as the command
CMD ["/start.sh"]

# CMD ["nginx", "-g", "daemon off;"]