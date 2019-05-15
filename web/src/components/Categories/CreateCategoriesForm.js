import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { CreateCategory, CSRFToken } from '../endpoints';
import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { CATEGORIES_DISPLAY_PATH } from '../frontendBaseRoutes';


class CreateCategoriesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_id: '',
      category_name: '',
      category_desc: '',
      redirectAfterSubmit: false,
    }

    this.handleCategoryId = this.handleCategoryId.bind(this);
    this.handleCategoryName = this.handleCategoryName.bind(this);
    this.handleCategoryDesc = this.handleCategoryDesc.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);

  }

  getFormDataFromState() {
    const {
      redirectAfterSubmit,
      ...formData
    } = this.state;

    return formData;
  }

  handleCategoryId(e) {
    this.setState({ category_id: e.target.value });
  }

  handleCategoryName(e) {
    this.setState({ category_name: e.target.value });
  }

  handleCategoryDesc(e) {
    this.setState({ category_desc: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = this.getFormDataFromState();

    let createCategory = CreateCategory(formData);
    createCategory.then(data => {
      this.handleRedirectAfterSubmit();
    })
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      category_id: '',
      category_name: '',
      category_desc: '',
      redirectAfterSubmit: false,
    });
  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true });
  }

  render() {
    const { redirectAfterSubmit } = this.state;
    if (redirectAfterSubmit) {
      return <Redirect to={CATEGORIES_DISPLAY_PATH} />
    }

    return (
     <div>
        <form onSubmit={this.handleSubmit}>
          <Input 
            type={'text'}
            title={'Category ID'}
            placeholder={'Enter the category ID.'}
            value={this.state.category_id}
            handleChange={this.handleCategoryId}
          />

          <Input 
            type={'text'}
            title={'Category Name'}
            placeholder={'Enter the category name.'}
            value={this.state.category_name}
            handleChange={this.handleCategoryName}
          />

          <TextArea
            type={'text'}
            title={'Category Description'}
            placeholder={'Enter the category description.'}
            rows={5}
            value={this.state.category_desc}
            handleChange={this.handleCategoryDesc}
          />
          

          <CSRFToken />
          <p>Select tasks for this category by going to <b>Category -> Edit</b> after submit.</p>
          <Button
            type={'primary'}
            title={'Submit'}
            action={this.handleSubmit}
          />
          <Button
            type={'secondary'}
            title={'Clear Form'}
            action={this.handleClearForm}
          />

        </form>
        <Link to={CATEGORIES_DISPLAY_PATH}>Back to Categories</Link>
      </div> 
    )
  }
}

export default CreateCategoriesForm;
