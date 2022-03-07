require('typescript-require');

function eseguiBuy (call, callback)
{
    const db = require('./database.js'); //database
    
    //inizializzo come se fosse un client grpc
    const grpc = require("@grpc/grpc-js");
    const protoLoader = require("@grpc/proto-loader");
    const packageDef = protoLoader.loadSync("proto/valuta.proto", {}); //gli passo il file proto per la comunicazione
    const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
    const convertiPackage = grpcObject.convertiPackage;

    const client = new convertiPackage.ScambioValuta("localhost:9000", grpc.credentials.createInsecure()); //dico al client con quale package devo comunicare e dove è il server

    //prendo le variabili dalle api
    const utente = call.request["utente"];
    const quantita_spesa = call.request["quantitaSpesa"];
    const valuta = call.request["valuta"];

    const risposta = {
        "isTuttoOk": false,
        "messaggio": 'Errore sconosciuto'
    };

    //dichiaro le altre variabili
    let valutaStringa:string;
    let valuta_comprata:string;
    let valuta_comprataStringa:string;

    //controllo sulla valuta
    if (valuta == 'USD')
    {
        valuta_comprata = 'EUR';
        valuta_comprataStringa = 'euro';
        valutaStringa = 'dollari';
    }
    else if (valuta == 'EUR')
    {
        valuta_comprata = 'USD';
        valuta_comprataStringa = 'dollari';
        valutaStringa = 'euro';
    }
    else //valuta sbagliata
    {
        risposta["messaggio"] = 'errore nella valuta';
        callback(null, risposta);
        return;
    }

    // controllo sulla quantita
    if (quantita_spesa <= 0)
    {
        risposta["messaggio"] = 'errore nella quantità';
        callback(null, risposta);
        return;
    }

    
    const queryControllo = 'SELECT '+valutaStringa+' AS soldi FROM utente WHERE id_utente = '+utente+";";

    db.query(queryControllo, (err, res) => { //controllo di avere abbastanza soldi
        if (err)
        {
            risposta["messaggio"] = err.message;
            callback(null, risposta);
        }
        else
        {
            if (res.rows.length == 0) //controllo di aver trovato l'utente
            {
                risposta["messaggio"] = "utente non trovato";
                callback(null, risposta);
                return;
            }

            if (quantita_spesa > res.rows[0].soldi) //controllo sui soldi
            {
                risposta["messaggio"] = "non hai abbastanza soldi";
                callback(null, risposta);
            }
            else
            {
                const soldiIniziali = res.rows[0].soldi;
                const soldiFinali = soldiIniziali - quantita_spesa;

                //INTERROGO IL SERVIZIO PER IL CAMBIO
                
                const input = { //creo l'oggetto json da inviare al server
                    'from': valuta,
                    'to': valuta_comprata,
                    'quantitaSpesa': quantita_spesa.toFixed(2)
                }

                client.converti(input, (err, res) => { //comunico al server di fare il cambio
                    if (err) //errore nella comunicazione nel server di scambio
                    {
                        risposta["messaggio"] = err.message;
                        callback(null, risposta);
                    }
                    else
                    {
                        //se non ricevo errori, ottengo il valore cambiato di valuta e continuo con le interrogazioni al database
                        const quantita_comprata = Number(res['quantitaComprata'].toFixed(2));

                        const queryComprata = 'SELECT '+valuta_comprataStringa+' AS soldi FROM utente WHERE id_utente = '+utente+";";
                        db.query(queryComprata, (err, res) => { //guardo quanti soldi dell'altra valuta ho
                            if (err) // errore nella query per trovare i soldi che si hanno gia
                            {
                                risposta["messaggio"] = err.message;
                                callback(null, risposta);
                            }
                            else
                            {
                                const vecchiComprati = res.rows[0].soldi;
                                const soldiFinaliComprati = vecchiComprati + quantita_comprata;

                                let queryAggiornamento = 'UPDATE utente SET '+valutaStringa+' = '+soldiFinali.toFixed(2)+', '+valuta_comprataStringa+' = '+soldiFinaliComprati.toFixed(2);
                                queryAggiornamento = queryAggiornamento + ' WHERE id_utente = '+utente+";";

                                db.query(queryAggiornamento, (err, res) => { //aggiorno i valori nel database
                                    if (err) //errore nella query di aggiornamento
                                    {
                                        risposta["messaggio"] = err.message;
                                        callback(null, risposta);
                                    }
                                    else
                                    {
                                        const dataStringa = calcolaData(); //calcolo la data di oggi nel formato corretto
                                        let queryInserimento = "INSERT INTO transizione VALUES (default, "+utente+", "+quantita_spesa+", "+quantita_comprata+", '"+valuta_comprata+"', '";
                                        queryInserimento = queryInserimento + dataStringa + "');";

                                        db.query(queryInserimento, (err, res) => { //inserisco nella tabella transizione
                                            if (err) //errore nell'inserimento della query nelle transizione
                                            {
                                                risposta["messaggio"] = err.message;
                                                callback(null, risposta);
                                            }
                                            else
                                            {
                                                risposta["messaggio"] = "Cambio valuta effettuato con successo";
                                                risposta["isTuttoOk"] = true;
                                                callback(null, risposta);
                                            }
                                        });
                                    }
                                });
                            }

                        });
                    }
                });
            }
        }
    });
}

function calcolaData ()
{
    const data = new Date(); //calcolo la data e la metto nel formato corretto
    const anno = data.getFullYear();
    let mese:string;
    if (data.getMonth()+1 < 10) //metto lo 0 davanti se il mese è minore di 10
    {
        const mesee = data.getMonth()+1;
        mese = '0'+mesee;
    }
    else
    {
        const mesee = data.getMonth()+1;
        mese = ''+mesee;
    }

    let giorno:string;
    if (data.getDate() < 10)
    {
        giorno = '0'+data.getDate();
    }
    else
    {
        giorno = ''+data.getDate();
    }

    return anno+'-'+mese+'-'+giorno;
}

export = eseguiBuy;