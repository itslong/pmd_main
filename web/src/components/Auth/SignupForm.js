import React, { Component } from 'react';

import { Input, Button } from '../common';
import DialogModal from '../DialogModal';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      verifyPassword: '',
      displayModal: false,
    };

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
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
    this.setState({
      password: '',
      verifyPassword: '',
      displayModal: true,
    });
  }

  handleCloseModal(e) {
    e.preventDefault();
    this.setState({
      username: '',
      password: '',
      verifyPassword: '',
      displayModal: false,
    });
  }

  render() {
    const { username, password, verifyPassword, errors, displayModal } = this.state;

    const modalText = 'Success or Failed!.. is what this will say if this feature was implemented.';
    const modal = displayModal ?
      <DialogModal
        dialogText={modalText}
        handleCloseDialog={this.handleCloseModal}
      /> : '';

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
        {modal}

      </form>
    )
  }
}

export default SignupForm;
