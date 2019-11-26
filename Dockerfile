FROM node:dubnium
LABEL maintainer="Nailer kingman330@gmail.com"

RUN mkdir -p /app

WORKDIR /app

ADD ./ /app

RUN yarn install

RUN yarn client:build

ENV NODE_ENV=production

CMD node server/app.js
