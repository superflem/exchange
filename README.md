## Per eseguire questo servizio è necessario avere installato NodeJS, il compilatore TypeScript tsc e Docker

## Script disponibili

Nella cartella del progetto si può eseguire:

### `npm run install`
Installa tutti i moduli necessari sia del backend sia del frontend per eseguire i file

### `npm run build`
Compila tutti i file TypeScript (si possono compilare anche uno ad uno all'interno della cartella del frontend o backend)

### `npm start`
Fa partire docker-compose in background (così si può usare il terminale)\
Bisogna avere Docker acceso\
Se ci sono degli errori, bisogna lanciare il comando da amministratore

### `npm run complete`
Esegue tutti i precedenti script (consigliato quando si scarica il repository da GitHub)\
Può essere necessario lanciarlo come amministratore\
Bisogna avere Docker acceso per eseguire questo comando\
Apri [http://localhost:3000](http://localhost:3000) nel browser (testato con Chrome e Firefox)

### `npm run stop`
Ferma il docker

## Ulteriori specificazioni

Durante lo sviluppo dell'applicazione, ho lavorato con due repository differenti per il backend e per il frontend, 
questo per aiutarmi a mantenere le cose distanziate.\
I link sono: [https://github.com/superflem/backend_exchange](https://github.com/superflem/backend_exchange) e 
[https://github.com/superflem/frontend_exchange](https://github.com/superflem/frontend_exchange)\
Se si scaricano i file di questi repository, bisogna creare il database con il codice SQL presente o usando il file di backup e modificare
i file .env secondo le necessità.\
In questi repository ho usato molto Git, mentre in questo un po' meno perchè ho semplicemente preso il lavoro che avevo già fatto e 
l'ho messo insieme in un'unica cartella aggiungendo poi i Dockerfile e il docker-compose.\
Questa applicazione usa i cookie per il JWT in modalità HttpOnly, può essere quindi necessario modificare le preferenze del browser per
poterli ricevere.\
Nelle sotto cartelle ci sono ulteriori README.md per le singole specifiche del backend e frontend.\
Ho lavorato a questo progetto per tutto febbraio, ho anche ricevuto le credenziali del sandbox ma adesso con l'Univeristà che è ripresa 
faccio fatica a lavorarci (sono all'ultimo semestre del terzo anno). Se il mio progetto vi aggrada, al termine delle lezioni e degli esami (me ne 
mancano solo 3), finirò anche questa parte ed eventualmente correggerò gli errori. Grazie per l'opportunità e per il vostro tempo
Alex Caraffi