import {Link} from 'react-router-dom'; //se usi link invece di <a href> non passi per il server
import '../css/Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="divLink">
                <Link to='/' className='link'>Login</Link>
                <Link to='/signup' className='link'>Signup</Link>
            </div>
        </nav>
    );
}
 
export default Navbar
