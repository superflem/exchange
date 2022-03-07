import '../css/App.css';
import Login from './Login';
import Signup from './Signup';
import Navbar from './Navbar';
import Loggato from './Loggato'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'; //servono per andare in diverse pagine

function App() {
  
  return (
    <Router>
      <div className="App">
        

        <Switch>
          <Route exact path='/'>
            <Navbar />
            <Login />
          </Route>

          <Route exact path='/signup'>
            <Navbar />
            <Signup />
          </Route>

          <Route path='*'>  {/* una qualsiasi altra pagina*/}
              <Loggato />
          </Route>

          

        </Switch>
      
      </div>
    </Router>
      
  );
}

export default App;
