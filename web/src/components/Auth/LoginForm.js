import React, { Component } from 'react';

import { Input, Button, centerHorizontalAndVerticalStyle } from '../common';
import { BASE_PATH, HOME_PATH } from '../frontendBaseRoutes';
import { LoginUser } from '../endpoints';


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMsg: null,
      isLoading: false,
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.validateFormData = this.validateFormData.bind(this);
  }

  handleValueChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    this.setState(prevState => {
      const newState = { ...prevState };

      newState[name] = value;
      return newState;
    });
  }

  handleFormSubmit() {
    const { username, password } = this.state;
    const formData = Object.assign({}, {
      username,
      password,
    });

    const submit = LoginUser(formData);
    const authState = {};

    submit.then(data => {
      const { non_field_errors } = data;

      if (non_field_errors) {
        return this.setState({
          errorMsg: 'Unable to log in with provided credentials.',
          isLoading: false,
          password: '',
        });
      }

      this.setState({
        username: '',
        password: '',
        errorMsg: '',
      }, () => {
        Object.assign(authState,{
          token: data.token,
          username,
        });
      });
    })
    .then(() => {
      this.props.updateAuthState(authState);
    })
  }

  validateFormData(e) {
    e.preventDefault();
    const { username, password } = this.state;

    if (username !== '' && password !== '') {
      return this.setState({
        errorMsg: '',
        isLoading: true,
      }, () => {
        this.handleFormSubmit();
      });
    }

    if (username === '' && password === '') {
      return this.setState({
        errorMsg: 'Username field and Password field may not be blank.'
      });
    }

    if (username === '') {
      return this.setState({
        errorMsg: 'Username field may not be blank.'
      });
    }

    if (password === '') {
      return this.setState({
        errorMsg: 'Password field may not be blank.'
      });
    }
  }

  render() {
    const { username, password, errorMsg } = this.state;
    const displayErrorMsg = errorMsg ? errorMsg : '';

    return (
      <div className="login-form-container" style={centerHorizontalAndVerticalStyle}>
        <form>
          <h4>Log In</h4>
          {displayErrorMsg}
          <Input
            title={'Username'}
            id={'username'}
            name={'username'}
            type={'text'}
            value={username}
            handleChange={this.handleValueChange}
            placeholder={'Enter username here.'}
            style={{width: 'auto'}}
          />

          <Input
            title={'Password'}
            id={'password'}
            name={'password'}
            type={'password'}
            value={password}
            handleChange={this.handleValueChange}
            placeholder={'Enter password here.'}
          />

          <Button
            id={'submit'}
            type={'primary'}
            title={'Enter'}
            action={this.validateFormData}
          />
        </form>
      </div>
    )
  }
}

export default LoginForm;
