import React, { Component, createContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import NavBar from './NavBar';
import { LoginForm } from './Auth';
import { Button } from './common';
import { IsAuthContext, UserContext } from './AppContext';
import { HOME_PATH } from './frontendBaseRoutes';


class AppState extends Component {
  constructor(props) {
    super(props);

    const isAuth = localStorage.getItem('token') ? true : false;
    const getUsername = localStorage.getItem('user') ? localStorage.getItem('user') : undefined;

    this.state = {
      isAuthenticated: isAuth,
      username: getUsername
    };

    this.updateAuthState = this.updateAuthState.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  updateAuthState(authObj) {
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

  handleLogout() {
    // localStorage.removeItem('token');
    localStorage.clear();
    this.setState({
      isAuthenticated: false,
      username: '',
    });
  }


  render() {
    const { isAuthenticated, username } = this.state;

    const loadRoutes = isAuthenticated ?
        <IsAuthContext.Provider value={isAuthenticated}>
          <UserContext.Provider value={username}>
            <NavBar
              handleLogout={this.handleLogout}
            />
            <div className='container'>
              <MainRoutes />
            </div>
          </UserContext.Provider>
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
