# Base image for development
FROM node:21.6.0 As development

WORKDIR /usr/src/app

# Copy necessary files
COPY package*.json ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

# Copy your application source code
COPY apps/auth apps/auth
COPY libs libs

# Install dependencies
RUN npm ci

# Copy the wait-for-it.sh script
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh

# Ensure the script is executable
RUN chmod +x /usr/src/app/wait-for-it.sh

# Build the application
RUN npm run build auth

# Base image for production
FROM node:alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci



# Copy the built application from the development stage
COPY --from=development /usr/src/app/dist ./
