require('typescript-require');

require('dotenv').config({ path: __dirname+'/./../.env'});
function eseguiLogin(call, callback)
{
    const db = require('./database.js');
    const jwt = require('jsonwebtoken'); //JWT

    //ricevo email e password
    const email = call.request["email"]; 
    const password = call.request["password"];
    
    const risposta = { //creo l'oggetto di risposta
        "isTuttoOk": false,
        "token": 'Errore sconosciuto',
        "utente": -1,
        "nome": ""
    };

    const query = "SELECT * FROM utente WHERE email = '"+email+"' AND password = '"+password+"'";
    db.query(query, (err, res) => { //eseguo la query di ricerca
        if (err) //se c'è un errore nella query
        {
            risposta["token"] = err.message;
        }
        else
        {
            if (res.rows.length == 0) //se la lunghezza dei risultati è 0, vuol dire che non ho trovato una corrispondenza email password
            {
                risposta["token"] = 'Email o password errati';
            }
            else //se trovo l'utente lo loggo
            {
                const accessToken = jwt.sign({id:res.rows.id_utente}, process.env.SEGRETA, {expiresIn: "15m"}); //creo il token con la chiave "chiaveSegreta" che rimane valido per 15 min

                risposta["isTuttoOk"] = true;
                risposta["token"] = accessToken;
                risposta["utente"] = res.rows[0].id_utente;
                risposta["nome"] = res.rows[0].nome;
            }
        }
        callback(null, risposta);
    });

    
}

export = eseguiLogin;