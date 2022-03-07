require('typescript-require');

//GRPC
//come per il server, deve conoscere il pacchetto e i servizi
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("./proto/comunicazione.proto", {}); //gli passo il file proto per la comunicazione
const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
const comunicazionePackage = grpcObject.comunicazionePackage;

const client = new comunicazionePackage.ComunicazioneServer("localhost:9001", grpc.credentials.createInsecure());

function signup (req, response)
{
    const {email, password, nome, cognome, iban} = req.body;

    const invio = {
        "email": email,
        "password": password,
        "nome": nome,
        "cognome": cognome,
        "iban": iban
    };

    client.eseguiSignup(invio, (err, res) => {
        //console.log(res["messaggio"]);
        response.status(200).json(JSON.stringify(res));
    });
}

export = signup;