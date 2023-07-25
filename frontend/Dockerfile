# Base on offical Node.js Alpine image
FROM node:18-alpine3.18

# Set working directory
WORKDIR /usr/app

RUN npm set registry=https://registry.npmjs.org/
RUN npm cache clear --force

# Install PM2 globally
RUN npm install --global pm2
# RUN npm install -g npm@9.6.5

# Copy package.json and package-lock.json before other files
# Utilise Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

# Install dependencies
# RUN npm cache clear --force
RUN npm install

# Copy all files
COPY ./ ./

# Build app
RUN npm run build

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Run npm start script with PM2 when container starts
CMD [ "pm2-runtime", "npm", "--", "start" ]