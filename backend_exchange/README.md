## Per eseguire questo servizio è necessario avere installato NodeJS e il compilatore TypeScript tsc

Il file database.ts effettua una connessione al database e restituisce la variabile db che permetterà di eseguire delle query\
Il file server_users.ts crea un server in ascolto sulla porta 9001 che esegue i servizi dell'utente come signup, deposit eccetera\
Il file exchange.ts crea un server in ascolto sulla porta 9000 che effettua il cambio di valuta\
Il file api.ts crea un server in ascolto sulla porta 80 che riceve le richieste da internet e le smista nei giusti server

## Script disponibili

Nella cartella del progetto si può eseguire:

### `npm install`
Installa tutti i moduli necessari per eseguire i file

### `npm run build`
Compila tutti i file TypeScript (si possono compilare anche uno ad uno)

### `npm start`
Fa partire i server (si possono far partire anche uno ad uno)\
Se ci sono degli errori bisogna lanciare il comando da amministratore