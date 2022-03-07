require('typescript-require');

const express = require ('express');
const cookieParser = require('cookie-parser'); //permette di leggere i cookie
const jwt = require('jsonwebtoken'); //JWT (qua faccio la verifica dei token)
const cors = require('cors');

const app = express(); //creo l'applicativo di express

app.use(cookieParser()); //uso i cookie

const corsOption = {
    origin: "http://localhost:3000",
    credentials: true
};
app.use(cors(corsOption)); //dico che va bene quello che arriva da qualsiasi parte

const bodyParser = require('body-parser') //per parsare il body
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//GRPC
//come per il server, deve conoscere il pacchetto e i servizi
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("./proto/comunicazione.proto", {}); //gli passo il file proto per la comunicazione
const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
const comunicazionePackage = grpcObject.comunicazionePackage;

const client = new comunicazionePackage.ComunicazioneServer("localhost:9001", grpc.credentials.createInsecure()); //dico al client cn quale package devo comunicare e dove è il server

app.listen(80); //le api stanno in ascolto sulla porta 80


//LOGIN
app.post('/login', require('./login.js'));

//DEPOSITO
app.post('/deposit', require('./verifica.js'), require('./deposit.js'));

//WITHDRAW
app.post('/withdraw', require('./verifica.js'), require('./withdraw.js'));

//QUERY
app.post('/query', require('./verifica.js'), require('./query.js'));

//SIGNUP
app.post('/signup', require('./signup.js'));

//BUY
app.post('/buy', require('./verifica.js'), require('./buy.js'));

//LIST TRANSACTIONS
app.post('/listTransactions', require('./verifica.js'), require('./listTransactions.js'))
/*
app.post('/listTransactions', require('./verifica.js'), (req, res) => {
    const {utente, valuta, data} = req.body;

    const invio = {
        "utente": utente,
        "valuta": valuta,
        "data": data
    };

    client.eseguiList(invio, (err, res) => {
        console.log(res["messaggio"]);

        //traduco da stringa a json se non ci sono errori
        if (res["isTuttoOk"])
        {
            
            //const oggettoJson = JSON.parse(res["listaTransizioni"]);
            //console.log(oggettoJson[0]["quantita_spesa"]);
           console.log(JSON.parse(res["listaTransizioni"]));
        }
    });
});
*/

//LOGOUT
app.post("/logout", require('./logout.js'));

//VISUALIZZO I COOKIE
app.get("/ciaoo", (req, res) => {
    console.log(req.cookies["jwt"]+" "+req.cookies["utente"]);
    res.json(req.cookies["jwt"]+" "+req.cookies["utente"]);
});


