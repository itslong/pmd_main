import React, { Component } from 'react';

import { Input, Button } from '../common';


class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
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

  handleFormSubmit(e) {
    e.preventDefault();
    const formData = this.state;
    this.props.submitForm(formData);
  }

  render() {
    const { username, password } = this.state;

    return (
      <form>
        <h4>Log In</h4>

        <Input
          title={'Username'}
          id={'username'}
          name={'username'}
          type={'text'}
          value={username}
          handleChange={this.handleValueChange}
          placeholder={'Enter username here.'}
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
          action={this.handleFormSubmit}
        />

      </form>
    )
  }
}

export default LoginForm;
