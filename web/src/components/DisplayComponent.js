import React, { Component, cloneElement, Children, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { Input, Button, Table, TableRowWithButtons, TableRowWithCheckbox, Modal, Dialog } from './common';
import { editPathWithId, itemPathWithId } from './frontendBaseRoutes';
import Pager from './Pager';
import SearchComponent from './SearchComponent';
import { FetchGlobalMarkup } from './endpoints';
import { renameAndRebuildMainDisplayFields } from './CalculationsWithGlobalMarkup';
import { renameStaticTableFields } from './fieldNameAliases';


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
    this.displaySearchResults = this.displaySearchResults.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.handleConfirmDeleteItem = this.handleConfirmDeleteItem.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { initFetch, initDataKeyToParse, initPageSize, initPageNum } = this.props;

    let getAllData = Promise.all([
      initFetch(initPageNum, initPageSize),
      FetchGlobalMarkup()
    ]);

    getAllData.then(([data, markupData]) => {
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
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { itemEditing, isLoaded, currentPageNum, currentPageSize, isPaging } = this.state;
 
    if (itemEditing !== prevState.itemEditing || prevState.isLoaded === true && isLoaded == false) {
      const { initFetch, initDataKeyToParse, initPageNum, initPageSize} = this.props;

      const endpoint = isPaging ?
        initFetch(currentPageNum, currentPageSize)
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
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  filterOutputData() {
    const { items, globalMarkup } = this.state;
    const { mainDisplayFields, calculationFields, displayType } = this.props;

    const filteredData = displayType === 'parts' || displayType === 'tasks' ?
      renameAndRebuildMainDisplayFields(displayType, items, globalMarkup, mainDisplayFields, calculationFields)
      : renameStaticTableFields(items, displayType, 'display');
 
    return filteredData;  
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

  displaySearchResults() {
    this.setState({
      displaySearchResults: true,
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

    const item = this.getItemById(itemId)

    let updatedItemData = Object.assign({...item}, {
      is_active: false,
    });

    if (displayType == 'tasks') {
      const { id: tagTypeId } = item.tag_types;
      updatedItemData = Object.assign({...updatedItemData}, {
        tag_types: tagTypeId,
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

  render() {
    const { 
      isLoaded, items, showActionModal, itemId, itemName,
      showDialog, actionType, editType, displayType, 
      totalItemsCount, totalPages, previousPage, nextPage, 
      currentPageNum, currentPageSize, displaySearchResults
    } = this.state;
    const { children, tableRowType, pageSizeLimits, tableNumLinks, adminDisplayFields } = this.props;

    // parts use a modal for edit/delete. Non-parts only use modal for delete.
    const partsChildrenWithProps = displayType == 'parts' ?
      Children.map(children, child => cloneElement(child, 
        {
          itemId,
          handleCloseModal: this.handleCloseEditModal,
          itemEdit: this.handleItemEdit,
          handleShowDialog: this.handleShowDialog,
          actionType
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
      extraColHeaders: '',
      extraRowProps: undefined,
      extraPropsLayout: null
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

    return(
      <div>
        <SearchComponent 
          searchType={displayType}
          displayResults={this.displaySearchResults}
          resetSearch={this.resetSearch}
          tableConfigProps={searchTableConfigProps}
          shouldUpdateParent={true}
        />
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

export default withRouter(DisplayComponent);
