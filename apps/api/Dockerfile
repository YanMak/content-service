FROM node:20-alpine as build
#FROM node:20-alpine
WORKDIR /opt/app
ADD *.json ./
RUN npm install
EXPOSE 3000
ADD . .
RUN npx nx run api:build 
#CMD ["node", "/opt/app/dist/apps/api/main.js"]

FROM node:20-alpine
WORKDIR /opt/app
ADD package.json ./
RUN npm install --only=prod
COPY --from=build /opt/app/dist/apps/api ./dist
EXPOSE 3000
CMD ["node", "./dist/main.js"]