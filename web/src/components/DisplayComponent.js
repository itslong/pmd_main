import React, { Component, cloneElement, Children, useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { IsAdminContext } from './AppContext';
import { Input, Button, Table, TableRowWithButtons, TableRowWithCheckbox } from './common';
import Modal from './Modal';
import DialogModal from './DialogModal';
import { editPathWithId } from './frontendBaseRoutes';
import Pager from './Pager';
import SearchComponent from './SearchComponent';
import { FetchGlobalMarkup } from './endpoints';
import { renameAndRebuildMainDisplayFields } from './CalculationsWithGlobalMarkup';
import { renameStaticTableFields } from './fieldNameAliases';


class DisplayComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      isLoaded: false,
      itemId: '',
      itemName: '',
      showEditModal: false,
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
    };

    // this.handleClickEdit = this.handleClickEdit.bind(this);
    this.handleClickEditInModal = this.handleClickEditInModal.bind(this);
    this.handleClickEditByRoute = this.handleClickEditByRoute.bind(this);

    this.handleShowEditModal = this.handleShowEditModal.bind(this);
    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);

    this.handleClickDelete = this.handleClickDelete.bind(this);
    this.handleItemEdit = this.handleItemEdit.bind(this);

    this.handleShowDialog = this.handleShowDialog.bind(this);
    this.handleCloseDialog = this.handleCloseDialog.bind(this);

    this.handlePreviousPageClick = this.handlePreviousPageClick.bind(this);
    this.handleNextPageClick = this.handleNextPageClick.bind(this);
    // this.getItemNameById = this.getItemNameById.bind(this);
    this.handlePageSizeLimitClick = this.handlePageSizeLimitClick.bind(this);
    this.handlePageNav = this.handlePageNav.bind(this);
    this.displaySearchResults = this.displaySearchResults.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
  }

  componentDidMount() {
    const { initFetch, initDataKeyToParse, initPageSize, initPageNum } = this.props;

    let getAllData = Promise.all([
      initFetch(initPageNum, initPageSize),
      FetchGlobalMarkup()
    ]);

    getAllData.then(([data, markupData]) => {

      this.setState({
        items: data[initDataKeyToParse],
        isLoaded: true,
        totalItemsCount: data.count,
        totalPages: data.total_pages,
        nextPage: data.next,
        previousPage: data.previous,
        globalMarkup: markupData
      });
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPageSize, currentPageNum, itemEditing, displaySearchResults } = this.state;
 
    if (itemEditing !== prevState.itemEditing || currentPageSize !== prevState.currentPageSize || currentPageNum !== prevState.currentPageNum) {
      const { initFetch, initDataKeyToParse} = this.props;

      const endpoint = initFetch(currentPageNum, currentPageSize);

      endpoint.then(data => {

        this.setState({
          items: data[initDataKeyToParse],
          nextPage: data.next,
          previousPage: data.previous,
          isLoaded: true,
          itemEditing: false,
          actionType: '',
          totalItemsCount: data.count,
          totalPages: data.total_pages,
          currentPageSize: currentPageSize,
          currentPageNum: currentPageNum,
        });
      })
    }
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

    const nextPath = editPathWithId(id, this.state.displayType)
    console.log('next path: ' + nextPath)
    this.props.history.push(nextPath, {
      itemId: id
    })

  }

  handleClickEditInModal(e) {
    this.setState({
      itemId: e.target.id,
      showEditModal: true,
      actionType: 'edit',
    })
  }

  handleShowEditModal() {
    this.setState({ showEditModal: true });
  }

  handleCloseEditModal() {
    this.setState({ 
      showEditModal: false,
      itemId: '',
      actionType: '',
    });
  }

  handleClickDelete(e) {
    this.setState({
      itemId: e.target.id,
      showEditModal: true,
      actionType: 'delete'
    })
  }

  handleItemEdit(bool) {
    this.setState({ 
      itemEditing: bool,
      itemId: ''
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
      currentPageNum: currentPageNum - 1
      })
    }
  }

  handleNextPageClick() {
    const { currentPageNum } = this.state;

    this.setState({ 
      currentPageNum: currentPageNum + 1,
    })
  }

  handlePageNav(selectedPage) {
    this.setState({
      currentPageNum: parseInt(selectedPage)
    });
  }

  handlePageSizeLimitClick(e) {
    const { currentPageSize } = this.state;
    const newPageSizeVal = parseInt(e.target.textContent);

    this.setState({ 
      currentPageSize: newPageSizeVal,
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

  render() {
    const { 
      isLoaded, items, showEditModal, itemId, 
      showDialog, actionType, editType, displayType, 
      totalItemsCount, totalPages, previousPage, nextPage, 
      currentPageNum, currentPageSize, displaySearchResults
    } = this.state;
    const { children, tableRowType, pageSizeLimits, tableNumLinks } = this.props;
    const childrenWithProps = Children.map(children, child => 
      cloneElement(child, {
        itemId,
        handleCloseModal: this.handleCloseEditModal,
        itemEdit: this.handleItemEdit,
        handleShowDialog: this.handleShowDialog,
        actionType
      })
    );
    // TODO: if admin, display edit/delete controls

    const handleEdit = (editType === 'modal') ? this.handleClickEditInModal : this.handleClickEditByRoute;

    // create Edit Delete buttons here
    const editButton = <Button key={0} type={'primary'} title={'Edit'} action={handleEdit} />;
    const deleteButton = <Button key={1} type={'primary'} title={'Delete'} action={this.handleClickDelete} />;

    // table props for displaying items or search results
    const tableHeaderText = displaySearchResults ? 
      `Found ${items.length} items.` 
      : `Currently displaying ${items.length} ${this.props.initDataKeyToParse}.`

    const searchTableConfigProps = {
      extraColHeaders: '',
      extraRowProps: undefined,
      extraPropsLayout: null
    };

    const renamedItemsForTable = this.filterOutputData();

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
    const editFormModal = showEditModal ? 
      <Modal 
        showEditModal={showEditModal} 
        handleCloseModal={this.handleCloseEditModal}
        headerText={modalHeaderText}
        actionType={actionType}
      >
        { childrenWithProps }
      </Modal> : '';


    const showSuccessDialog = showDialog ?
      <DialogModal
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
        { editFormModal }
        { showSuccessDialog }
      </div>
    )
  }
}

export default withRouter(DisplayComponent);
DisplayComponent.contextType = IsAdminContext;
