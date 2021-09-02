import { Fragment, useEffect } from 'react';
import  Navbar  from './components/layouts/Navbar';
import  Landing  from './components/layouts/Landing';
import Register from './components/auth/Register';
import  Login  from './components/auth/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Alert from './components/layouts/Alert';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import setAuthToken from './utils/setAuthToken';
import { loadUser } from './actions/auth';
import CreateProfile from './components/layouts/profile-form/createProfile';
import EditProfile from './components/layouts/profile-form/editProfile';
import AddExperience from './components/layouts/profile-form/addExperience';
import AddEducation from './components/layouts/profile-form/addEducation';
import Profiles from './components/profiles/Profiles';
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
              <Route exact path='/profiles' component={Profiles} />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/create-profile' component={CreateProfile} />
              <PrivateRoute exact path='/edit-profile' component={EditProfile} />
              <PrivateRoute exact path='/add-experience' component={AddExperience} />
              <PrivateRoute exact path='/add-education' component={AddEducation} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
      
  )
}

export default App;
