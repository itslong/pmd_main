import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { FetchTagTypesChoices, CreateTask, CSRFToken } from '../endpoints';
import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { TASKS_DISPLAY_PATH } from '../frontendBaseRoutes';
import {
  fieldRequiredErrorMsg,
  fieldErrorStyle,
  fieldErrorInlineMsgStyle,
  horizontalLayoutStyle
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
  }

  componentDidMount() {
    let tags = FetchTagTypesChoices();
    tags.then(tagsChoices => {
      this.setState({ tagTypesChoices: tagsChoices })
    })
  }

  handleSubmit(e) {
    e.preventDefault(e);
    const formData = this.getFormDataFromState();

    console.log('clean form data: ', JSON.stringify(formData))
    let created = CreateTask(formData);
    created.then(data => {
      console.log('created: ' + JSON.stringify(data))
      this.handleRedirectAfterSubmit();
      // this.handleClearForm(e);
    });

  }

  handleClearForm(e) {
    e.preventDefault();
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
    })
  }

  getFormDataFromState() {
    const {
      tagTypeAsValue,
      tagTypesChoices,
      redirectAfterSubmit,
      ...formData
    } = this.state;

    return formData;
  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true });
  }

  handleTaskId(e) {
    // required
    // if this is auto generated from backend, remove
    this.setState({ task_id: e.target.value });
  }

  handleTaskName(e) {
    //required
    this.setState({ task_name: e.target.value });
  }

  handleTaskDesc(e) {
    this.setState({ task_desc: e.target.value });
  }

  handleTaskComments(e) {
    this.setState({ task_comments: e.target.value });
  }

  handleTaskAttribute(e) {
    this.setState({ task_attribute: e.target.selectedOptions[0].value });
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
    this.setState({ 
      use_fixed_labor_rate: e.target.checked,
      fixed_labor_rate: 0
    });
  }

  handleFixedLaborRate(e) {
    this.setState({ fixed_labor_rate: e.target.value });
  }

  handleTagTypesChange(e) {
    const selected = e.target.selectedOptions[0];
    const tagTypeId = selected.id;
    const tagTypeValue = selected.value;

    this.setState({
      tag_types: tagTypeId,
      tagTypeAsValue: tagTypeValue
    });

  }

  render() {
    const { use_fixed_labor_rate, redirectAfterSubmit, tagTypesChoices, tagTypeAsValue } = this.state;
    if (redirectAfterSubmit) {
      return <Redirect to={TASKS_DISPLAY_PATH} />
    } 


    const displayFixedLaborRate = use_fixed_labor_rate ? 
      <Input 
        type={'text'}
        title={'Fixed Labor Rate'}
        placeholder={'0.00'}
        value={this.state.fixed_labor_rate}
        handleChange={this.handleFixedLaborRate}
      /> : '';

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div style={horizontalLayoutStyle}>
            <Input 
              type={'text'}
              title={'Task ID'}
              placeholder={'Enter the task id.'}
              value={this.state.task_id}
              handleChange={this.handleTaskId}
            />

          </div>

          <div style={horizontalLayoutStyle}>
            <Input 
              type={'text'}
              title={'Task Name'}
              placeholder={'Enter the task name.'}
              value={this.state.task_name}
              handleChange={this.handleTaskName}
            />

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

          <Select
            title={'Task Attribute'}
            placeholder={'Select a task attribute'}
            value={this.state.task_attribute}
            options={taskAttributeOptions}
            handleChange={this.handleTaskAttribute}
          />
          
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
          
          <Select
            title={'Task Tag Type'}
            placeholder={'Select a tag type'}
            value={this.state.tagTypeAsValue}
            options={tagTypesChoices}
            handleChange={this.handleTagTypesChange}
          />

          <CSRFToken />
           <p>Select parts for this task by going to <b>Task -> Edit</b> after submit.</p>
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

        <Link to={TASKS_DISPLAY_PATH}>Back to Tasks</Link>
      </div>
    )
  }

}

export default CreateTasksForm;
