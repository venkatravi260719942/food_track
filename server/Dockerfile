# Use Node.js 16 as base image
FROM node:16-buster-slim

# Set the working directory inside the container
WORKDIR /app

# Install required packages and set permissions
RUN apt-get update \
    && apt-get install -y build-essential curl --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man \
    && apt-get clean

# Copy package.json and package-lock.json, and set ownership to 'node' user
COPY --chown=node:node package*.json ./

# Ensure node_modules folder has the correct permissions
RUN mkdir -p /app/node_modules && chown node:node /app/node_modules

# Install npm dependencies (ci is used for a clean install)
RUN npm ci

# Copy the Prisma schema and other necessary files into the container
COPY --chown=node:node prisma ./prisma

# Run Prisma generate to create the Prisma client
RUN npx prisma generate

# Copy all the application files into the container and set correct ownership
COPY --chown=node:node . .

# Expose port 9000 for the application (adjust if needed)
EXPOSE 9000

# Set environment variables (if required)
# ENV NODE_ENV=production

# Set the user as 'node' for security
USER node

# Start the application
CMD ["npm", "start"]
