FROM node:16-buster-slim

WORKDIR /app

# Install dependencies
RUN apt-get update \
  && apt-get install -y build-essential curl --no-install-recommends \
  && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man \
  && apt-get clean

# Switch to node user
USER node

# Ensure the node_modules folder has the correct permissions
RUN mkdir -p /app/node_modules && chown node:node /app/node_modules

# Copy package.json and package-lock.json
COPY --chown=node:node package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Set environment variables
ARG NODE_ENV="production"
ARG LOG_LEVEL="info"
ARG DATABASE_URL
ENV NODE_ENV="${NODE_ENV}" \
    PATH="${PATH}:/node_modules/.bin" \
    USER="node" \
    DATABASE_URL="${DATABASE_URL}" \
    LOG_LEVEL="${LOG_LEVEL}"

# Copy remaining application files
COPY --chown=node:node . .

EXPOSE 9000

CMD node server
