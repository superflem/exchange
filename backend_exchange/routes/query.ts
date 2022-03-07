require('typescript-require');

function query (call, callback)
{
    const db = require('./database.js');
    const utente = call.request["utente"];

    const invio = {
        "isTuttoOk": false,
        "euro": 0,
        "dollari": 0,
        "messaggio": "errore inatteso",
        "nome": ""
    };

    const query = "SELECT dollari, euro, nome FROM utente WHERE id_utente = '"+utente+"';";

    db.query(query, (err, res) => {
        if (err) //controllo degli errori nella query
        {
            callback(null, invio);
        }
        else
        {
            if (res.rows.length == 0) //controllo di aver trovato l'utente
            {
                invio["messaggio"] = "utente non trovato";
                callback(null, invio);
            }
            else //se tutto ok
            {
                invio["euro"] = res.rows[0].euro.toFixed(2);
                invio["dollari"] = res.rows[0].dollari.toFixed(2);
                invio["nome"] = res.rows[0].nome;
                invio["isTuttoOk"] = true;
                invio["messaggio"] = "tutto ok";

                callback(null, invio);
            }
        }
    });
}

export = query;