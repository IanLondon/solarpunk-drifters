ARG NODE_VERSION=20
ARG NODE_ENV=production

FROM node:${NODE_VERSION}-alpine as builder
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine as final
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/src/app
COPY --from=builder usr/src/app/node_modules ./node_modules
COPY --from=builder usr/src/app/dist ./dist

EXPOSE 8080
USER node
CMD ["node", "dist/index.js"]
