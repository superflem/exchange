require('typescript-require');

//GRPC
//come per il server, deve conoscere il pacchetto e i servizi
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("./proto/comunicazione.proto", {}); //gli passo il file proto per la comunicazione
const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
const comunicazionePackage = grpcObject.comunicazionePackage;

const client = new comunicazionePackage.ComunicazioneServer("localhost:9001", grpc.credentials.createInsecure()); //dico al client cn quale package devo comunicare e dove è il server

function listTransactions (req, response)
{
    let utente = req.cookies["utente"];
    utente = utente.replace('"', '');
    utente = utente.replace('"', '');

    const {valuta, data} = req.body;

    const invio = {
        "utente": utente,
        "valuta": valuta,
        "data": data
    };

    client.eseguiList(invio, (err, res) => {
        //console.log(res["isTuttoOk"]);

        const lista = JSON.parse(res["listaTransizioni"]);
        //devo aggiungere +1 a tutti i giorni, perchè quando faccio la query al database, dà sempre un giorno in meno (non so perchè)
        for (let i = 0; i < lista.length; i++)
        {
            const vecchiaData = lista[i].data.slice(0, 10); //prendo il mese il giorno e l'anno della vecchia data
            let giorno = Number(vecchiaData.slice(8, 10));
            let mese = Number(vecchiaData.slice(5, 7));
            let anno = Number(vecchiaData.slice(0, 4));
            
            giorno = giorno + 1;
            //controllo sul giorno
            if (giorno == 32)
            {
                giorno = 1;
                mese = mese+1;
            }
            else if (giorno == 31 && (mese == 11 || mese == 4 || mese == 6 || mese == 9)) //mesi da 30 giorni
            {
                giorno = 1;
                mese = mese+1;
            }
            else if (giorno == 30 && mese == 2) //febbraio
            {
                giorno = 1;
                mese = 3;
            }
            else if (giorno == 29 && mese == 2 && anno%4 != 0) //febbraio bisestile
            {
                giorno = 1;
                mese = 3;;
            }
            //controllo sul mese
            if (mese == 13)
            {
                mese = 1;
                anno = anno+1;
            }
            //compongo la data (con gli zeri)
            let nuovaData = anno+'-';
            if (mese < 10)
                nuovaData = nuovaData + '0'+mese+'-';
            else
                nuovaData = nuovaData +mese+'-';
            if (giorno < 10)
                nuovaData = nuovaData + '0'+giorno;
            else
                nuovaData = nuovaData +giorno;

            lista[i].data = nuovaData;
        }
        res["listaTransizioni"] = JSON.stringify(lista);

        response.status(200).json(JSON.stringify(res)); //rimando al client
    });
}

export = listTransactions;