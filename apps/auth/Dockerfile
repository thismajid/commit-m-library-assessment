FROM node:21.6.0 AS development

WORKDIR /usr/src/app

COPY package*.json tsconfig.json nest-cli.json ./

COPY apps/auth/ apps/auth/
COPY libs/ libs/

RUN npm ci && npm run build auth

FROM node:alpine AS production

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/package*.json ./
RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
