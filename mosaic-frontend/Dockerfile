FROM node:13.12.0-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install --verbose
COPY . ./
RUN npm run build
FROM nginx:stable-alpine as production-stage
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]