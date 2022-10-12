FROM node:16

WORKDIR /app

COPY ./ ./

RUN npm i
RUN ["npm", "run", "build"]

EXPOSE 3000 8100

CMD ["npm", "run", "start"]