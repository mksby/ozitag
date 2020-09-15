FROM node:13.12.0-alpine

WORKDIR /var/www/web

ENV PATH /var/www/web/node_modules/.bin:$PATH

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

CMD ["npm", "start"]