import React, { Component, createContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import NavBar from './NavBar';
import { LoginForm, SignupForm } from './Auth';
import { Button } from './common';
import { IsAdminContext, IsAuthContext } from './AppContext';
import { HOME_PATH } from './frontendBaseRoutes';


class AppState extends Component {
  constructor(props) {
    super(props);

    const isAuth = localStorage.getItem('token') ? true : false;
    // demo only
    const UserIsAdmin = localStorage.getItem('isAdmin') ? true : false;
    this.state = {
      isAuthenticated: isAuth,
      isAdmin: UserIsAdmin,
    };

    this.updateAuthState = this.updateAuthState.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
  }

  updateAuthState(authObj) {
    const { token, isAdmin } = authObj;
    if (token) {
      localStorage.setItem('token', token);
      // for demo only
      const adminStatus = isAdmin ? true : false;
      localStorage.setItem('isAdmin', adminStatus);

      this.setState({
        isAuthenticated: true,
        isAdmin,
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
      isAdmin: false,
    });
  }

  // demo only
  toggleAdmin() {
    this.setState({
      isAdmin: !this.state.isAdmin
    }, () => {
      if (!this.state.isAdmin) {
        localStorage.clear();
        this.props.history.push(HOME_PATH);
      }
    });
  }

  render() {
    const { isAuthenticated, isAdmin } = this.state;

    // demo: admin toggle
    const isAd = isAuthenticated ? `Are you admin?: ${isAdmin}.` : '';
    const toggleAdmin = isAuthenticated ?
      <Button
        action={this.toggleAdmin}
        title={'Toggle admin status.'}
      /> : '';

    const loadRoutes = isAuthenticated ?
      <IsAdminContext.Provider value={isAdmin}>
        <IsAuthContext.Provider value={isAuthenticated}>
          <NavBar 
            handleLogout={this.handleLogout}
          />
          <MainRoutes />
        </IsAuthContext.Provider>
      </IsAdminContext.Provider>
      : <LoginForm updateAuthState={this.updateAuthState} />;

    // const loadingModal = isLoading ?
    //   <Modal 
    //   /> : '';

    return (
      <div>
        {isAd} {toggleAdmin} <br />
        {loadRoutes}
      </div>
    )
  }
}

export default withRouter(AppState);
