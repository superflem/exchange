import '../css/Soldi.css';

const Soldi = (props) => {
    const euro = props.euro; 
    const dollari = props.dollari;   
    return (
        <nav className="navbar">
            <div className="divLink">
                <label id="euro">{euro} €</label>
                <label id="dollari">{dollari} $</label>
            </div>
        </nav>
    );

}
 
export default Soldi;