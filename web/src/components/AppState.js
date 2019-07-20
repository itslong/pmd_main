import React, { Component, createContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import NavBar from './NavBar';
import { LoginForm } from './Auth';
import { Button, Dialog } from './common';
import { IsAuthContext, UserContext } from './AppContext';
import { HOME_PATH } from './frontendBaseRoutes';


class AppState extends Component {
  constructor(props) {
    super(props);

    const isAuth = localStorage.getItem('token') ? true : false;
    const getUsername = localStorage.getItem('user') ? localStorage.getItem('user') : undefined;

    this.state = {
      isAuthenticated: isAuth,
      username: getUsername,
      displayDialog: false,
    };

    this.updateAuthStateFromLoginForm = this.updateAuthStateFromLoginForm.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateAuthStateWhenTokenExpires = this.updateAuthStateWhenTokenExpires.bind(this);
    this.closeDialogAndRouteToLogin = this.closeDialogAndRouteToLogin.bind(this);
  }

  updateAuthStateFromLoginForm(authObj) {
    const { token, username } = authObj;
    if (token) {
      localStorage.setItem('token', token);
      
      if (username) {
        localStorage.setItem('user', username)
      }

      this.setState({
        isAuthenticated: true,
        username,
      }, () => {
        this.props.history.push(HOME_PATH);
        // return (<Redirect to={'/web/home'} />)
      });
    }
  }

  updateAuthStateWhenTokenExpires() {
    this.setState({
      displayDialog: true
    });
  }

  closeDialogAndRouteToLogin() {
    this.setState({
      displayDialog: false,
    }, () => {
      this.handleLogout();
    });
  }

  handleLogout() {
    // localStorage.removeItem('token');
    localStorage.clear();
    this.setState({
      isAuthenticated: false,
      username: '',
    });
  }


  render() {
    const { isAuthenticated, username, displayDialog } = this.state;
    const isAuthContextValues = {
      localAuthState: isAuthenticated,
      updateAuth: this.updateAuthStateWhenTokenExpires,
    };

    const loadRoutes = isAuthenticated ?
      <IsAuthContext.Provider value={isAuthContextValues}>
        <UserContext.Provider value={username}>
          <NavBar
            handleLogout={this.handleLogout}
          />
          <div className='container'>
            <MainRoutes />
          </div>
        </UserContext.Provider>
      </IsAuthContext.Provider>
    : <LoginForm updateAuthState={this.updateAuthStateFromLoginForm} />;

    const showExpiredDialog = isAuthenticated && displayDialog ?
      <Dialog
        dialogText={'Your session has expired. Please log in again.'}
        handleCloseDialog={this.closeDialogAndRouteToLogin}
      />
      : '';

    return (
      <div>
        {loadRoutes}
        {showExpiredDialog}
      </div>
    )
  }
}

export default withRouter(AppState);
