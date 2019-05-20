import React, { Component, createContext } from 'react';
import { Redirect, withRouter } from 'react-router-dom';

import MainRoutes from './MainRoutes';
import NavBar from './NavBar';
import { LoginForm, SignupForm } from './Auth';
import { Button } from './common';
import { LoginUser } from './endpoints';
import { IsAdminContext } from './AppContext';
import { BASE_PATH, HOME_PATH } from './frontendBaseRoutes';


class AppState extends Component {
  constructor(props) {
    super(props);

    const isAuth = localStorage.getItem('token') ? true : false;

    this.state = {
      isAuthenticated: isAuth,
      isAdmin: false,
      username: '',
      isLoading: true
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
  }

  handleSubmit(formData, submitType) {
    // TODO: allow new user registration by admins only.
    const submit = submitType === 'login' ? LoginUser(formData) : '';
    submit.then(data => {
      localStorage.setItem('token', data.token);

      this.setState({
        isAuthenticated: true,
        isLoading: false,
        username: data.user.username,
        isAdmin: data.user.is_staff
      });
    })
    .then(() => {
      this.props.history.push(HOME_PATH);
    })
  }

  handleLogout() {
    localStorage.removeItem('token');

    this.setState({
      isAuthenticated: false,
      isAdmin: false,
      username: '',
    });
  }

  toggleAdmin() {
    this.setState({
      isAdmin: !this.state.isAdmin
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

    const { pathname } = this.props.location;
    const currentPathComponent = (pathname.toString()).includes('login') ?
      <LoginForm submitForm={this.handleSubmit} />
      : <SignupForm />;


    const loadRoutes = isAuthenticated ?
      <IsAdminContext.Provider value={isAdmin}>
        <NavBar handleLogout={this.handleLogout} />
        <MainRoutes />
      </IsAdminContext.Provider>
      : currentPathComponent;

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
