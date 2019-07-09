import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { CreateJob, FetchTagTypesChoices, CSRFToken } from '../endpoints';
import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { JOBS_DISPLAY_PATH } from '../frontendBaseRoutes';


class CreateJobsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      job_id: '',
      job_name: '',
      job_desc: '',
      ordering_num: '',
      jobNameOptions: [],
      redirectAfterSubmit: false,
    }

    this.handleJobId = this.handleJobId.bind(this);
    this.handleJobName = this.handleJobName.bind(this);
    this.handleJobDesc = this.handleJobDesc.bind(this);
    this.handleOrderingNum = this.handleOrderingNum.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);

  }

  componentDidMount() {
    let tags = FetchTagTypesChoices();
    tags.then(tagsChoices => {
      this.setState({ jobNameOptions: tagsChoices });
    });
  }

  getFormDataFromState() {
    const {
      redirectAfterSubmit,
      jobNameOptions,
      ...formData
    } = this.state;

    return formData;
  }

  handleJobId(e) {
    this.setState({ job_id: e.target.value });
  }

  handleJobName(e) {
    this.setState({ job_name: e.target.selectedOptions[0].value });
  }

  handleJobDesc(e) {
    this.setState({ job_desc: e.target.value });
  }

  handleOrderingNum(e) {
    this.setState({ ordering_num: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = this.getFormDataFromState();

    let createJob = CreateJob(formData);
    createJob.then(data => {
      this.handleRedirectAfterSubmit();
    })
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      job_id: '',
      job_name: '',
      job_desc: '',
      ordering_num: '',
    });
  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true });
  }

  render() {
    const { redirectAfterSubmit } = this.state;
    if (redirectAfterSubmit) {
      return <Redirect to={JOBS_DISPLAY_PATH} />
    }

    return (
     <div>
        <form onSubmit={this.handleSubmit}>
          <Input 
            type={'text'}
            title={'Job ID'}
            placeholder={'Enter the job ID.'}
            value={this.state.job_id}
            handleChange={this.handleJobId}
          />

          <Select
            title={'Job Name'}
            options={this.state.jobNameOptions}
            value={this.state.job_name}
            handleChange={this.handleJobName}
          />

          <TextArea
            type={'text'}
            title={'Job Description'}
            placeholder={'Enter the job description.'}
            rows={5}
            value={this.state.job_desc}
            handleChange={this.handleJobDesc}
          />
          
          <Input 
            type={'text'}
            title={'Ordering Number'}
            placeholder={'Enter the ordering number.'}
            value={this.state.ordering_num}
            handleChange={this.handleOrderingNum}
          />

          <CSRFToken />
          <p>Select categories for this job by going to <b>Category -> Edit</b> after submit.</p>
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
        <Link to={JOBS_DISPLAY_PATH}>Back to Jobs</Link>
      </div> 
    )
  }
}

export default CreateJobsForm;
