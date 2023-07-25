# Installs Node.js image
FROM node:16.13.1-alpine3.14

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/app (e.g. /usr/app/package.json)
WORKDIR /usr/app

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY package*.json ./

# Installs all packages
RUN npm install

# Copies everything in the src directory to WORKDIR/app
COPY ./ ./

# Run container as non-root (unprivileged) user
# The node user is provided in the Node.js Alpine base image
USER node

# Runs the dev npm script to build & start the server
# CMD npm run dev
CMD [ "npm", "run", "dev" ]
