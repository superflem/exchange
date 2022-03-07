require('typescript-require');

const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { promisify } = require("util");
const packageDef = protoLoader.loadSync("./proto/valuta.proto", {}); //gli passo il file proto per la comunicazione
const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
const convertiPackage = grpcObject.convertiPackage;

const server = new grpc.Server(); //crea il server
server.bindAsync = promisify(server.bindAsync); //lo fa asincrono


server.bindAsync("0.0.0.0:9000", grpc.ServerCredentials.createInsecure()) //ascolta tutto (0.0.0.0) sulla porta 9000. creo un server insicuro.
.then( () => {  // Di default http2 vuole delle credenziali, cosi facciamo senza

    //cosa faccio una volta creato il server

    server.addService(convertiPackage.ScambioValuta.service, { //aggiungo il servizio ScambioValuta del package convertiPackage al server
        "converti": converti
    }); //quello sopra è un oggetto json. il parametro tra virgolette è rpc del file proto, metre il secondo è la funzione qui sotto
    server.start() //faccio partire il server

    console.log("server in ascolto sulla porta 9000");

}).catch(console.log); 
                                                                       

function converti (call, callback)
{
    const from = call.request['from'];
    const to = call.request['to'];
    const quantita_spesa = call.request['quantitaSpesa'];

    let verso:number;

    //controllo sul giusto cambio
    if (from == 'USD' && to == 'EUR')
        verso = 1; //da dollari a euro
    else if (to == 'USD' && from == 'EUR')
        verso = 2;//da euro a dollari
    else
    {
        console.log('errore nel cambio');
        return;
    }

    //controllo sulla quota
    if (quantita_spesa <= 0)
    {
        console.log('errore nella quota');
        return;
    }

    //leggo il file xml della bce    
    const https = require('https');
    const url = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml?46f0dd7988932599cb1bcac79a10a16a"; //link della BCE
    let dati: string;
    
    dati = ''; //i dati che vengono presi dal file xml

    https.get(url, async (res) => {
        res.on('data', chunk => 
        {
            dati += chunk; //legge riga per riga il file
        });
        res.on('end', () => { //viene trasformato in un formato stringa leggibile 
            const xml2js = require ('xml2js');
            const parser = new xml2js.Parser(); 

            parser.parseString(dati, (err, res) => { //trasformo la stringa in codice json
                const stringaJson = JSON.stringify(res); //ottengo una stringa json

                const json = JSON.parse(stringaJson);  //trasformo la stringa in un oggetto json

                //const cambio = json['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'][0]['$']['rate'];  //ottengo il cambio euro dollari
                //console.log(cambio);// primo tag   => primo cube => cube time => primo oggetto cube => rate

                let cambio:number;
                const cambiValute = json['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'];
                for (let i = 0; i < cambiValute.length; i++)
                {
                    if (cambiValute[i]['$']['currency'] == 'USD')
                    {
                        cambio = cambiValute[i]['$']['rate'];
                        break;
                    }
                }

                //se non trovo il tasso di cambio, do errore
                if (!cambio)
                {
                    console.log('Errore nel trovare il cambio');
                    return;
                }
                else
                {
                    let quantita_comprata:number;
                    //euro : dollari = 1 : cambio
                    if (verso == 1) //da dollari ad euro
                    {
                        quantita_comprata = quantita_spesa / cambio;
                    }
                    else //da euro a dollari
                    {
                        quantita_comprata = quantita_spesa * cambio;
                    }
                
                    //invio al client
                    const output = 
                    {
                        'quantitaComprata': quantita_comprata.toFixed(2)
                    }
                
                    callback(null, output);
                }

            });    
        });
    }).on('error', err => {
        console.log('errore durante la lettura del file: '+err.message);
    });
}
