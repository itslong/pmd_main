import React, { Component } from 'react';

import { Input, Button } from '../common';


class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verifyPassword: '',
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const { username, password, verifyPassword, errors } = this.state;

    return (
      <form>
        <h4>Sign Up</h4>

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

        <Input
          title={'Verify Password'}
          id={'password'}
          name={'verifyPassword'}
          type={'password'}
          value={verifyPassword}
          handleChange={this.handleValueChange}
          placeholder={'Enter password again.'}
        />

        <Button
          id={'submit'}
          type={'primary'}
          title={'Enter'}
          action={this.handleSubmit}
        />

      </form>
    )
  }
}

export default SignupForm;
