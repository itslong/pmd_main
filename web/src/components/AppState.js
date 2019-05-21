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
    // demo only
    const UserIsAdmin = localStorage.getItem('isAdmin') ? true : false;
    this.state = {
      isAuthenticated: isAuth,
      isAdmin: UserIsAdmin,
      username: '',
      isLoading: false,
      errorMsg: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleAdmin = this.toggleAdmin.bind(this);
    this.validateFormData = this.validateFormData.bind(this);
  }

  handleSubmit(formData) {
    // TODO: allow new user registration by admins only.
    const submit = LoginUser(formData);
    submit.then(data => {
      const { non_field_errors } = data;

      if (non_field_errors) {
        return this.setState({
          errorMsg: 'Unable to log in with provided credentials.',
          isLoading: false
        });
      }

      localStorage.setItem('token', data.token);
      // for demo only
      const adminStatus = data.user.is_staff === true ? true : false;
      localStorage.setItem('isAdmin', adminStatus);

      this.setState({
        isAuthenticated: true,
        isLoading: false,
        username: data.user.username,
        isAdmin: adminStatus, //after demo, read from user object
        errorMsg: '',
      });
    })
    .then(() => {
      this.props.history.push(HOME_PATH);
    });
  }

  validateFormData(formData) {
    if (formData.username !== '' && formData.password !== '') {
      return this.setState({
        errorMsg: '',
        isLoading: true,
      }, () => {
        this.handleSubmit(formData);
      });
    }

    if (formData.username === '' && formData.password === '') {
      return this.setState({
        errorMsg: 'Username field and Password field may not be blank.'
      });
    }

    if (formData.username === '') {
      return this.setState({
        errorMsg: 'Username field may not be blank.'
      });
    }

    if (formData.password === '') {
      return this.setState({
        errorMsg: 'Password field may not be blank.'
      });
    }

  }

  handleLogout() {
    // localStorage.removeItem('token');
    localStorage.clear();
    this.setState({
      isAuthenticated: false,
      isAdmin: false,
      username: '',
    });
  }

  toggleAdmin() {
    this.setState({
      isAdmin: !this.state.isAdmin
    }, () => {
      if (!this.state.isAdmin) {
        this.props.history.push(HOME_PATH);
      }
    });
  }

  render() {
    const { isAuthenticated, isAdmin, errorMsg, isLoading } = this.state;

    // demo: admin toggle
    const isAd = isAuthenticated ? `Are you admin?: ${isAdmin}.` : '';
    const toggleAdmin = isAuthenticated ?
      <Button
        action={this.toggleAdmin}
        title={'Toggle admin status.'}
      /> : '';

    const demoUserAdmin = isAuthenticated ? isAdmin : isAdmin;

    const displayErrorMsg = errorMsg ? errorMsg : '';

    const loadRoutes = isAuthenticated ?
      <IsAdminContext.Provider value={isAdmin}>
        <NavBar 
          handleLogout={this.handleLogout}
          userIsAdmin={demoUserAdmin}
        />
        <MainRoutes />
      </IsAdminContext.Provider>
      : <LoginForm submitForm={this.validateFormData} errorMsg={displayErrorMsg} />;

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
