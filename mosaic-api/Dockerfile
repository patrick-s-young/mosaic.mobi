#build stage for a Node.js application
FROM node:10-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

#production stage
FROM node:10-alpine AS production-stage
WORKDIR /app
COPY --from=build-stage /app /app
EXPOSE 3002
CMD ["node", "dist/server.js"]