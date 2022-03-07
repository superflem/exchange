import '../css/Form.css';
import axios from 'axios';
const Deposito = () => {

    const handleLoginForm = async (e) =>
    {
        //alert(e.target.valore.value+" "+e.target.valuta.value);
        e.preventDefault(); //evita di ricaricare la pagina
        const url = "http://localhost:80/deposit";

        const valore = e.target.valore.value;
        const valuta = e.target.valuta.value;

        const corpo = {
            valore: valore,
            valuta: valuta
        };

        const risposta = await axios.post(url, corpo);
        const oggetto = JSON.parse(risposta.data);

        if (oggetto["ridirezione"])
        {
            window.location.href = 'http://localhost:3000/';
        }
        else
        {
            alert (oggetto["messaggio"]);
            if (oggetto["isTuttoOk"])
            {
                window.location.href = 'http://localhost:3000/home';
            }
        }
    }

    return (
        <div className="divForm">
            <h1>Carica Il Tuo Saldo</h1>

            <form id = "form" onSubmit = {handleLoginForm}>
                <input className='testo' type='number' id='valore' name='valore' placeholder='Valore da caricare' min='1' step="0.01" required /> <br /> <br />
                
                <select id="valuta" name="valuta" form='form'>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select> <br /> <br />
                <input id='bottoneInterno' type='submit'/>
            </form>

            
        </div> 
        


     );
}
 
export default Deposito;