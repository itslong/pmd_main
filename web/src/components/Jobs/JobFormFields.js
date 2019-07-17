import React, { Component } from 'react';

import { Input, Button, TextArea, Checkbox, Select, Table } from '../common';
import Modal from '../Modal';
import SearchComponent from '../SearchComponent';
import { UpdateJobAndRelatedCategories, FetchTagTypesChoices, CSRFToken } from '../endpoints';
import { JOBS_DISPLAY_PATH } from '../frontendBaseRoutes';
import { renameStaticTableFields } from '../fieldNameAliases';
import DialogModal from '../DialogModal';


class JobFormFields extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    const categoriesIdsArr = this.convertCategoriesToIds(data.categories);

    this.state= {
      id: data.id,
      job_id: data.job_id,
      job_name: data.job_name || '',
      job_desc: data.job_desc || '',
      is_active: data.is_active,
      ordering_num: data.ordering_num || '',
      categories: data.categories || [],
      jobNameOptions: [],
      relatedCategoriesTableIsLoaded: true,
      handleDisplayModalForSearch: false,
      submitCategoriesAsIds: categoriesIdsArr,
      tempCategoriesAsIds: categoriesIdsArr,
      submitCategoriesValuesForDisplay: data.categories,
      tempCategoriesValuesForDisplay: data.categories,
      toggleLoadNewData: false,
      madeChanges: false,
      toggleDialog: false,
      dialogMsg: '',
    };

    this.handleJobId = this.handleJobId.bind(this);
    this.handleJobName = this.handleJobName.bind(this);
    this.handleJobDesc = this.handleJobDesc.bind(this);
    this.handleOrderingNum = this.handleOrderingNum.bind(this);
    this.handleIsActiveChecked = this.handleIsActiveChecked.bind(this);
  
    this.handleDisplayModalForSearch = this.handleDisplayModalForSearch.bind(this);

    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.handleRemoveCategoryIdAndValues = this.handleRemoveCategoryIdAndValues.bind(this);
    
    this.handleRemoveAllItems = this.handleRemoveAllItems.bind(this);
    this.handleQueueJobChanges = this.handleQueueJobChanges.bind(this);
    this.handleCancelCategoryChanges = this.handleCancelCategoryChanges.bind(this);

    this.handleSubmitChanges = this.handleSubmitChanges.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.toggleDialogState = this.toggleDialogState.bind(this);
  }

  componentDidMount() {
    let tags = FetchTagTypesChoices();
    tags.then(tagsChoices => {
      this.setState({ jobNameOptions: tagsChoices });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.toggleLoadNewData !== this.state.toggleLoadNewData) {
      const { fetchRoute } = this.props;

      fetchRoute(this.state.id).then(newData => {
        const cleanCategoriesIds = newData.categories.map(obj => {
          return obj.id;
        });

        this.setState({
          id: newData.id,
          category_id: newData.category_id,
          category_name: newData.category_name,
          category_desc: newData.category_desc,
          jobs: newData.categories || [],
          is_active: newData.is_active,
          submitCategoriesAsIds: cleanCategoriesIds,
          tempCategoriesAsIds: cleanCategoriesIds,
          submitCategoriesValuesForDisplay: newData.categories,
          tempCategoriesValuesForDisplay: newData.categories,
          relatedCategoriesTableIsLoaded: true,
          madeChanges: false,
        });
      });
    }
  }

  convertCategoriesToIds(categoriesArr) {
    const categoriesAsIds = categoriesArr.map(obj => {
      return obj.id;
    });
    return categoriesAsIds;
  }

  filterRelatedCategoriesTableData(categoriesArr) {
    const { searchTypeForChild } = this.props;
    return renameStaticTableFields(categoriesArr, 'job', 'child');
  }

  getFormDataFromState() {
    const {
      id,
      categories,
      relatedCategoriesTableIsLoaded,
      handleDisplayModalForSearch,
      tempCategoriesAsIds,
      submitCategoriesValuesForDisplay,
      tempCategoriesValuesForDisplay,
      toggleLoadNewData,
      madeChanges,
      submitCategoriesAsIds: categories_set,
      jobNameOptions,
      dialogMsg,
      toggleDialog,
      ...stateData
    } = this.state;

    const formData = Object.assign(stateData, {'categories_set': categories_set});
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

  handleIsActiveChecked(e) {
    this.setState({ is_active: e.target.checked });
  }

  handleDisplayModalForSearch() {
    this.setState({ displayModalForSearch: !this.state.displayModalForSearch });
  }

  handleAddCategory(categoryData) {
    const { tempCategoriesAsIds, tempCategoriesValuesForDisplay } = this.state;
    const { id, category_id, category_name, category_desc } = categoryData;

    if (tempCategoriesAsIds.includes(id)) {
      return this.setState({
        toggleDialog: !this.state.toggleDialog,
        dialogMsg: `${category_name} has already been added.`
      })
    }

    const newCategoryToAdd = Object.assign({}, {
      id,
      category_id,
      category_name,
      category_desc
    });

    this.setState({
      tempCategoriesAsIds: [...tempCategoriesAsIds, id],
      tempCategoriesValuesForDisplay: [...tempCategoriesValuesForDisplay, newCategoryToAdd]
    });
  }

  handleRemoveCategoryIdAndValues(e) {
    const { tempCategoriesAsIds, tempCategoriesValuesForDisplay } = this.state;

    const idToRemove = parseInt(e.target.id);

    const updatedCategoriesValuesForDisplay = tempCategoriesValuesForDisplay.filter(item => {
      return item.id != idToRemove;
    });

    const updatedCategoriesAsIds = tempCategoriesAsIds.filter(categoryId => {
      return categoryId != idToRemove;
    });

    this.setState({
      tempCategoriesAsIds: updatedCategoriesAsIds,
      tempCategoriesValuesForDisplay: updatedCategoriesValuesForDisplay
    });
  }

  handleRemoveAllItems() {
    this.setState({
      tempCategoriesAsIds: [],
      tempCategoriesValuesForDisplay: [],
      madeChanges: true
    });
  }

  handleQueueJobChanges() {
    this.setState({
      submitCategoriesAsIds: this.state.tempCategoriesAsIds,
      submitCategoriesValuesForDisplay: this.state.tempCategoriesValuesForDisplay,
      displayModalForSearch: !this.state.displayModalForSearch,
      madeChanges: true
    });
  }

  handleCancelCategoryChanges() {
    this.setState({
      tempCategoriesAsIds: this.state.submitCategoriesAsIds,
      tempCategoriesValuesForDisplay: this.state.submitCategoriesValuesForDisplay,
      displayModalForSearch: !this.state.displayModalForSearch,
      madeChanges: false
    });
  }

  handleSubmitChanges(e) {
    e.preventDefault();
    const { id } = this.state;
    const formData = this.getFormDataFromState();

    const submitted = UpdateJobAndRelatedCategories(id, formData);
    submitted.then(() => {
      this.setState({
        relatedCategoriesTableIsLoaded: false,
        toggleLoadNewData: !this.state.toggleLoadNewData,
        dialogMsg: 'Successfully updated.'
      }, () => {
        this.toggleDialogState();
      });
    });
  }

  handleCancelEdit(e) {
    e.preventDefault();
    this.props.history.push(JOBS_DISPLAY_PATH);
  }

  toggleDialogState() {
    this.setState({ toggleDialog: !this.state.toggleDialog })
  }

  render() {
    const {
      relatedCategoriesTableIsLoaded, tempCategoriesValuesForDisplay,
      displayModalForSearch, submitCategoriesValuesForDisplay,
      is_active, submitCategoriesAsIds, madeChanges, toggleDialog, dialogMsg
    } = this.state;

    const { tableNumLinks } = this.props;

    const renamedSubmitCategoriesValues = this.filterRelatedCategoriesTableData(submitCategoriesValuesForDisplay);
    const renamedTempCategoriesValues = this.filterRelatedCategoriesTableData(tempCategoriesValuesForDisplay);

    const relatedCategoriesTableChanges = madeChanges ? <b>Categories have been changed but not saved. Submit changes to save.</b> : '';
    const relatedCategoriesTable = relatedCategoriesTableIsLoaded ?
       <Table
        tableId={'initial-tasks-table'}
        data={renamedSubmitCategoriesValues}
        fetchType={'categories'}
        headerText={`There are ${submitCategoriesAsIds.length} categories connected to this job.`}
        numberOfLinks={tableNumLinks}
      /> : 'There are no categories connected to this job.';

    const removeItemButton = <Button key={1} action={this.handleRemoveCategoryIdAndValues} title={'Remove'} type={'primary'} />;
    const removeAllItemsButton = <Button action={this.handleRemoveAllItems} title={'Remove all Categories'} type={'primary'} />;

    const displayRemoveAllItemsButton = (tempCategoriesValuesForDisplay.length > 0) ? removeAllItemsButton : '';

    const displayCategoriesSelectedTable = (tempCategoriesValuesForDisplay.length > 0) ? 
      <div>
        <Table
          tableId={'related-items-table'}
          data={renamedTempCategoriesValues}
          fetchType={'categories'}
          headerText={'Categories already in job or selected: '}
          extraColHeaders={['Action']}
          extraRowProps={[removeItemButton]}
          extraPropsLayout={'separate'}
          numberOfLinks={tableNumLinks}
        />
        {displayRemoveAllItemsButton}
      </div> : <p>No categories selected</p>;


    const searchTableConfigProps = {
      extraColHeaders: '',
      extraRowProps: undefined,
      extraPropsLayout: null
    };

    const searchForChild = displayModalForSearch ?
      <Modal
        handleCloseModal={this.handleDisplayModalForSearch}
        headerText={'Search for Categories'}
        actionType={'edit'}
      >
        <SearchComponent 
          searchType={this.props.searchTypeForChild}
          handleAddItem={this.handleAddCategory}
          tableConfigProps={searchTableConfigProps}
        />
        {displayCategoriesSelectedTable}
        <Button 
          type={'primary'}
          title={'Continue'}
          action={this.handleQueueJobChanges}
        />
        <Button 
          type={'primary'}
          title={'Cancel Changes'}
          action={this.handleCancelCategoryChanges}
        />
      </Modal>: '';

    const displayMessageDialog = toggleDialog ?
      <DialogModal
        dialogText={dialogMsg}
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

          <Input
            type={'text'}
            title={'Job ID'}
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
            value={this.state.ordering_num}
            handleChange={this.handleOrderingNum}
          />

          <Checkbox
            title={'Job Active'}
            checked={this.state.is_active}
            handleChange={this.handleIsActiveChecked}
          />

          {relatedCategoriesTableChanges}
          {relatedCategoriesTable}

        </form>

        <Button
          type={'primary'}
          title={'Add or remove categories to this job'}
          action={this.handleDisplayModalForSearch}
        />

        {searchForChild}

        <div>
          <Button
            type={'submitBtn'}
            title={'Submit Changes'}
            action={this.handleSubmitChanges}
          />

          <Button
            type={'clearBtn'}
            title={'Cancel'}
            action={this.handleCancelEdit}
          />
        </div>
        {displayMessageDialog}
      </div>
    )
  }

}

export default JobFormFields;
