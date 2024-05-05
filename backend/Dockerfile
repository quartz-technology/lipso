#
# 🧑‍💻 Development
#
FROM node:22-alpine AS development

ENV NODE_ENV=development

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node . .

USER node

#
# 🏡 Production Build
#
FROM node:22-alpine AS build

ENV NODE_ENV=production

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN yarn build
RUN yarn --frozen-lockfile --production && yarn cache clean

USER node

#
# 🚀 Production Server
#
FROM node:22-alpine AS production

ENV NODE_ENV production

WORKDIR /app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/dist ./dist

USER node

CMD [ "yarn", "start:prod" ]
