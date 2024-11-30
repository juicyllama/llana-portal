###################
# BUILD
###################

ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-slim as base

ARG PORT=55262

WORKDIR /src

FROM base as build

COPY --link package.json package-lock.json ./

RUN npm install --verbose

COPY . .

RUN npm run build


###################
# PRODUCTION
###################

FROM base

ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /src/.output /src/.output
COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]