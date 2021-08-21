import { Fragment, useEffect } from 'react';
import  Navbar  from './components/layouts/Navbar';
import { Landing } from './components/layouts/Landing';
import Register from './components/auth/Register';
import  Login  from './components/auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Alert from './components/layouts/Alert';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import './App.css';

//redux
import { Provider } from 'react-redux';
import store from './store';


if(localStorage.token){
  setAuthToken(localStorage.token)
}


const App = () =>{

  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return(
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path="/" component = {Landing} />
          <section className='container'>
            <Alert/>
            <Switch>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
      
  )
}

export default App;
