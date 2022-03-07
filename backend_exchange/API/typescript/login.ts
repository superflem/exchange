require('typescript-require');

//GRPC
//come per il server, deve conoscere il pacchetto e i servizi
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("./proto/comunicazione.proto", {}); //gli passo il file proto per la comunicazione
const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
const comunicazionePackage = grpcObject.comunicazionePackage;

const client = new comunicazionePackage.ComunicazioneServer("localhost:9001", grpc.credentials.createInsecure()); //dico al client cn quale package devo comunicare e dove è il server

function login (req, response) 
{
    //ricevo lamail e la password  
    const email = req.body.email;
    const password = req.body.password; 
    
    const invio = { //creo l'oggeto json da inviare al server
        "email": email,
        "password": password
    }
    client.eseguiLogin(invio, (err, res) => {
        //tokenValidi.push(res["token"]); //inserisco il nuovo token nell'array dei token validi

        if (res["isTuttoOk"]) //se è tutto ok setto il cookie
        {
            response.cookie('jwt', '"'+res["token"]+'"', {httpOnly: true, maxAge: 900000, secure: true, sameSite: "none"}); //setto il cookie del jwt per 15 minuti
            response.cookie('utente', '"'+res["utente"]+'"', {httpOnly: true, maxAge: 900000, secure: true, sameSite: "none"});
        }

        response.status(200).json(JSON.stringify(res)); //rimando al client
    });
}

export = login;