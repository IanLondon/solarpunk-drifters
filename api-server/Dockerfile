# NOTE: build from monorepo root: `docker build . -f api-server/Dockerfile`
ARG NODE_VERSION=20
ARG NODE_ENV=production

# base
FROM node:${NODE_VERSION}-alpine as base
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/src
COPY package*.json .
COPY api-server/package.json api-server/package.json
COPY common/package.json common/package.json
RUN npm ci

# TODO: use common/ base image?
# Not needed if this is the one and only container in this project...
WORKDIR /usr/src/common
COPY common .
RUN npm run build

WORKDIR /usr/src/api-server
COPY api-server .
RUN npm run build

# prod
FROM node:${NODE_VERSION}-alpine as prod
ENV NODE_ENV production

WORKDIR /usr/src
COPY --from=base usr/src/node_modules ./node_modules
# TODO just common/dist
COPY --from=base usr/src/common ./common
# TODO just api-server/dist
COPY --from=base usr/src/api-server ./api-server

EXPOSE 8080
USER node
CMD ["node", "api-server/dist/index.js"]
