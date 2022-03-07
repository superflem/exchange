require('typescript-require');
const express = require ('express');
const app = express();
const db = require('./database.js');



//GRPC
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const { promisify } = require("util"); //NON CE NEL VIDEO

const packageDef = protoLoader.loadSync("./proto/comunicazione.proto", {}); //gli passo il file proto per la comunicazione
const grpcObject = grpc.loadPackageDefinition(packageDef); //carico il package come oggetto
const comunicazionePackage = grpcObject.comunicazionePackage;


const server = new grpc.Server(); //crea il server
server.bindAsync = promisify(server.bindAsync); //lo fa asincrono (NON CE NEL VIDEO)


server.bindAsync("0.0.0.0:9001", grpc.ServerCredentials.createInsecure()) //ascolta tutto (0.0.0.0) sulla porta 40000. creo un server insicuro.
.then( () => {  // Di default http2 vuole delle credenziali, cosi facciamo senza
    //cosa faccio una volta creato il server

    server.addService(comunicazionePackage.ComunicazioneServer.service, { //aggiungo il servizio ComunicazioneServer del package comunicazionePackage al server
        "eseguiLogin": require('./login.js'),
        "eseguiDeposito": require('./deposit.js'),
        "eseguiWithdraw": require('./withdraw.js'),
        "eseguiQuery": require('./query.js'),
        "eseguiSignup": require('./signup.js'),
        "eseguiBuy": require('./buy.js'),
        "eseguiList": require('./listTransactions.js')
    }); //quello sopra è un oggetto json. il parametro tra virgolette è rpc del file proto, metre il secondo è la funzione qui sotto
    server.start() //faccio partire il server

    console.log("server in ascolto sulla porta 9001");

}).catch(console.log) ; 


/*
function eseguiLogin(call, callback)
{
    const email = call.request["email"];
    const password = call.request["password"];
    
    //login(string email, string password)
    const login = require('./login.js');
    app.use(login);
    
}
*/
/*
app.listen(9001); //i servizi degli utenti stanno sulla porta 9001

// signup(string email, string password, string name, string iban)
const signup = require('./signup.js');
app.use(signup);

// withdraw(number value, string symbol)  EUR o USD
const withdraw = require('./withdraw.js');
app.use(withdraw);

// deposit(nubmer value, string symbol)
const deposit = require('./deposit.js');
app.use(deposit);

// listTransactions(object filter)
const listTransactions = require('./listTransactions.js');
app.use(listTransactions);

//buy(number value, string symbol)
const buy = require('./buy.js');
app.use(buy);

//login(string email, string password)
const login = require('./login.js');
app.use(login);

//query
const query = require('./query.js');
app.use(query);
*/