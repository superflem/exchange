require('typescript-require');

function withdraw(call, callback)
{
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
        risposta["messaggio"] = 'Il valore è negativo';
        callback(null, risposta);
    }

    const queryControllo = 'SELECT '+valuta+' AS soldi FROM utente WHERE id_utente = '+utente+';';

    //prima controllo che la somma da depositare sia inferiore dalla somma presente nel database
    db.query(queryControllo, (err, res) => {
        if (err) //controllo che non ci siano errori nella query
        {
            risposta["messaggio"] = err.message;
            callback(null, risposta);
        }
        else
        {
            if (res.rows.length == 0) //controllo che l'utente sia presente
            {
                risposta["messaggio"] = "utente non trovato";
                callback(null, risposta);
            }
            else
            {
                const vecchioConto = res.rows[0].soldi;
                if (valore > vecchioConto)  //controllo di avere abbastanza soldi
                {
                    risposta["messaggio"] = 'Hai meno soldi di quelli che vorresti depositare';
                    callback(null, risposta);
                }
                else //se ho abbastanza soldi, calcolo il nuovo valore e aggiorno il database
                {
                    const nuovoConto = vecchioConto - valore;
                    const queryModifica = 'UPDATE utente SET '+valuta+' = '+nuovoConto.toFixed(2)+' WHERE id_utente = '+utente+';';
                    db.query(queryModifica, (err, res) => {
                        if (err) //controllo gli errori nella query
                        {
                            risposta["messaggio"] = err.message;
                            callback(null, risposta);
                        }
                        else //tutto ok
                        {
                            risposta["messaggio"] = 'Deposito avvenuto con successo';
                            risposta["isTuttoOk"] = true;
                            callback(null, risposta);
                        }
                    });
                }
            }
        }
    });
}
export = withdraw;