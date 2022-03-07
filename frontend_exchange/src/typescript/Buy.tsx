import '../css/Form.css';
import {useState} from 'react';
import axios from 'axios';
const Buy = (props) => {

    const euro = props.euro;
    const dollari = props.dollari;
    const [max, setMax] = useState(dollari);

    const handleLoginForm = async (e) =>
    {
        e.preventDefault(); //evita di ricaricare la pagina
        const url = "http://localhost:80/buy";

        const quantita_spesa = e.target.valore.value;
        const valuta = e.target.valuta.value;

        const corpo = {
            quantita_spesa: quantita_spesa,
            valuta: valuta
        };

        const risposta = await axios.post(url, corpo);
        const oggetto = JSON.parse(risposta.data);

        if (oggetto["ridirezione"])
        {
            alert('Sessione scaduta');
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

    function cambiaMassimo(e) //cambio del massimo nella form in base alla valuta selezionata
    {
        if (e.target.value == 'EUR')
        {
            setMax(euro);
        }
        else
        {
            setMax(dollari);
        }
    }

    return (
        <div className="divForm">
            <h1>Converti Valuta</h1>

            <form id = "form" onSubmit = {handleLoginForm}>
                <input className='testo' type='number' id='valore' name='valore' placeholder="Valore da convertire nell'altra valuta" min='1' max={max} step="0.01" required/><br /><br />
                
                <select id="valuta" name="valuta" form='form' onChange={cambiaMassimo}>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select> <br /> <br />
                <input id='bottoneInterno' type='submit'/>
            </form>
        </div> 
     );
}
 
export default Buy;