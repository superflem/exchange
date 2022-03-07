import '../css/Home.css';

const Home = (props) => {
    const nome = props.nome;

    //const nome = "Alex";
    return (
        <div className="divHome">
            <h1>Benvenuto</h1>
            <h2>{nome}</h2>

            
        </div> 
        


     );
}
 
export default Home;