import React, { Component } from 'react';

import { Input, Button, TextArea, Checkbox, Table, Select } from '../common';
import Modal from '../Modal';
import SearchComponent from '../SearchComponent';
import { UpdateTaskRelatedPartsSubmit, FetchGlobalMarkup, CSRFToken } from '../endpoints';
import { TASKS_DISPLAY_PATH } from '../frontendBaseRoutes';
import { renameAndRebuildRelatedPartsDisplayFields } from '../CalculationsWithGlobalMarkup';
import { 
  taskDetailRelatedPartsTableFields,
  taskRelatedPartsSearchResultsTableFields,
} from '../fieldNameAliases';

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
      categories: data.categories.category_name || 'No category selected.',
      tag_types_as_values: data.tag_types,
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
          tag_types: newData.tag_types.id,
          tag_types_as_values: newData.tag_types,
          tag_types_choices: tagTypesChoices,
          estimated_contractor_hours: newData.estimated_contractor_hours,
          estimated_contractor_minutes: newData.estimated_contractor_minutes,
          estimated_asst_hours: newData.estimated_asst_hours,
          estimated_asst_minutes: newData.estimated_asst_minutes,
          use_fixed_labor_rate: newData.use_fixed_labor_rate,
          fixed_labor_rate: newData.fixed_labor_rate,
          is_active: newData.is_active,
          categories: newData.categories.category_name || 'No category selected.',
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
    const { id: task_id, submitPartsValuesForDisplay, toggleLoadNewData, tag_types } = this.state;
    const filteredPartsData = submitPartsValuesForDisplay.map(({ id: part_id, quantity }) => {
      return {
        task: task_id,
        part: part_id,
        quantity,
      }
    });

    const submitted = UpdateTaskRelatedPartsSubmit(task_id, filteredPartsData)
    submitted.then((results) => {
      if (results === 'Success') {
        const formData = this.getFormDataFromState();

        let update = this.props.updateRoute(task_id, formData);
        update.then(() => {
          this.setState({
            relatedPartsTableIsLoaded: false,
            toggleLoadNewData: !toggleLoadNewData
          });
        })
      }
    })
  }

  getFormDataFromState() {
    const { 
      id,
      category,
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
      ...formData
    } = this.state;

    return formData;
  }

  handleCancelEdit(e) {
    e.preventDefault();
    this.props.history.push(TASKS_DISPLAY_PATH);
  }

  handleTaskId(e) {
    this.setState({ task_id: e.target.value });
  }

  handleTaskName(e) {
    this.setState({ task_name: e.target.value });
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

    console.log('changed tags: ', e.target.value, tagTypeId)

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
    this.setState({
      use_fixed_labor_rate: e.target.checked,
      fixed_labor_rate: 0
    });
  }

  handleFixedLaborRate(e) {
    this.setState({ fixed_labor_rate: e.target.value });
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
    if (tempPartsAsIds.includes(partData.id)) {
      // TODO: display message to user somewhere part is ialready in array
      return null;
    }

    const { id, master_part_num, part_name, part_base_part_cost, part_retail_part_cost } = partData;
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

  render() {
    const { 
      madeChanges, use_fixed_labor_rate, relatedPartsTableIsLoaded, 
      submitPartsAsIds, submitPartsValuesForDisplay, 
      tempPartsValuesForDisplay, categories, 
      displayModalForSearch, tempPartsAsIds,
      globalMarkup
    } = this.state;

    const { tableNumLinks } = this.props;

    const tagTypeOptionValue = this.state.tag_types_as_values.tag_name || '';

    const searchTableConfigProps = {
      extraColHeaders: '',
      extraRowProps: undefined,
      extraPropsLayout: null
    }

    const displayFixedLaborRate = use_fixed_labor_rate ? 
      <Input 
        type={'text'}
        title={'Fixed Labor Rate'}
        value={this.state.fixed_labor_rate}
        handleChange={this.handleFixedLaborRate}
      /> : '';

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
      </div> : 'No parts selected';


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

    return (
      <div>
        <form>
          <Input
            readOnly
            type={'text'}
            title={'ID'}
            value={this.state.id}
          />

          <Input 
            type={'text'}
            title={'Task ID'}
            value={this.state.task_id}
            handleChange={this.handleTaskId}
          />

          <Input 
            type={'text'}
            title={'Task Name'}
            value={this.state.task_name}
            handleChange={this.handleTaskName}
          />

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
            value={tagTypeOptionValue}
            options={this.state.tag_types_choices}
            handleChange={this.handleTagTypesChange}
          />

          <Input
            readOnly
            title={'Category'}
            value={this.state.categories}
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


      </div>
    )
  }
}

export default TaskFormFields;
