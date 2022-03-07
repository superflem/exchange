import { sha3_512 } from 'js-sha3';
import { useRef } from 'react';
import '../css/Form.css';
import axios from 'axios';
axios.defaults.withCredentials = true;

const Signup = () => {

    const emailInput = useRef();
    const nomeInput = useRef();
    const cognomeInput = useRef();
    const ibanInput = useRef();
    const passwordInput = useRef();
    const password2Input = useRef();

    const handleLoginForm = async (e) =>
    {
        e.preventDefault(); //evita di ricaricare la pagina
        const url = "http://localhost:80/signup";

        const email = emailInput.current.value;
        const nome = nomeInput.current.value;
        const cognome = cognomeInput.current.value;
        const iban = ibanInput.current.value;
        const password2 = password2Input.current.value;
        let password = passwordInput.current.value;

        if (password != password2)
        {
            alert("le due password devono essere uguali");
        }

        password = sha3_512(password); //cifro la password

        const corpo = {
            nome: nome,
            cognome: cognome,
            iban: iban,
            email: email, 
            password: password, 
            withCredentials: true
        }; //creo l'oggetto json da inviare al server

        const risposta = await axios.post(url, corpo);
        const oggetto = JSON.parse(risposta.data);

        //alert(oggetto["messaggio"].search("utente_email_key"));
        //alert(oggetto["messaggio"].search("negro"));
        if (!oggetto["isTuttoOk"])
        {
            if (oggetto["messaggio"].search("utente_email_key") != -1)
            {
                alert("questa email è già usata");
            }
            else if (oggetto["messaggio"].search("utente_iban_key") != -1)
            {
                alert("questo IBAN è già usato");
            }
            else
            {
                alert(oggetto["messaggio"]);
            }
        }
        else
        {
            alert(oggetto["messaggio"]);
            const link = window.location.href.replace('/signup', ''); //rimando alla pagina principale di login
            window.location.replace(link);
        }


    }

    return ( 
        <div className="divSignup">
            <h1>Signup</h1>
            <form onSubmit = {handleLoginForm}>
                <input className='testo' type='text' id='nome' name='nome' placeholder='Nome' ref={nomeInput} required /> <br /><br />
                <input className='testo' type='text' id='cognome' name='cognome' placeholder='Cognome' ref={cognomeInput} required /> <br /><br />
                <input className='testo' type='email' id='email' name='email' placeholder='Email' ref={emailInput} required /><br /><br />
                <input className='testo' type='password' id='password' name='password' minLength={Number('8')} placeholder='Password' ref={passwordInput} required /> <br /><br />
                <input className='testo' type='password' id='password2' name='password2' minLength={Number('8')} placeholder='Reinserisci la password' ref={password2Input} required /> <br /><br />
                <input className='testo' type='text' id='iban' name='iban' maxLength={Number('27')} minLength={Number('27')} placeholder='IBAN (senza spazi)' ref={ibanInput} required /> <br /><br />

                <button id='bottone' type='submit'> Invia</button>
            </form>
        </div>
    );
}
 
export default Signup;