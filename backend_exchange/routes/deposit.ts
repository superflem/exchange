require('typescript-require');

function deposit(call, callback) {
    const db = require('./database.js');

    const risposta = {
        "isTuttoOk": false,
        "messaggio": 'errore sconosciuto' 
    };

    const valore = call.request["valore"];
    const utente = call.request["utente"];
    let simbolo = call.request["simbolo"];
    let valuta:string;

    //controllo la valuta
    if (simbolo == 'EUR')
        valuta = 'euro';
    else if (simbolo == 'USD')
        valuta = 'dollari';
    else
    {
        //console.log('Valuta errata');
        risposta["messaggio"] = 'valuta errata';
        callback(null, risposta);
    }

    //controllo che il valore non sia negativo
    if (valore <= 0)
    {
        //console.log('Il valore è negativo')
        risposta["messaggio"] = 'Il valore è negativo';
        callback(null, risposta);
    }

    //faccio questa query per capire quanti soldi ho nel conto
    const queryVecchio = 'SELECT '+valuta+' AS soldi FROM utente WHERE id_utente = '+utente+';';

    db.query(queryVecchio, (err, res) => {
        if (err) //controllo gli errori nella prima select
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
            }
            else
            {
                //aggiungo il valore appena trovato con quello in input
                const vecchio = res.rows[0].soldi;
                const nuovo = vecchio+valore;
                const queryAggiorna = 'UPDATE utente SET '+valuta+' = '+nuovo.toFixed(2)+' WHERE id_utente = '+utente+';';

                db.query(queryAggiorna, (err, res) => {
                    if (err)
                    {
                        risposta["messaggio"] = err.message;
                        callback(null, risposta);
                    }
                    else
                    {
                        risposta["messaggio"] = "conto caricato con successo";
                        risposta["isTuttoOk"] = true;
                        callback(null, risposta);
                    }
                });
            }
        }
    });
}

export = deposit;