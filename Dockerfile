# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Use NODE_ENV as a build argument and default to 'production'
ARG NODE_ENV

RUN cp env/.env.${NODE_ENV} .env

# Build the Vue.js application for production
RUN npm run build

# Use a lightweight Node.js runtime as a final image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the build image to the final image
COPY --from=build /app/dist ./dist

# Install a static server for serving the application
RUN npm install -g serve

# Expose port 5000 for serving the application
EXPOSE 5000

# Command to start the static server and serve the application
CMD ["serve", "-s", "dist", "-l", "5000"]
