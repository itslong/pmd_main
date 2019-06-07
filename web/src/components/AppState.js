import React, { Component, createContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import NavBar from './NavBar';
import { LoginForm } from './Auth';
import { Button } from './common';
import { IsAuthContext } from './AppContext';
import { HOME_PATH } from './frontendBaseRoutes';


class AppState extends Component {
  constructor(props) {
    super(props);

    const isAuth = localStorage.getItem('token') ? true : false;

    this.state = {
      isAuthenticated: isAuth,
    };

    this.updateAuthState = this.updateAuthState.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  updateAuthState(authObj) {
    const { token, isAdmin } = authObj;
    if (token) {
      localStorage.setItem('token', token);

      this.setState({
        isAuthenticated: true,
      }, () => {
        this.props.history.push(HOME_PATH);
        // return (<Redirect to={'/web/home'} />)
      });
    }
  }

  handleLogout() {
    localStorage.removeItem('token');
    this.setState({
      isAuthenticated: false,
    });
  }


  render() {
    const { isAuthenticated } = this.state;


    const loadRoutes = isAuthenticated ?
        <IsAuthContext.Provider value={isAuthenticated}>
          <NavBar 
            handleLogout={this.handleLogout}
          />
          <MainRoutes />
        </IsAuthContext.Provider>
      : <LoginForm updateAuthState={this.updateAuthState} />;

    // const loadingModal = isLoading ?
    //   <Modal 
    //   /> : '';

    return (
      <div>
        {loadRoutes}
      </div>
    )
  }
}

export default withRouter(AppState);
