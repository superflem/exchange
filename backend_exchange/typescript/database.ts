require('typescript-require');
require('dotenv').config({ path: __dirname+'/./../.env'}); //prendo le informazio del database nel file .env
const {Client} = require('pg');

const db = new Client ({
    host: "db",
    user: "docker",
    password: "giuseppe-28",
    database: "docker"
});



db.connect(err => {
    if (err)
        console.log(err);
    else // se non ci sono le tabelle, le creo
    {
        db.query("select * from utente", (err, res) => {
            if (err) //creo la tabella utente che non esiste
            {
                const crea = "CREATE TABLE utente \
                (\
                    id_utente SERIAL PRIMARY KEY NOT NULL,\
                    nome VARCHAR(50) NOT NULL,\
                    cognome VARCHAR(50) NOT NULL,\
                    email VARCHAR(60) UNIQUE NOT NULL,\
                    password CHAR(128) NOT NULL,\
                    iban char(27) UNIQUE NOT NULL,\
                    euro FLOAT NOT NULL,\
                    dollari FLOAT NOT NULL\
                )";
                db.query(crea, (err, res) => {
                    db.query("select * from transizione", (err, res) => {
                        if (err) //se non esiste la tabella transizione la creo
                        {
                            const crea = "CREATE TABLE transizione\
                            (\
                                id_transizione SERIAL PRIMARY KEY NOT NULL,\
                                fk_utente INT NOT NULL,\
                                quantita_spesa FLOAT NOT NULL,\
                                quantita_comprata FLOAT NOT NULL,\
                                valuta_comprata CHAR(3) NOT NULL,\
                                data DATE NOT NULL,\
                                FOREIGN KEY (fk_utente) REFERENCES utente\
                            )";
                            db.query(crea);
                        }
                    });
                });
            }
        });
    }
});


export = db;