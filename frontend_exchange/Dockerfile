# versione di node da usare
FROM node:16-alpine

# cartella di lavoro
WORKDIR /app

# copio il package.json e installo le dipendenza
COPY package.json .

# in questo modo faccio chaching
RUN npm install

# copio il resto
COPY . .

# espongo la porta 3000
EXPOSE 3000

# eseguo
CMD ["npm", "start"]