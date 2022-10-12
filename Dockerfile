FROM node:alpine

WORKDIR /app

COPY ./ ./

RUN npm i
RUN webpack --mode=production

CMD ["npm", "run", "start"]