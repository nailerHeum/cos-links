FROM node:dubnium
MAINTAINER Nailer kingman330@gmail.com

RUN mkdir -p /app

WORKDIR /app

ADD ./ /app

RUN npm install

ENV NODE_ENV=production

CMD node app.js
