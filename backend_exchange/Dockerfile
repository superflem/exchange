FROM node:17-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 9000

EXPOSE 9001

EXPOSE 80

CMD ["npm", "start"]