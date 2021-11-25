import './App.css';
import HomePage from './pages/homepage/homepage.component';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component'
import {auth, createUserProfileDocument} from './firebase/firebase.utils'
import React from 'react';
import {connect} from 'react-redux';
import {setCurrentUser} from './redux/user/user.actions'



class App extends React.Component {
  unsubscribeFromAuth = null;

  componentDidMount() {
    const {setCurrentUser} = this.props;
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        userRef.onSnapshot(snapShot => {
            setCurrentUser({           
              id: snapShot.id,
              ...snapShot.data()        
           });
           console.log(this.state);
        });
      }
      else {
        setCurrentUser(userAuth);
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeFromAuth();
  }


  render() {
    return (   
      <BrowserRouter>
        <Header/>
        <Switch>         
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />         
          <Route path='/signin' component={SignInAndSignUp} />         
        </Switch>
      </BrowserRouter>      
    )  
  } 
}

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user)) 
})

export default connect(null, mapDispatchToProps)(App);
