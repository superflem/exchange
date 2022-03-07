require('typescript-require');

function eseguiSignup (call, callback)
{
    const db = require('./database.js');

    const email = call.request["email"];
    const password = call.request["password"];
    const nome = call.request["nome"];
    const cognome = call.request["cognome"];
    const iban = call.request["iban"];

    const query = "INSERT INTO utente VALUES (DEFAULT, '"+nome+"', '"+cognome+"', '"+email+"', '"+password+"', '"+iban+"', 0, 0);"; //preparo la query di inserimento

    const risposta = {
        "isTuttoOk": false,
        "messaggio": "errore nel database" 
    }

    db.query(query, (err, res) => { //eseguo la query di inserimento
        if (err) //se ce qualche errore lo comunico
            risposta["messaggio"] = err.message;
        else //se è tutto ok
        {
            risposta["messaggio"] = 'Inserito correttamente';
            risposta["isTuttoOk"] = true;
        }
        callback(null, risposta);
    });
}

export = eseguiSignup;