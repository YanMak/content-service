FROM node:20-alpine as build
WORKDIR /opt/app
ADD *.json ./
RUN npm install
ADD . .
RUN npx nx run converter:build

FROM node:20-alpine
WORKDIR /opt/app
ADD package.json ./
RUN npm install --only=prod
COPY --from=build /opt/app/dist/apps/converter ./dist
CMD ["node", "./dist/main.js"]