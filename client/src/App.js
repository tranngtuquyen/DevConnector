import React, {Component} from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import './App.css';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Landing from './components/Layout/Landing';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { SET_CURRENT_USER } from './actions/types';
import { logoutUser } from './actions/authActions';

//Check for token
if (localStorage.jwtToken) {
  
  //Set auth header with the token
  setAuthToken(localStorage.jwtToken);
  //Decode token
  const decoded = jwt_decode(localStorage.jwtToken);
  //Write user data to redux store
  store.dispatch({
    type: SET_CURRENT_USER,
    payload: decoded
  });

  //Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser);
    window.location.href='/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login}/>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
