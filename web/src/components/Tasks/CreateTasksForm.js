import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { FetchTagTypesChoices, CreateTask, CSRFToken } from '../endpoints';
import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { TASKS_DISPLAY_PATH } from '../frontendBaseRoutes';
import DialogModal from '../DialogModal';
import {
  moneyLimitSixRegEx,
  lettersNumbersHyphenRegEx,
  fieldRequiredErrorMsg,
  fieldErrorStyle,
  fieldErrorInlineMsgStyle,
  horizontalLayoutStyle,
  taskNameErrorMsg,
  taskIdLengthErrorMsg,
  taskIdHyphensErrorMsg,
  taskFixedLaborRateErrorMsg,
} from '../helpers';

// if this becomes an api call, delete below
const taskAttributeOptions = [
  {addon: 'Addon Only'},
  {task: 'Task Only'},
  {addonAndTask: 'Addon and Task'},
]

class CreateTasksForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      task_id: '',
      task_name: '',
      task_desc: '',
      task_comments: '',
      task_attribute: '',
      tag_types:'', //pk
      tagTypeAsValue: '', // single string
      tagTypesChoices: [],
      estimated_contractor_hours: 0,
      estimated_contractor_minutes: 0,
      estimated_asst_hours: 0,
      estimated_asst_minutes: 0,
      use_fixed_labor_rate: false,
      fixed_labor_rate: 0,
      redirectAfterSubmit: false,
      formFieldErrors: {
        taskName: false,
        taskId: false,
        tagType: false,
        taskAttr: false,
        fixedLabor: false,
      },
      formFieldErrorMsgs: {
        taskName: '',
        taskId: '',
        tagType: '',
        taskAttr: '',
        fixedLabor: ''
      },
      displaySuccessModal: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleRedirectAfterSubmit = this.handleRedirectAfterSubmit.bind(this);

    this.handleTaskId = this.handleTaskId.bind(this);
    this.handleTaskName = this.handleTaskName.bind(this);
    this.handleTaskDesc = this.handleTaskDesc.bind(this);
    this.handleTaskComments = this.handleTaskComments.bind(this);
    this.handleTaskAttribute = this.handleTaskAttribute.bind(this);
    
    this.handleEstContractorHours = this.handleEstContractorHours.bind(this);
    this.handleEstContractorMinutes = this.handleEstContractorMinutes.bind(this);
    this.handleEstAssistantHours = this.handleEstAssistantHours.bind(this);
    this.handleEstAssistantMinutes = this.handleEstAssistantMinutes.bind(this);

    this.handleUseFixedLaborRate = this.handleUseFixedLaborRate.bind(this);
    this.handleFixedLaborRate = this.handleFixedLaborRate.bind(this);
    this.handleTagTypesChange = this.handleTagTypesChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount() {
    let tags = FetchTagTypesChoices();
    tags.then(tagsChoices => {
      this.setState({ tagTypesChoices: tagsChoices })
    });
  }

  handleSubmit(e) {
    e.preventDefault(e);
    const formValid = this.validateFormState();

    if (!formValid) {
      return;
    }

    const formData = this.getFormDataFromState();

    let created = CreateTask(formData);
    created.then(data => {
      console.log('created task: ' + JSON.stringify(data))
      // this.handleRedirectAfterSubmit();
      this.toggleModal();
      this.handleClearForm();
    });
  }

  handleClearForm() {
    this.setState({
      task_id: '',
      task_name: '',
      task_desc: '',
      task_comments: '',
      task_attribute: '',
      tag_types:'', //pk of tag types
      tagTypeAsValue: '',
      estimated_contractor_hours: 0,
      estimated_contractor_minutes: 0,
      estimated_asst_hours: 0,
      estimated_asst_minutes: 0,
      use_fixed_labor_rate: false,
      fixed_labor_rate: 0,
      formFieldErrors: {
        ...this.state.formFieldErrors,
        taskId: false,
        taskName: false,
        tagType: false,
        taskAttr: false,
        fixedLabor: false,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        taskId: '',
        taskName: '',
        tagType: '',
        taskAttr: '',
        fixedLabor: '',
      },
    })
  }

  validateFormState() {
    const {
      formFieldErrors, task_id, task_name, task_attribute,
      tag_types, use_fixed_labor_rate, fixed_labor_rate 
    } = this.state;
    const {
      taskId: taskIdErr,
      taskName: taskNameErr,
      taskAttr: taskAttrErr,
      tagType: tagTypeErr,
      fixedLabor: fixedLaborErr
    } = formFieldErrors;

    const taskIdValid = task_id !== '' && !taskIdErr ? true : false;
    const taskNameValid = task_name !== '' && !taskNameErr ? true : false;
    const taskAttrValid = task_attribute !== '' && !taskAttrErr ? true : false;
    const tagTypeValid = tag_types !== '' && !tagTypeErr ? true : false;

    const taskIdErrMsg = !taskNameValid ? fieldRequiredErrorMsg : '';
    const taskNameErrMsg = !taskNameValid ? fieldRequiredErrorMsg : '';
    const taskAttrErrMsg = !taskAttrValid ? fieldRequiredErrorMsg : '';
    const tagTypeErrMsg = !tagTypeValid ? fieldRequiredErrorMsg : '';
    let fixedLaborErrMsg = '';
    let fixedLaborValid = true;

    if (use_fixed_labor_rate) {
      fixedLaborValid = fixed_labor_rate !== '' && !fixedLaborErr ? true : false;
      fixedLaborErrMsg = fieldRequiredErrorMsg
    }

    const formValid = taskIdValid && taskNameValid && taskAttrValid && tagTypeValid && fixedLaborValid ? true : false;

    this.setState({
      formFieldErrors: {
        ...this.state.formFieldErrors,
        taskId: !taskIdValid,
        taskName: !taskNameValid,
        tagType: !tagTypeValid,
        taskAttr: !taskAttrValid,
        fixedLabor: !fixedLaborValid,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        taskId: taskIdErrMsg,
        taskName: taskNameErrMsg,
        tagType: tagTypeErrMsg,
        taskAttr: taskAttrErrMsg,
        fixedLabor: fixedLaborErrMsg,
      },
    });
    return formValid;
  }

  getFormDataFromState() {
    const {
      tagTypeAsValue,
      tagTypesChoices,
      redirectAfterSubmit,
      formFieldErrors,
      formFieldErrorMsgs,
      displaySuccessModal,
      ...formData
    } = this.state;

    return formData;
  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true });
  }

  handleTaskId(e) {
    // if this is auto generated from backend, remove
    const taskId = e.target.value;

    const lengthValid = taskId.length > 2 && taskId.length < 11 ? true : false;
    const taskIdValidated = lettersNumbersHyphenRegEx.test(taskId);

    const taskIdErr = !lengthValid || !taskIdValidated ? true : false;
    const errorMsg = !lengthValid ? taskIdLengthErrorMsg : !taskIdValidated ? taskIdHyphensErrorMsg : '';

    this.setState({ 
      task_id: taskId,
      formFieldErrors: { ...this.state.formFieldErrors, taskId: taskIdErr },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, taskId: errorMsg }
    });
  }

  handleTaskName(e) {
    const taskName = e.target.value;

    const nameErr = taskName.length < 3 ? true : false;
    const errMsg = taskName.length < 3 ? taskNameErrorMsg : '';

    this.setState({ 
      task_name: taskName,
      formFieldErrors: { ...this.state.formFieldErrors, taskName: nameErr },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, taskName: errMsg }
    });
  }

  handleTaskDesc(e) {
    this.setState({ task_desc: e.target.value });
  }

  handleTaskComments(e) {
    this.setState({ task_comments: e.target.value });
  }

  handleTaskAttribute(e) {
    this.setState({ 
      task_attribute: e.target.selectedOptions[0].value,
      formFieldErrors: { ...this.state.formFieldErrors, taskAttr: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, taskAttr: '' },
    });
  }

  handleEstContractorHours(e) {
    this.setState({ estimated_contractor_hours: e.target.value })
  }

  handleEstContractorMinutes(e) {
    this.setState({ estimated_contractor_minutes: e.target.value })
  }

  handleEstAssistantHours(e) {
    this.setState({ estimated_asst_hours: e.target.value })
  }

  handleEstAssistantMinutes(e) {
    this.setState({ estimated_asst_minutes: e.target.value })
  }

  handleUseFixedLaborRate(e) {
    const initialFixedLaborRate = e.target.checked ? '' : '0.00';

    this.setState({ 
      use_fixed_labor_rate: e.target.checked,
      fixed_labor_rate: initialFixedLaborRate,
    });
  }

  handleFixedLaborRate(e) {
    const laborRate = e.target.value;
    const laborRateValidated = moneyLimitSixRegEx.test(laborRate);

    const laborRateErr = laborRateValidated ? false : true;
    const errorMsg = laborRateValidated ? '' : taskFixedLaborRateErrorMsg;

    this.setState({ 
      fixed_labor_rate: laborRate,
      formFieldErrors: { ...this.state.formFieldErrors, fixedLabor: laborRateErr },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, fixedLabor: errorMsg },
    });
  }

  handleTagTypesChange(e) {
    const selected = e.target.selectedOptions[0];
    const tagTypeId = selected.id;
    const tagTypeValue = selected.value;

    this.setState({
      tag_types: tagTypeId,
      tagTypeAsValue: tagTypeValue,
      formFieldErrors: { ...this.state.formFieldErrors, tagType: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, tagType: '' },
    });
  }

  toggleModal() {
    this.setState({ displaySuccessModal: !this.state.displaySuccessModal })
  }

  render() {
    const { 
      use_fixed_labor_rate, redirectAfterSubmit, tagTypesChoices, tagTypeAsValue,
      formFieldErrors, formFieldErrorMsgs, displaySuccessModal
    } = this.state;
    // if (redirectAfterSubmit) {
    //   return <Redirect to={TASKS_DISPLAY_PATH} />
    // } 

    const {
      taskId: taskIdErr,
      taskName: taskNameErr,
      taskAttr: taskAttrErr,
      tagType: tagTypeErr,
      fixedLabor: fixedLaborErr
    } = formFieldErrors;
    const { 
      taskId: taskIdMsg,
      taskName: taskNameMsg,
      tagType: tagTypeMsg,
      taskAttr: taskAttrMsg,
      fixedLabor: fixedLaborMsg 
    } = formFieldErrorMsgs;

    const taskIdErrorMsg = taskIdErr ?
      <p style={fieldErrorInlineMsgStyle}>{taskIdMsg}</p>
      : '';

    const taskNameErrorMsg = taskNameErr ?
      <p style={fieldErrorInlineMsgStyle}>{taskNameMsg}</p>
      : '';

    const taskAttrErrorMsg = taskAttrErr ?
      <p style={fieldErrorInlineMsgStyle}>{taskAttrMsg}</p>
      : '';

    const tagTypeErrorMsg = tagTypeErr ?
      <p style={fieldErrorInlineMsgStyle}>{tagTypeMsg}</p>
      : '';

    const fixedLaborErrorMsg = fixedLaborErr ?
      <p style={fieldErrorInlineMsgStyle}>{fixedLaborMsg}</p>
      : '';

    const displayFixedLaborRate = use_fixed_labor_rate ?
      <div style={horizontalLayoutStyle}>
        <Input 
          type={'text'}
          className={fixedLaborErr ? 'error' : ''}
          title={'Fixed Labor Rate'}
          placeholder={'0.00'}
          value={this.state.fixed_labor_rate}
          handleChange={this.handleFixedLaborRate}
          style={fixedLaborErr ? fieldErrorStyle : null}
        />
        {fixedLaborErrorMsg}
      </div> : '';

    const displayModal = displaySuccessModal ?
    <DialogModal
      dialogText={'Successfully created'}
      handleCloseDialog={this.toggleModal}
    /> : '';

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div style={horizontalLayoutStyle}>
            <Input 
              type={'text'}
              className={taskIdErr ? 'error' : ''}
              title={'Task ID'}
              placeholder={'Enter the task id.'}
              value={this.state.task_id}
              handleChange={this.handleTaskId}
              style={taskIdErr ? fieldErrorStyle : null}
            />
            {taskIdErrorMsg}
          </div>

          <div style={horizontalLayoutStyle}>
            <Input 
              type={'text'}
              className={taskNameErr ? 'error' : ''}
              title={'Task Name'}
              placeholder={'Enter the task name.'}
              value={this.state.task_name}
              handleChange={this.handleTaskName}
              style={taskNameErr ? fieldErrorStyle : null}
            />
            {taskNameErrorMsg}
          </div>

          <TextArea
            type={'text'}
            title={'Task Description'}
            placeholder={'Enter the task description.'}
            rows={5}
            value={this.state.task_desc}
            handleChange={this.handleTaskDesc}
          />

          <TextArea
            type={'text'}
            title={'Task Comments'}
            placeholder={'Enter the task comments.'}
            value={this.state.task_comments}
            handleChange={this.handleTaskComments}
          />

          <div style={horizontalLayoutStyle}>
            <Select
              className={taskAttrErr ? 'error' : ''}
              title={'Task Attribute'}
              placeholder={'Select a task attribute'}
              value={this.state.task_attribute}
              options={taskAttributeOptions}
              handleChange={this.handleTaskAttribute}
              style={taskAttrErr ? fieldErrorStyle : null}
            />
            {taskAttrErrorMsg}
          </div>

          <Input
            type={'text'}
            title={'Estimated Contractor Hours'}
            placeholder={'0.00'}
            value={this.state.estimated_contractor_hours}
            handleChange={this.handleEstContractorHours}
          />
          
          <Input 
            type={'text'}
            title={'Estimated Contractor Minutes'}
            placeholder={'0.00'}
            value={this.state.estimated_contractor_minutes}
            handleChange={this.handleEstContractorMinutes}
          />

          <Input
            type={'text'}
            title={'Estimated Assistant Hours'}
            placeholder={'0.00'}
            value={this.state.estimated_asst_hours}
            handleChange={this.handleEstAssistantHours}
          />
          
          <Input 
            type={'text'}
            title={'Estimated Assistant Minutes'}
            placeholder={'0.00'}
            value={this.state.estimated_asst_minutes}
            handleChange={this.handleEstAssistantMinutes}
          />


          <Checkbox
            title={'Use Fixed Labor Rate?'}
            checked={this.state.use_fixed_labor_rate}
            handleChange={this.handleUseFixedLaborRate}
          />

          {displayFixedLaborRate}
          
          <div style={horizontalLayoutStyle}>
            <Select
              className={tagTypeErr ? 'error' : ''}
              title={'Task Tag Type'}
              placeholder={'Select a tag type'}
              value={this.state.tagTypeAsValue}
              options={tagTypesChoices}
              handleChange={this.handleTagTypesChange}
              style={tagTypeErr ? fieldErrorStyle : null}
            />
            {tagTypeErrorMsg}
          </div>

          <CSRFToken />
           <p>Select parts for this task by going to <b>Task -> Edit</b> after submit.</p>
          <Button
            type={'submitBtn'}
            title={'Submit'}
            action={this.handleSubmit}
          />
          <Button
            type={'clearBtn'}
            title={'Clear Form'}
            action={this.handleClearForm}
          />

        </form>
        {displayModal}
        <Link to={TASKS_DISPLAY_PATH}>Back to Tasks</Link>
      </div>
    )
  }

}

export default CreateTasksForm;
