import {Link} from 'react-router-dom'; //se usi link invece di <a href> non passi per il server
import '../css/NavbarLoggato.css';
import axios from 'axios';

const NavbarLoggato = () => {

    const logout = async (e) =>
    {
        const url = 'http://localhost:80/logout';
        const risposta = await axios.post(url);
        window.location.href = 'http://localhost:3000/';
    }
    return (
        <nav className="navbar">
            <div className="divLink">
                <Link to='/home' className='link'>Home</Link>
                <Link to='/deposit' className='link'>Carica</Link>
                <Link to='/withdraw' className='link'>Deposito</Link>
                <Link to='/buy' className='link'>Converti</Link>
                <Link to='/listTransactions' className='link'>Storico</Link>
                <Link to = '/' onClick={logout} className='link'>Logout</Link>
            </div>
        </nav>
    );
}
 
export default NavbarLoggato
