## Per eseguire questo servizio è necessario avere installato NodeJS, il compilatore TypeScript e Docker

## Script disponibili

Nella cartella del progetto si può eseguire:

### `npm run install`
Installa tutti i moduli necessari sia del backend sia del frontend per eseguire i file

### `npm run build`
Compila tutti i file TypeScript (si possono compilare anche uno ad uno all'interno della cartella del frontend o backend)

### `npm start`
Fa partire il docker
Se ci sono degli errori, bisogna lanciare il comando da amministratore

### `npm run stop`
Ferma il docker

### `npm run complete`
Esegue tutti i precedenti script (tranne lo stop)
Può essere necessario lanciarlo come amministratore