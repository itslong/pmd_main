import React, { Component, cloneElement, Children, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { Input, Button, Table, TableRowWithButtons, TableRowWithCheckbox, Modal, Dialog, activeButtonStyle } from './common';
import { editPathWithId, itemPathWithId } from './frontendBaseRoutes';
import Pager from './Pager';
import SearchComponent from './SearchComponent';
import { FetchGlobalMarkup } from './endpoints';
import { renameAndRebuildMainDisplayFields } from './CalculationsWithGlobalMarkup';
import { renameStaticTableFields } from './fieldNameAliases';
import { IsAuthContext } from './AppContext';
import { sortItems } from './helpers';
import SortDisplay from './SortDisplay';
import Filter from './Filter';


class DisplayComponent extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      itemId: '',
      itemName: '',
      showActionModal: false,
      itemEditing: false,
      showDialog: false,
      actionType: '', // 'edit' or 'delete',
      editType: this.props.editType, // 'modal' or 'route'
      displayType: this.props.displayType, // 'parts', 'tasks', etc. passed to Table.
      totalItemsCount: 0,
      totalPages: 0,
      nextPage: '',
      previousPage: '',
      currentPageSize: this.props.initPageSize || 10,
      currentPageNum: this.props.initPageNum || 1,
      displaySearchResults: false,
      globalMarkup: [],
      isPaging: false, // determines if paging and page size used in fetch.
      isSorted: false,
      sortBy: '', // 'name', 'value', etc. See SortDisplay.
      sortAsc: true, //false = desc
      toggleSearchReload: false, // parts only for now. All non-part edits are not in modal.
      filterBy: '', //'plubming', 'water_heater', etc. See Filter for values
      isFiltered: false,
    };

    // this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickEditInModal = this.handleClickEditInModal.bind(this);
    this.handleClickEditByRoute = this.handleClickEditByRoute.bind(this);

    this.handleshowActionModal = this.handleshowActionModal.bind(this);
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);

    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleItemEdit = this.handleItemEdit.bind(this);

    this.handleShowDialog = this.handleShowDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);

    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    this.handlePageSizeLimitClick = this.handlePageSizeLimitClick.bind(this);
    this.handlePageNav = this.handlePageNav.bind(this);
    this.displaySearchData = this.displaySearchData.bind(this);
    this.toggleSearchReloadState = this.toggleSearchReloadState.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.handleConfirmDeleteItem = this.handleConfirmDeleteItem.bind(this);
    this.updateSortState = this.updateSortState.bind(this);
    this.resetSortState = this.resetSortState.bind(this);

    this.changeFilter = this.changeFilter.bind(this);
    this.resetFilter = this.resetFilter.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { initFetch, initDataKeyToParse, initPageSize, initPageNum } = this.props;

    let getAllData = Promise.all([
      initFetch(initPageNum, initPageSize),
      FetchGlobalMarkup()
    ]);

    getAllData.then((data) => {
      if (data[0].error || data[1].error) {
        this.context.updateAuth();
        return Promise.reject('Session expired.');
      }

      return data;
    })
    .then(([data, markupData]) => {
      if (this._isMounted) {
        this.setState({
          items: data[initDataKeyToParse],
          isLoaded: true,
          totalItemsCount: data.count,
          totalPages: data.total_pages,
          nextPage: data.next,
          previousPage: data.previous,
          globalMarkup: markupData
        });        
      }
    })
    .catch(error => {
      console.log('error: ', error);
      return error;
    });
  }

  componentDidUpdate(prevProps, prevState) {
    let { itemEditing, isLoaded, currentPageNum, currentPageSize, isPaging, sortBy, sortAsc, filterBy, isFiltered } = this.state;
 
    if (itemEditing !== prevState.itemEditing || (prevState.isLoaded === true && isLoaded == false) || filterBy !== prevState.filterBy) {
      const { initFetch, initDataKeyToParse, initPageNum, initPageSize} = this.props;

      // only reset page num and init page when filter values change from one to another.
      if (filterBy && prevState.filterBy !== filterBy) {
        currentPageNum = initPageNum;
        currentPageSize = initPageSize;
      }

      const endpoint = isPaging || isFiltered ?
        initFetch(currentPageNum, currentPageSize, filterBy)
        : initFetch();

      const newPageSize = isPaging ? currentPageSize : initPageSize;
      const newPageNum = isPaging ? currentPageNum : initPageNum;

      endpoint.then(data => {

        this.setState({
          items: data[initDataKeyToParse],
          nextPage: data.next,
          previousPage: data.previous,
          // itemEditing: false,
          actionType: '',
          totalItemsCount: data.count,
          totalPages: data.total_pages,
          currentPageSize: newPageSize,
          currentPageNum: newPageNum,
          isPaging: false,
        });
      })
      .then(() => {
        this.setState({
          isLoaded: true,
        });
      })
    }

    if (sortAsc !== prevState.sortAsc || sortBy !== prevState.sortBy) {
      this.filterOutputData();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  filterOutputData() {
    const { items, globalMarkup, isSorted, sortBy, sortAsc } = this.state;
    const { mainDisplayFields, calculationFields, displayType } = this.props;

    const renamedData = displayType === 'parts' || displayType === 'tasks' ?
      renameAndRebuildMainDisplayFields(displayType, items, globalMarkup, mainDisplayFields, calculationFields)
      : renameStaticTableFields(items, displayType, 'display');

    const displayData = sortBy !== '' ? sortItems(displayType, sortBy, sortAsc, renamedData) : renamedData;

    return displayData;
  }

  handleClickEditByRoute(e) {
    const id = e.target.id;

    const nextPath = editPathWithId(id, this.state.displayType);
    const detailPath = itemPathWithId(id, this.state.displayType);
    this.props.history.push(nextPath, {
      itemId: id,
      detailPath
    });
  }

  handleClickEditInModal(e) {
    this.setState({
      itemId: e.target.id,
      showActionModal: true,
      actionType: 'edit',
    })
  }

  handleshowActionModal() {
    this.setState({ showActionModal: true });
  }

  handleCloseEditModal() {
    // e.preventDefault();
    this.setState({ 
      showActionModal: false,
      itemId: '',
      itemName: '',
      actionType: '',
    });
  }

  handleClickDelete(e) {
    const { displayType } = this.state;

    const itemId = e.target.id;
    const item = this.getItemById(itemId);

    const singleName = singularizeItemNames[displayType];
    const fullName = singleName + '_name';
    const itemName = item[fullName];

    this.setState({
      itemId,
      itemName,
      showActionModal: true,
      actionType: 'delete'
    })
  }

  getItemById(id) {
    const { items } = this.state;

    const itemObj = items.find(item => {
      if (item.id == id) {
        return item
      }
    });

    return itemObj;
  }

  handleItemEdit() {
    this.setState({ 
      itemEditing: !this.state.itemEditing,
      itemId: '',
     })
  }

  handleShowDialog() {
    this.setState({ showDialog: true })
  }

  handleCloseDialog() {
    this.setState({ 
      showDialog: false,
    })
  }

  handlePreviousPageClick() {
    const { currentPageNum } = this.state;

    if (currentPageNum > 1) {
      this.setState({ 
        currentPageNum: currentPageNum - 1,
        isLoaded: false,
        isPaging: true,
      })
    }
  }

  handleNextPageClick() {
    const { currentPageNum } = this.state;

    this.setState({ 
      currentPageNum: currentPageNum + 1,
      isLoaded: false,
      isPaging: true,
    })
  }

  handlePageNav(selectedPage) {
    const { currentPageNum } = this.state;
    const page = parseInt(selectedPage);
    if (currentPageNum == page) {
      return;
    }

    this.setState({
      currentPageNum: parseInt(selectedPage),
      isLoaded: false,
      isPaging: true,
    });
  }

  handlePageSizeLimitClick(e) {
    const { currentPageSize } = this.state;
    const newPageSizeVal = parseInt(e.target.textContent);
    if (currentPageSize === newPageSizeVal) {
      return;
    }

    this.setState({ 
      currentPageSize: newPageSizeVal,
      isLoaded: false,
      isPaging: true,
    });
  }

  displaySearchData() {
    this.setState({
      displaySearchResults: true,
    });
  }

  toggleSearchReloadState() {
    this.setState({
      toggleSearchReload: !this.state.toggleSearchReload
    });
  }

  resetSearch() {
    const { initPageNum, initPageSize } = this.props;
    this.setState({
      displaySearchResults: false,
      currentPageSize: initPageSize,
      currentPageNum: initPageNum,
    })
  }

  handleConfirmDeleteItem(e) {
    e.preventDefault();
    const { deleteRoute } = this.props;
    const { itemId, displayType } = this.state;

    const item = this.getItemById(itemId);

    let updatedItemData = Object.assign({...item}, {
      is_active: false,
    });

    if (displayType == 'tasks' || displayType == 'parts') {
      const { tag_types } = item;
      // parts' tag_types is an array while non-parts are single integer (pk) 
      const tagTypes = displayType == 'tasks' ? tag_types.id : tag_types.map(({ id }) => id);

      updatedItemData = Object.assign({...updatedItemData}, {
        tag_types: tagTypes,
      });
    }


    const update = deleteRoute(itemId, updatedItemData);
    update.then((results) => {
      if (results === 'Success') {
        return this.setState({
          showDialog: true,
          itemEditing: !this.state.itemEditing,
          showActionModal: false,
          itemId: '',
          itemName: '',
          actionType: '',
        });
      }
    });
  }

  updateSortState(e) {
    const selected = e.target.selectedOptions[0];
    let selectedData = selected.attributes.data.value;
    let sortOrder = true;

    if (selectedData[0] === '-') {
      selectedData = selectedData.substring(1);
      sortOrder = false;
    }

    this.setState({
      isSorted: true,
      sortBy: selectedData,
      sortAsc: sortOrder,
    });
  }

  resetSortState() {
    this.setState({
      isSorted: false,
      sortBy: '',
      sortAsc: true,
    });
  }

  changeFilter(e) {
    const selected = e.target.value;
    this.setState({
      filterBy: selected,
      isFiltered: true
    });
  }

  resetFilter() {
    this.setState({
      filterBy: '',
      isFiltered: false
    });
  }

  render() {
    const { 
      isLoaded, items, showActionModal, itemId, itemName,
      showDialog, actionType, editType, displayType, 
      totalItemsCount, totalPages, previousPage, nextPage, 
      currentPageNum, currentPageSize, displaySearchResults, sortBy, sortAsc,
      toggleSearchReload, filterBy
    } = this.state;
    const { children, tableRowType, pageSizeLimits, tableNumLinks, adminDisplayFields, sortButtonProps } = this.props;

    // parts use a modal for edit/delete. Non-parts only use modal for delete.
    const partsChildrenWithProps = displayType == 'parts' ?
      Children.map(children, child => cloneElement(child, 
        {
          itemId,
          handleCloseModal: this.handleCloseEditModal,
          itemEdit: this.handleItemEdit,
          handleShowDialog: this.handleShowDialog,
          actionType,
          reloadSearchResultsAfterSubmit: displaySearchResults ? true : false,
          toggleSearchReload: this.toggleSearchReloadState,
        }
      ))
      : '';

    // TODO: if admin, display edit/delete controls

    const handleEdit = (editType === 'modal') ? this.handleClickEditInModal : this.handleClickEditByRoute;

    // create Edit Delete buttons here
    const editButton = <Button key={0} type={'tblEditBtn'} title={'Edit'} action={handleEdit} />;
    const deleteButton = <Button key={1} type={'tblDeleteBtn'} title={'Delete'} action={this.handleClickDelete} />;

    // table props for displaying items or search results
    const tableHeaderText = displaySearchResults ? 
      `Found ${items.length} items.` 
      : `Currently displaying ${items.length} ${this.props.initDataKeyToParse}.`

    const searchTableConfigProps = {
      extraColHeaders: ['Actions'],
      extraRowProps: [editButton],
      extraPropsLayout: 'none'
    };

    // remove conditional after admin demo
    const renamedItemsForTable = adminDisplayFields == 'admin' ? items : this.filterOutputData();

    const table = isLoaded && !displaySearchResults ? 
      <Table
        data={renamedItemsForTable}
        fetchType={displayType}
        headerText={tableHeaderText}
        rowType={tableRowType}
        extraColHeaders={['Actions']}
        extraRowProps={[editButton, deleteButton]}
        extraPropsLayout={this.props.extraPropsLayout}
        numberOfLinks={tableNumLinks}
      /> : '';

    const modalHeaderText = (actionType === 'edit') ? 'Editing' : 'Deleting'
    const actionFormModal = showActionModal ? 
      <Modal 
        showActionModal={showActionModal} 
        handleCloseModal={this.handleCloseEditModal}
        headerText={modalHeaderText}
        actionType={actionType}
        itemName={itemName}
        handleConfirmButton={this.handleConfirmDeleteItem}
      >
        { partsChildrenWithProps }
      </Modal> : '';


    const showSuccessDialog = showDialog ?
      <Dialog
        dialogText={'Success'}
        showDialog={showDialog}
        handleCloseDialog={this.handleCloseDialog}
      /> : '';

    const totalItemsDisplay = !displaySearchResults && totalItemsCount > 0 ? 
      `There are a total of ${totalItemsCount} ${this.props.initDataKeyToParse}.`
      : '';

    const prevPageClick = previousPage != null ? this.handlePreviousPageClick : null;
    const nextPageClick = nextPage != null ? this.handleNextPageClick : null;

    const pagerNav = totalItemsCount > 0 && !displaySearchResults ?
      <Pager
        totalItemsCount={totalItemsCount}
        totalPages={totalPages}
        currentPageNum={currentPageNum}
        currentPageSize={currentPageSize}
        handlePageNav={this.handlePageNav}
        handlePreviousPageClick={prevPageClick}
        handleNextPageClick={nextPageClick}
        handlePageSizeLimitClick={this.handlePageSizeLimitClick}
        pageSizeLimits={pageSizeLimits}
      /> : '';

    const sortDisplay = !displaySearchResults ?
      <SortDisplay
        displayType={displayType}
        sortByName={sortBy}
        updateSortAction={this.updateSortState}
        sortOrder={sortAsc}
      />
      : '';

    const shouldAllowFilter = displayType !== 'jobs' ? true : false;
    const filterDisplay = shouldAllowFilter ?
      <Filter
        filterByName={filterBy}
        changeFilterAction={this.changeFilter}
        handleResetFilter={this.resetFilter}
      />
      : '';

    const sortAndFilterDisplay = !displaySearchResults ?
      <div className={'sort-and-filter-container'} style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        { sortDisplay }
        { filterDisplay }
      </div>
      : '';

    return(
      <div>
        <div className="search-sort" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SearchComponent 
            searchType={displayType}
            displayResults={this.displaySearchData}
            resetSearch={this.resetSearch}
            tableConfigProps={searchTableConfigProps}
            shouldUpdateParent={true}
            reloadSearch={toggleSearchReload}
            displaySearchResults={displaySearchResults}
          />
          { sortAndFilterDisplay }
        </div>
        { totalItemsDisplay } <br/>
        { pagerNav }
        { table }
        { actionFormModal }
        { showSuccessDialog }
      </div>
    )
  }
}

const singularizeItemNames = {
  'tasks': 'task',
  'parts': 'part',
  'categories': 'category',
  'jobs': 'job'
};

const WrappedDisplayComponent = withRouter(DisplayComponent);
WrappedDisplayComponent.WrappedComponent.contextType = IsAuthContext;

export default WrappedDisplayComponent;
