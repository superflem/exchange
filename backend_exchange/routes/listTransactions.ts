require('typescript-require');

function eseguiList (call, callback)
{
    const db = require('./database.js');
    
    const utente = call.request["utente"];
    const valuta = call.request["valuta"];
    const data = call.request["data"];

    const risposta = {
        "isTuttoOk": false,
        "messaggio": "",
        "listaTransizioni": ""
    }

    let query:string;
    query = 'SELECT quantita_spesa, quantita_comprata, valuta_comprata, data FROM transizione WHERE fk_utente = '+utente;

    if (valuta)  //filtro per valuta (se c'è)
    {
        if (valuta != 'USD' && valuta != 'EUR')
        {
            risposta["messaggio"] = 'Valuta sbagliata';
            callback(null, risposta);
            return;
        }
        else
            query = query + " AND valuta_comprata = '"+valuta+"'";
    }

    if (data) //filtro per data (se c'è)
    {
        if (controllaData(data))
            query = query + " AND data = '"+data+"'";
        else
        {
            risposta["messaggio"] = "la data non è in un formato accettabile (aaaa-mm-gg) o è inesistente";
            callback(null, risposta);
            return;
        }
    }

    const queryUtente = "SELECT * FROM utente WHERE id_utente = "+utente+";"; //faccio questa query per evitare che l'utente non esista
    db.query(queryUtente, (err, res) => {
        if (err) //errore nella query
        {
            risposta["messaggio"] = err.message;
            callback(null, risposta);
        }
        else
        {
            if (res.rows.length == 0)
            {
                risposta["messaggio"] = "utente non trovato";
                callback(null, risposta);
            }
            else
            {
                db.query(query, (err, res) =>{
                    if (err) //errore nella query
                    {
                        risposta["messaggio"] = err.message;
                        callback(null, risposta);
                    }
                    else
                    {   
                        if (res.rows.length == 0) //se non ci sono transizioni
                        {
                            risposta["messaggio"] = "non ci sono articoli";
                        }
                        else
                        {
                            risposta["messaggio"] = "tutto ok";
                        }
                        risposta["isTuttoOk"] = true;
            
                        risposta["listaTransizioni"] = JSON.stringify(res.rows);
                        callback(null, risposta);
                    }
                });
            }
        }
    });
}


function controllaData(data:string):boolean
{
    if (data.length != 10)
        return false; //dimensione non giusta
    
    const anno = data.split('-')[0];
    const mese = data.split('-')[1];
    const giorno = data.split('-')[2];

    if (anno.length != 4)
        return false; //anno scritto non nel modo corretto
    
    if (mese.length != 2)
        return false; //mese scritto non nel modo corretto
    else if (Number(mese) > 12 || Number(mese) <= 0)
        return false; //non esiste il mese

    if (giorno.length != 2)
        return false; //giorno scritto non nel modo corretto
    else if (Number(giorno) > 31 || Number(giorno) <= 0)
        return false; //non esiste il giorno
    
    //controllo sulle date
    if (mese == '02' && (giorno == '30' || giorno == '31'))
        return false; //30 e 31 febbraio non esistono
    
    if (giorno == '31' && (mese == '11' || mese == '04' || mese == '06' || mese == '09'))
        return false; //31 nei mesi che non hanno 31 giorni

    
    if (giorno == '29' && mese == '02') //controllo il 29 febbraio
    {
        if (Number(anno)%4 == 1)
            return false;
    }

    return true; //in tutti gli altri casi va bene
}

export = eseguiList;