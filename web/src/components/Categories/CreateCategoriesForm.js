import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { CreateCategory, CSRFToken } from '../endpoints';
import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { CATEGORIES_DISPLAY_PATH } from '../frontendBaseRoutes';
import {
  lettersNumbersHyphenRegEx,
  fieldRequiredErrorMsg,
  fieldErrorStyle,
  fieldErrorInlineMsgStyle,
  horizontalLayoutStyle,
  categoryNameErrorMsg,
  categoryIdHyphensErrorMsg,
  categoryIdLengthErrorMsg
} from '../helpers';


class CreateCategoriesForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_id: '',
      category_name: '',
      category_desc: '',
      redirectAfterSubmit: false,
      formFieldErrors: {
        categoryId: false,
        categoryName: false,
      },
      formFieldErrorMsgs: {
        categoryId: '',
        categoryName: '',
      },
      formValid: false,
    }

    this.handleCategoryId = this.handleCategoryId.bind(this);
    this.handleCategoryName = this.handleCategoryName.bind(this);
    this.handleCategoryDesc = this.handleCategoryDesc.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);

  }

  handleSubmit(e) {
    e.preventDefault();
    const formValid = this.validateFormState();

    if (!formValid) {
      return;
    }

    const formData = this.getFormDataFromState();

    let createCategory = CreateCategory(formData);
    createCategory.then(data => {
      this.handleRedirectAfterSubmit();
    })
  }

  validateFormState() {
    const { formFieldErrors, category_id, category_name } = this.state;
    const {
      categoryId: catIdErr,
      categoryName: catNameErr,
    } = formFieldErrors;

    const catIdValid = category_id !== '' && !catIdErr ? true : false;
    const catNameValid = category_name !== '' && !catNameErr ? true : false;

    const formValid = catIdValid && catNameValid ? true : false;

    if (!formValid) {
      this.setState({
        formValid: false,
        formFieldErrors: {
          ...this.state.formFieldErrors,
          categoryId: !catIdValid,
          categoryName: !catNameValid,
        },
        formFieldErrorMsgs: {
          ...this.state.formFieldErrorMsgs,
          categoryId: fieldRequiredErrorMsg,
          categoryName: fieldRequiredErrorMsg,
        },
      });
      return false;
    }

    this.setState({
      formValid,
      formFieldErrors: {
        ...this.state.formFieldErrors,
        categoryId: false,
        categoryName: false,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        categoryId: '',
        categoryName: '',
      },
    });
    return formValid;
  }

  getFormDataFromState() {
    const {
      redirectAfterSubmit,
      formFieldErrors,
      formFieldErrorMsgs,
      formValid,
      ...formData
    } = this.state;

    return formData;
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      category_id: '',
      category_name: '',
      category_desc: '',
      redirectAfterSubmit: false,
      formFieldErrors: {
        ...this.state.formFieldErrors,
        categoryId: false,
        categoryName: false,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        categoryId: '',
        categoryName: '',
      },
      formValid: false
    });
  }

  handleCategoryId(e) {
    const catId = e.target.value;

    const lengthValid = catId.length < 3 || catId.length > 10 ? false : true;
    const catIdValidated = lettersNumbersHyphenRegEx.test(catId);

    if (!lengthValid || !catIdValidated) {
      const errorMsg = !lengthValid ? categoryIdLengthErrorMsg : categoryIdHyphensErrorMsg;

      return this.setState({
        category_id: catId,
        formFieldErrors: { ...this.state.formFieldErrors, categoryId: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, categoryId: errorMsg }
      });
    }

    this.setState({ 
      category_id: catId,
      formFieldErrors: { ...this.state.formFieldErrors, categoryId: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, categoryId: '' }
    });
  }

  handleCategoryName(e) {
    const catName = e.target.value;

    if (catName.length < 3) {
      return this.setState({
        category_name: catName,
        formFieldErrors: { ...this.state.formFieldErrors, categoryName: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, categoryName: categoryNameErrorMsg }
      });
    }

    this.setState({ 
      category_name: catName,
      formFieldErrors: { ...this.state.formFieldErrors, categoryName: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, categoryName: '' }
    });
  }

  handleCategoryDesc(e) {
    this.setState({ category_desc: e.target.value });
  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true });
  }

  render() {
    const { redirectAfterSubmit, formFieldErrors, formFieldErrorMsgs } = this.state;
    if (redirectAfterSubmit) {
      return <Redirect to={CATEGORIES_DISPLAY_PATH} />
    }

    const {
      categoryId: catIdErr,
      categoryName: catNameErr,
    } = formFieldErrors;
    const { 
      categoryId: catIdMsg,
      categoryName: catNameMsg,
    } = formFieldErrorMsgs;

    const catIdErrorMsg = catIdErr ?
      <p style={fieldErrorInlineMsgStyle}>{catIdMsg}</p>
      : '';

    const catNameErrorMsg = catNameErr ?
      <p style={fieldErrorInlineMsgStyle}>{catNameMsg}</p>
      : '';

    return (
     <div>
        <form onSubmit={this.handleSubmit}>
          <div style={horizontalLayoutStyle}>
            <Input
              type={'text'}
              className={catIdErr ? 'error' : ''}
              title={'Category ID'}
              placeholder={'Enter the category ID.'}
              value={this.state.category_id}
              handleChange={this.handleCategoryId}
              style={catIdErr ? fieldErrorStyle : null}
            />
            {catIdErrorMsg}
          </div>

          <div style={horizontalLayoutStyle}>
            <Input
              type={'text'}
              className={catNameErr ? 'error' : ''}
              title={'Category Name'}
              placeholder={'Enter the category name.'}
              value={this.state.category_name}
              handleChange={this.handleCategoryName}
              style={catNameErr ? fieldErrorStyle : null}
            />
            {catNameErrorMsg}
          </div>

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
