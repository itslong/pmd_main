import React, { Component } from 'react';

import { Input, Button, TextArea, Checkbox, Table } from '../common';
import Modal from '../Modal';
import SearchComponent from '../SearchComponent';
import { UpdateCategoryAndRelatedTasks, CSRFToken } from '../endpoints';
import { CATEGORIES_DISPLAY_PATH } from '../frontendBaseRoutes';
import { renameStaticTableFields } from '../fieldNameAliases';
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


class CategoryFormFields extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const tasksIdsArr = this.convertTasksToIds(data.tasks);


    this.state = {
      id: data.id,
      category_id: data.category_id,
      category_name: data.category_name || '',
      category_desc: data.category_desc || '',
      is_active: data.is_active,
      jobs: data.jobs.job_name || 'No job attached to this category',
      relatedTasksTableIsLoaded: true,
      displayModalForSearch: false,
      submitTasksAsIds: tasksIdsArr,
      tempTasksAsIds: tasksIdsArr,
      submitTasksValuesForDisplay: data.tasks, 
      tempTasksValuesForDisplay: data.tasks,
      toggleLoadNewData: false,
      madeChanges: false,
      formFieldErrors: {
        categoryId: false,
        categoryName: false,
      },
      formFieldErrorMsgs: {
        categoryId: '',
        categoryName: '',
      },
      formValid: false,
    };

    this.handleCategoryId = this.handleCategoryId.bind(this);
    this.handleCategoryName = this.handleCategoryName.bind(this);
    this.handleCategoryDesc = this.handleCategoryDesc.bind(this);
    this.handleIsActiveChecked = this.handleIsActiveChecked.bind(this);

    this.handleDisplayModalForSearch = this.handleDisplayModalForSearch.bind(this);
    this.handleAddTask = this.handleAddTask.bind(this);
    this.handleRemoveAllItems = this.handleRemoveAllItems.bind(this);
    this.handleRemoveTaskIdAndValues = this.handleRemoveTaskIdAndValues.bind(this);

    this.handleQueueTaskChanges = this.handleQueueTaskChanges.bind(this);
    this.handleCancelTaskChanges = this.handleCancelTaskChanges.bind(this);

    this.handleSubmitChanges = this.handleSubmitChanges.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.toggleLoadNewData !== this.state.toggleLoadNewData) {
      const { fetchRoute } = this.props;

      fetchRoute(this.state.id).then(newData => {
        const cleanTaskIds = newData.tasks.map(obj => {
          return obj.id;
        });

        this.setState({
          id: newData.id,
          category_id: newData.category_id,
          category_name: newData.category_name,
          category_desc: newData.category_desc,
          jobs: newData.jobs.job_name || 'No job attached to this category',
          is_active: newData.is_active,
          submitTasksAsIds: cleanTaskIds,
          tempTasksAsIds: cleanTaskIds,
          submitTasksValuesForDisplay: newData.tasks,
          tempTasksValuesForDisplay: newData.tasks,
          relatedTasksTableIsLoaded: true,
          madeChanges: false
        });
      })
    }
  }

  convertTasksToIds(tasksArr) {
    const tasksAsIds = tasksArr.map(obj => {
      return obj.id;
    });
    return tasksAsIds;
  }

  filterRelatedTasksTableData(tasksArr) {
    return renameStaticTableFields(tasksArr, 'category', 'child');
  }

  handleSubmitChanges(e) {
    e.preventDefault();
    const formValid = this.validateFormState();
    if (!formValid) {
      return;
    }

    const { id, submitTasksValuesForDisplay, toggleLoadNewData } = this.state;

    const formData = this.getFormDataFromState();

    const submitted = UpdateCategoryAndRelatedTasks(id, formData);
    submitted.then(() => {
      this.setState({
        relatedTasksTableIsLoaded: false,
        toggleLoadNewData: !toggleLoadNewData
      });
    });
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
      id,
      jobs,
      relatedTasksTableIsLoaded,
      displayModalForSearch,
      tempTasksAsIds,
      submitTasksValuesForDisplay,
      tempTasksValuesForDisplay,
      toggleLoadNewData,
      madeChanges,
      submitTasksAsIds: tasks_set,
      formFieldErrors,
      formFieldErrorMsgs,
      formValid,
      ...stateData
    } = this.state;

    const formData = Object.assign(stateData, {'tasks_set': tasks_set});
    return formData;
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

  handleIsActiveChecked(e) {
    this.setState({ is_active: e.target.checked });
  }

  handleDisplayModalForSearch(e) {
    e.preventDefault();
    this.setState({ displayModalForSearch: !this.state.displayModalForSearch });
  }

  handleAddTask(taskData) {
    const { tempTasksAsIds, tempTasksValuesForDisplay } = this.state;
    if (tempTasksAsIds.includes(taskData.id)) {
      // TODO: display a message in a small modal
      return null;
    }

    const { id, task_id, task_name, task_attribute } = taskData;
    
    const newTaskToAdd = Object.assign({}, {
      id,
      task_id,
      task_name,
      task_attribute,
    });

    this.setState({
      tempTasksAsIds: [...tempTasksAsIds, id],
      tempTasksValuesForDisplay: [...tempTasksValuesForDisplay, newTaskToAdd]
    });
  }

  handleRemoveTaskIdAndValues(e) {
    const { tempTasksAsIds, tempTasksValuesForDisplay } = this.state;

    let idToRemove = parseInt(e.target.id);

    const updatedTasksValuesForDisplay = tempTasksValuesForDisplay.filter(item => {
      return item.id != idToRemove;
    });

    const updatedTasksAsIds = tempTasksAsIds.filter(taskId => {
      return taskId != idToRemove;
    });

    this.setState({
      tempTasksAsIds: updatedTasksAsIds,
      tempTasksValuesForDisplay: updatedTasksValuesForDisplay
    });
  }

  handleRemoveAllItems() {
    this.setState({
      tempTasksAsIds: [],
      tempTasksValuesForDisplay: [],
      madeChanges: true,
    })
  }

  handleQueueTaskChanges() {
    this.setState({
      submitTasksAsIds: this.state.tempTasksAsIds,
      submitTasksValuesForDisplay: this.state.tempTasksValuesForDisplay,
      displayModalForSearch: !this.state.displayModalForSearch,
      madeChanges: true
    });
  }

  handleCancelTaskChanges() {
    this.setState({
      tempTasksAsIds: this.state.submitTasksAsIds,
      tempTasksValuesForDisplay: this.state.submitTasksValuesForDisplay,
      displayModalForSearch: !this.state.displayModalForSearch,
      madeChanges: false
    });
  }

  handleCancelEdit(e) {
    e.preventDefault();
    this.props.history.push(CATEGORIES_DISPLAY_PATH);
  }

  render() {
    const { 
      relatedTasksTableIsLoaded, tempTasksValuesForDisplay,
      displayModalForSearch, submitTasksValuesForDisplay,
      is_active, submitTasksAsIds, madeChanges, formFieldErrors, formFieldErrorMsgs
    } = this.state;

    const { categoryId: catIdErr, categoryName: catNameErr } = formFieldErrors;
    const { categoryId: catIdMsg, categoryName: catNameMsg } = formFieldErrorMsgs;

    const renamedTempTasksValues = this.filterRelatedTasksTableData(tempTasksValuesForDisplay);
    const renamedSubmitTasksValues = this.filterRelatedTasksTableData(submitTasksValuesForDisplay);
    // Table currently holds the related data. When changes made, another Table holds the changes.
    // Future: can push data into a single table instead of using two tables.
    const relatedTasksTableChanges = madeChanges ?  <b>Tasks have been changed but not saved. Submit changes to save.</b> : '';
    const relatedTasksTable = relatedTasksTableIsLoaded ?
       <Table
        tableId={'initial-tasks-table'}
        data={renamedSubmitTasksValues}
        fetchType={'tasks'}
        headerText={`There are ${submitTasksAsIds.length} tasks connected to this category`}
        numberOfLinks={this.props.tableNumLinks}
      /> : 'There are no tasks connected to this category.';

    const removeItemButton = <Button key={1} action={this.handleRemoveTaskIdAndValues} title={'Remove'} type={'primary'} />;
    const removeAllItemsButton = <Button action={this.handleRemoveAllItems} title={'Remove all Tasks'} type={'primary'} />;


    const displayRemoveAllItemsButton = (tempTasksValuesForDisplay.length > 0) ? removeAllItemsButton : '';

    const displayTasksSelectedTable = (tempTasksValuesForDisplay.length > 0) ? 
      <div>
        <Table
          tableId={'related-items-table'}
          data={renamedTempTasksValues}
          fetchType={'tasks'}
          headerText={'Tasks already in category or selected: '}
          extraColHeaders={['Action']}
          extraRowProps={[removeItemButton]}
          extraPropsLayout={'separate'}
          numberOfLinks={this.props.tableNumLinks}
        />
        {displayRemoveAllItemsButton}
      </div> : 'No tasks selected';


    const searchTableConfigProps = {
      extraColHeaders: '',
      extraRowProps: undefined,
      extraPropsLayout: null
    };

    const searchForChild = displayModalForSearch ?
      <Modal
        handleCloseModal={this.handleDisplayModalForSearch}
        headerText={'Search for Tasks'}
        actionType={'edit'}
      >
        <SearchComponent 
          searchType={this.props.searchTypeForChild}
          handleAddItem={this.handleAddTask}
          tableConfigProps={searchTableConfigProps}
        />
        {displayTasksSelectedTable}
        <Button 
          type={'primary'}
          title={'Continue'}
          action={this.handleQueueTaskChanges}
        />
        <Button 
          type={'primary'}
          title={'Cancel Changes'}
          action={this.handleCancelTaskChanges}
        />
      </Modal>: '';

    const catIdErrorMsg = catIdErr ?
      <p style={fieldErrorInlineMsgStyle}>{catIdMsg}</p>
      : '';

    const catNameErrorMsg = catNameErr ?
      <p style={fieldErrorInlineMsgStyle}>{catNameMsg}</p>
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
              className={catIdErr ? 'error' : ''}
              title={'Category ID'}
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

          <Checkbox
            title={'Category Active'}
            checked={this.state.is_active}
            handleChange={this.handleIsActiveChecked}
          />

          <Input
            readOnly
            type={'text'}
            title={'Job Name'}
            value={this.state.jobs}
            style={{ width: '25%' }}
          />
          {relatedTasksTableChanges}
          {relatedTasksTable}

        </form>

        <Button
          type={'primary'}
          title={'Add or remove tasks to this category'}
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


export default CategoryFormFields;
