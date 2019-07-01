import React, { Component } from 'react';

import { Input, Button, TextArea, Checkbox, Table, Select } from '../common';
import Modal from '../Modal';
import SearchComponent from '../SearchComponent';
import { UpdateTaskRelatedPartsSubmit, FetchGlobalMarkup, CSRFToken } from '../endpoints';
import { TASKS_DISPLAY_PATH } from '../frontendBaseRoutes';
import { renameAndRebuildRelatedPartsDisplayFields } from '../CalculationsWithGlobalMarkup';
import DialogModal from '../DialogModal';
import { 
  taskDetailRelatedPartsTableFields,
  taskRelatedPartsSearchResultsTableFields,
} from '../fieldNameAliases';
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
  {task_attribute: 'Addon Only'},
  {task_attribute: 'Task Only'},
  {task_attribute: 'Addon and Task'},
]


class TaskFormFields extends Component {
  constructor(props) {
    super(props);
    const { data, tagTypesChoices } = this.props;

    this.state = {
      id: data.id,
      task_id: data.task_id,
      task_name: data.task_name,
      task_desc: data.task_desc,
      task_comments: data.task_comments,
      task_attribute: data.task_attribute,
      tag_types: data.tag_types.id,
      categories: data.categories.category_name || 'No category attached to this task.',
      tag_types_as_values: data.tag_types.tag_name, //string
      tag_types_choices: tagTypesChoices,
      category: data.categories.category_name, // read only
      estimated_contractor_hours: data.estimated_contractor_hours,
      estimated_contractor_minutes: data.estimated_contractor_minutes,
      estimated_asst_hours: data.estimated_asst_hours,
      estimated_asst_minutes: data.estimated_asst_minutes,
      use_fixed_labor_rate: data.use_fixed_labor_rate,
      fixed_labor_rate: data.fixed_labor_rate,
      is_active: data.is_active,
      submitPartsAsIds: [], // array of pks
      tempPartsAsIds: [],
      submitPartsValuesForDisplay: [], // array of objects
      tempPartsValuesForDisplay: [],
      relatedPartsTableIsLoaded: true,
      toggleLoadNewData: false,
      madeChanges: false,
      globalMarkup: [],
      formFieldErrors: {
        taskName: false,
        taskId: false,
        fixedLabor: false,
      },
      formFieldErrorMsgs: {
        taskName: '',
        taskId: '',
        fixedLabor: ''
      },
      toggleDialog: false,
      dialogMsg: '',
    }

    this.handleSubmitChanges = this.handleSubmitChanges.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);

    this.handleTaskId = this.handleTaskId.bind(this);
    this.handleTaskName = this.handleTaskName.bind(this);
    this.handleTaskDesc = this.handleTaskDesc.bind(this);
    this.handleTaskComments = this.handleTaskComments.bind(this);

    this.handleTaskAttribute = this.handleTaskAttribute.bind(this);
    this.handleTagTypesChange = this.handleTagTypesChange.bind(this);


    this.handleEstContractorHours = this.handleEstContractorHours.bind(this);
    this.handleEstContractorMinutes = this.handleEstContractorMinutes.bind(this);
    this.handleEstAssistantHours = this.handleEstAssistantHours.bind(this);
    this.handleEstAssistantMinutes = this.handleEstAssistantMinutes.bind(this);
    this.handleFixedLaborRate = this.handleFixedLaborRate.bind(this);

    this.handleUseFixedLaborRate = this.handleUseFixedLaborRate.bind(this);
    this.handleIsActiveChecked = this.handleIsActiveChecked.bind(this);

    this.handleDisplayModalForSearch = this.handleDisplayModalForSearch.bind(this);
    
    this.handleAddPart = this.handleAddPart.bind(this);
    this.handleRemovePartIdAndValues = this.handleRemovePartIdAndValues.bind(this);
    this.handleRemoveAllItems = this.handleRemoveAllItems.bind(this);
    this.handlePartQuantityChange = this.handlePartQuantityChange.bind(this);
    this.handleQueuePartsChanges = this.handleQueuePartsChanges.bind(this);
    this.handleCancelPartsChanges = this.handleCancelPartsChanges.bind(this);
    this.toggleDialogState = this.toggleDialogState.bind(this);
  }

  componentDidMount() {
    const { data, tagTypesChoices } = this.props;
    const { tag_types, parts } = data;
    const partsIds = this.convertPartsToIds(parts);

    const markupData = FetchGlobalMarkup();
    markupData.then(markupArr => {

      this.setState({
        submitPartsAsIds: partsIds,
        tempPartsAsIds: partsIds,
        submitPartsValuesForDisplay: parts, // array of objects
        tempPartsValuesForDisplay: parts,
        globalMarkup: markupArr
      });
    })

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.toggleLoadNewData !== this.state.toggleLoadNewData) {
      const { fetchRoute, tagTypesChoices } = this.props;

      fetchRoute(this.state.id).then(newData => {
        const cleanPartIds = newData.parts.map(obj => {
          return obj.id;
        });

        this.setState({
          id: newData.id,
          task_id: newData.task_id,
          task_name: newData.task_name,
          task_desc: newData.task_desc,
          task_comments: newData.task_comments,
          task_attribute: newData.task_attribute,
          tag_types: newData.tag_types.id, //id only for submission
          tag_types_as_values: newData.tag_types.tag_name, //string: tag type's tag_name
          tag_types_choices: tagTypesChoices,
          estimated_contractor_hours: newData.estimated_contractor_hours,
          estimated_contractor_minutes: newData.estimated_contractor_minutes,
          estimated_asst_hours: newData.estimated_asst_hours,
          estimated_asst_minutes: newData.estimated_asst_minutes,
          use_fixed_labor_rate: newData.use_fixed_labor_rate,
          fixed_labor_rate: newData.fixed_labor_rate,
          is_active: newData.is_active,
          categories: newData.categories.category_name || 'No category attached to this task.',
          submitPartsAsIds: cleanPartIds, // array of pks
          tempPartsAsIds: cleanPartIds,
          submitPartsValuesForDisplay: newData.parts, // array of objects
          tempPartsValuesForDisplay: newData.parts,
          relatedPartsTableIsLoaded: true,
          madeChanges: false,
        });
      })
    }
  }

  convertPartsToIds(partsArr) {
    const partsAsIds = partsArr.map(obj => {
      return obj.id;
    });
    return partsAsIds;
  }

  filterRelatedPartsTableData(partsArr) {
    const { globalMarkup, tag_types } = this.state;

    return renameAndRebuildRelatedPartsDisplayFields(partsArr, tag_types, globalMarkup, taskDetailRelatedPartsTableFields);
  }

  handleSubmitChanges(e) {
    e.preventDefault();
    const formValid = this.validateFormState();

    if (!formValid) {
      return;
    }

    const { id: task_id, submitPartsValuesForDisplay } = this.state;

    const filteredPartsData = submitPartsValuesForDisplay.map(({ id: part_id, quantity }) => {
      return {
        task: task_id,
        part: part_id,
        quantity,
      }
    });

    const submitted = UpdateTaskRelatedPartsSubmit(task_id, filteredPartsData);
    submitted.then((results) => {
      if (results === 'Success') {
        const formData = this.getFormDataFromState();

        let update = this.props.updateRoute(task_id, formData);
        update.then(() => {
          this.setState({
            relatedPartsTableIsLoaded: false,
            toggleLoadNewData: !this.state.toggleLoadNewData,
            dialogMsg: 'Successfully updated.',
          }, () => {
            this.toggleDialogState();
          });
        })
      }
    })
  }

  validateFormState() {
    const { formFieldErrors, task_id, task_name, use_fixed_labor_rate, fixed_labor_rate } = this.state;
    const {
      taskId: taskIdErr,
      taskName: taskNameErr,
      fixedLabor: fixedLaborErr
    } = formFieldErrors;

    const taskIdValid = task_id !== '' && !taskIdErr ? true : false;
    const taskNameValid = task_name !== '' && !taskNameErr ? true : false;

    const taskIdErrMsg = !taskNameValid ? fieldRequiredErrorMsg : '';
    const taskNameErrMsg = !taskNameValid ? fieldRequiredErrorMsg : '';
    let fixedLaborErrMsg = '';
    let fixedLaborValid = true;

    if (use_fixed_labor_rate) {
      fixedLaborValid = fixed_labor_rate !== '' && !fixedLaborErr ? true : false;
      fixedLaborErrMsg = fieldRequiredErrorMsg;
    }

    const formValid = taskIdValid && taskNameValid && fixedLaborValid ? true : false;

    this.setState({
      formFieldErrors: {
        ...this.state.formFieldErrors,
        taskId: !taskIdValid,
        taskName: !taskNameValid,
        fixedLabor: !fixedLaborValid,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        taskId: taskIdErrMsg,
        taskName: taskNameErrMsg,
        fixedLabor: fixedLaborErrMsg,
      },
    });
    return formValid;
  }

  getFormDataFromState() {
    const { 
      id,
      categories,
      tag_types_as_values,
      tag_types_choices,
      submitPartsAsIds,
      tempPartsAsIds,
      submitPartsValuesForDisplay,
      tempPartsValuesForDisplay,
      relatedPartsTableIsLoaded,
      toggleLoadNewData,
      madeChanges,
      globalMarkup,
      formFieldErrors,
      formFieldErrorMsgs,
      toggleDialog,
      dialogMsg,
      ...formData
    } = this.state;

    return formData;
  }

  handleCancelEdit(e) {
    e.preventDefault();
    this.props.history.push(TASKS_DISPLAY_PATH);
  }

  handleTaskId(e) {
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
    const selected = e.target.selectedOptions[0].value;
    this.setState({
      task_attribute: selected
    });
  }

  handleTagTypesChange(e) {
    const selected = e.target.selectedOptions[0];
    const tagTypeId = selected.id;
    const tagTypeValue = selected.value;

    this.setState({
      tag_types: tagTypeId,
      tag_types_as_values: tagTypeValue
    });
  }

  handleEstContractorHours(e) {
    this.setState({ estimated_contractor_hours: e.target.value });
  }

  handleEstContractorMinutes(e) {
    this.setState({ estimated_contractor_minutes: e.target.value });
  }

  handleEstAssistantHours(e) {
    this.setState({ estimated_asst_hours: e.target.value });
  }

  handleEstAssistantMinutes(e) {
    this.setState({ estimated_asst_minutes: e.target.value });
  }

  handleUseFixedLaborRate(e) {
    // force user to change the value if this is checked.
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

  handleIsActiveChecked(e) {
    this.setState({ is_active: e.target.checked });
  }

  handleDisplayModalForSearch(e) {
    e.preventDefault();
    this.setState({
      displayModalForSearch: !this.state.displayModalForSearch,
    });
  }

  handleAddPart(partData) {
    const { tempPartsAsIds } = this.state;
    const { id, master_part_num, part_name, part_base_part_cost, part_retail_part_cost } = partData;

    if (tempPartsAsIds.includes(id)) {
      return this.setState({
        toggleDialog: !this.state.toggleDialog,
        dialogMsg: `${part_name} has already been added.`,
      });
    }

    const newPart = Object.assign({}, {
      id,
      master_part_num,
      part_name,
      part_base_part_cost,
      part_retail_part_cost,
      quantity: 1,
      total_cost: 'Costs calculated after submitting changes.',
      calc_total_retail: 'Costs calculated after submitting changes.'
    });

    this.setState({
      tempPartsAsIds: [...this.state.tempPartsAsIds, newPart.id],
      tempPartsValuesForDisplay: [...this.state.tempPartsValuesForDisplay, newPart]
    });
  }

  handlePartQuantityChange(e) {
    const id = parseInt(e.target.id);
    const newVal = parseInt(e.target.value);
    const newQtyVal = newVal > 0 ? newVal : 0;

    const { tempPartsValuesForDisplay } = this.state;

    const updatedQuantityPartValues = tempPartsValuesForDisplay.map(part => {
      if (part.id == id) {

        let updatedPart = Object.assign({}, part);
        updatedPart.quantity = newQtyVal;
        updatedPart.calc_total_retail = 'Costs calculated after submitting changes.'

        return updatedPart;
      }

      return part;
    })

    this.setState({
      tempPartsValuesForDisplay: updatedQuantityPartValues
    });
  }

  handleRemovePartIdAndValues(e) {
    e.preventDefault();
    const { tempPartsValuesForDisplay, tempPartsAsIds } = this.state;
    let id = parseInt(e.target.id);

    const updatedPartsValuesForDisplay = tempPartsValuesForDisplay.filter(item => {
      return item.id != id;
    });

    const updatedPartsAsIds = tempPartsAsIds.filter(partId => {
      return partId != id;
    });

    this.setState({
      tempPartsAsIds: updatedPartsAsIds,
      tempPartsValuesForDisplay: updatedPartsValuesForDisplay,
    });
  }

  handleRemoveAllItems(e) {
    e.preventDefault();
    this.setState({
      tempPartsAsIds: [],
      tempPartsValuesForDisplay: [],
      madeChanges: true
    })
  }

  handleQueuePartsChanges(e) {
    e.preventDefault()
    this.setState({
      submitPartsAsIds: this.state.tempPartsAsIds,
      submitPartsValuesForDisplay: this.state.tempPartsValuesForDisplay,
      displayModalForSearch: !this.state.displayModalForSearch,
      madeChanges: true
    })
  }

  handleCancelPartsChanges(e) {
    e.preventDefault();
    this.setState({
      tempPartsAsIds: this.state.submitPartsAsIds,
      tempPartsValuesForDisplay: this.state.submitPartsValuesForDisplay,
      displayModalForSearch: !this.state.displayModalForSearch,
      madeChanges: false
    })
  }

  toggleDialogState() {
    this.setState({ toggleDialog: !this.state.toggleDialog })
  }

  render() {
    const { 
      madeChanges, use_fixed_labor_rate, relatedPartsTableIsLoaded, 
      submitPartsAsIds, submitPartsValuesForDisplay, 
      tempPartsValuesForDisplay, categories, 
      displayModalForSearch, tempPartsAsIds,
      globalMarkup, formFieldErrors, formFieldErrorMsgs, toggleDialog, dialogMsg
    } = this.state;

    const { tableNumLinks } = this.props;
    
    const {
      taskId: taskIdErr,
      taskName: taskNameErr,
      fixedLabor: fixedLaborErr
    } = formFieldErrors;
    const { 
      taskId: taskIdMsg,
      taskName: taskNameMsg,
      fixedLabor: fixedLaborMsg 
    } = formFieldErrorMsgs;

    const taskIdErrorMsg = taskIdErr ?
      <p style={fieldErrorInlineMsgStyle}>{taskIdMsg}</p>
      : '';

    const taskNameErrorMsg = taskNameErr ?
      <p style={fieldErrorInlineMsgStyle}>{taskNameMsg}</p>
      : '';

    const fixedLaborErrorMsg = fixedLaborErr ?
      <p style={fieldErrorInlineMsgStyle}>{fixedLaborMsg}</p>
      : '';

    const searchTableConfigProps = {
      extraColHeaders: '',
      extraRowProps: undefined,
      extraPropsLayout: null
    }

    const displayFixedLaborRate = use_fixed_labor_rate ?
      <div style={horizontalLayoutStyle}>
        <Input
          type={'text'}
          className={fixedLaborErr ? 'error' : ''}
          title={'Fixed Labor Rate'}
          value={this.state.fixed_labor_rate}
          handleChange={this.handleFixedLaborRate}
          style={fixedLaborErr ? fieldErrorStyle : null}
        />
        {fixedLaborErrorMsg} 
      </div> : '';

    const relatedPartsTableChangesText = madeChanges ? <b>Parts have been changed. Submit changes to save.</b> : '';
    const filteredSubmitPartsValues = (globalMarkup.length > 0 && submitPartsValuesForDisplay.length > 0) ? this.filterRelatedPartsTableData(submitPartsValuesForDisplay) : '';

    const relatedPartsTable = (relatedPartsTableIsLoaded) ?
      <Table
        tableId={'initial-parts-table'}
        data={filteredSubmitPartsValues}
        fetchType={'parts'}
        headerText={`There are ${ submitPartsAsIds.length } parts connected to this task`}
        numberOfLinks={tableNumLinks}
      /> : 'There are no parts connected to this task.';


    const removeItemButton = <Button key={1} action={this.handleRemovePartIdAndValues} title={'Remove'} type={'primary'} />;
    const removeAllItemsButton = <Button action={this.handleRemoveAllItems} title={'Remove all Parts'} type={'primary'} />;
    const quantityInput = <Input key={0} type={'text'} handleChange={this.handlePartQuantityChange} style={{'width': '50%'}} />;

    // this table holds temporary changes made
    const filteredTempPartsValues = (globalMarkup.length > 0 && tempPartsValuesForDisplay.length > 0) ? this.filterRelatedPartsTableData(tempPartsValuesForDisplay): '';
    const displayRemoveAllItemsButton = (filteredTempPartsValues.length > 0) ? removeAllItemsButton : '';

    const displayPartsSelectedTable = (tempPartsValuesForDisplay.length > 0) ? 
      <div>
        <Table
          tableId={'related-items-table'}
          data={filteredTempPartsValues}
          fetchType={'parts'}
          headerText={'Parts already in task or selected: '}
          extraColHeaders={['Change Quantity', 'Action']}
          extraRowProps={[quantityInput, removeItemButton]}
          extraPropsLayout={'separate'}
          numberOfLinks={tableNumLinks}
        />
        {displayRemoveAllItemsButton}
        <br/>
      </div> : <p>No parts selected</p>;


    const searchForChild = displayModalForSearch ?
      <Modal
        handleCloseModal={this.handleDisplayModalForSearch}
        headerText={'Search for Parts'}
        actionType={'edit'}
      >
        <SearchComponent 
          searchType={this.props.searchTypeForChild} // should get from parents
          handleAddItem={this.handleAddPart}
          tableConfigProps={searchTableConfigProps}
        />
        {displayPartsSelectedTable}
        <Button 
          type={'primary'}
          title={'Continue'}
          action={this.handleQueuePartsChanges}
        />
        <Button 
          type={'primary'}
          title={'Cancel Changes'}
          action={this.handleCancelPartsChanges}
        />
      </Modal>: '';


    const displayMessageDialog = toggleDialog ?
      <DialogModal
        dialogText={`${dialogMsg}`}
        handleCloseDialog={this.toggleDialogState}
      />
      : '';

    return (
      <div>
        <form>
          <Input
            readOnly
            type={'text'}
            title={'ID'}
            value={this.state.id}
          />

          <div style={horizontalLayoutStyle}>
            <Input
              type={'text'}
              className={taskIdErr ? 'error' : ''}
              title={'Task ID'}
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
            rows={5}
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


          <Select
            title={'Task Tag Types'}
            value={this.state.tag_types_as_values}
            options={this.state.tag_types_choices}
            handleChange={this.handleTagTypesChange}
          />

          <Input
            readOnly
            title={'Category'}
            value={this.state.categories}
            style={{ width: '20%'}}
          />

          <Input 
            type={'text'}
            title={'Estimated Contractor Hours'}
            value={this.state.estimated_contractor_hours}
            handleChange={this.handleEstContractorHours}
          />

          <Input 
            type={'text'}
            title={'Estimated Contractor Minutes'}
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

          <Checkbox
            title={'Task Active'}
            checked={this.state.is_active}
            handleChange={this.handleIsActiveChecked}
          />
          {relatedPartsTableChangesText}
          {relatedPartsTable}

        </form>

        <Button
          type={'primary'}
          title={'Add or remove parts to this task'}
          action={this.handleDisplayModalForSearch}
        />

        {searchForChild}

        <div>
          <Button
            type={'primary'}
            title={'Submit Changes'}
            action={this.handleSubmitChanges}
          />

          <Button
            type={'primary'}
            title={'Cancel'}
            action={this.handleCancelEdit}
          />
        </div>
        {displayMessageDialog}

      </div>
    )
  }
}

export default TaskFormFields;
