import React, { Component } from 'react';

import { FetchPart, FetchAllTasksRelatedToParts } from '../endpoints';
import NotFound from '../NotFound';
import EditPartsForm from './EditPartsForm';
import { Button, Table, DetailsTable, Modal, Dialog } from '../common';
import { renameStaticTableFields, renameStaticObjTableFields } from '../fieldNameAliases';
import { IsAuthContext } from '../AppContext';


class PartDetailWithState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      partId: this.props.match.params.id,
      isLoaded: false,
      partData: {},
      tagTypes: [],
      partFound: false,
      showEditModal: false,
      showDialog: false,
      togglePartEditing: false,
      displayAndLoadRelatedTasks: false,
      relatedTasksData: []
    }

    this.handleClickEditPartInModal = this.handleClickEditPartInModal.bind(this);

    this.handleCloseEditModal = this.handleCloseEditModal.bind(this);
    this.handlePartEdit = this.handlePartEdit.bind(this);

    this.handleCloseDialog = this.handleCloseDialog.bind(this);
    this.handleShowDialog = this.handleShowDialog.bind(this);
    
    this.handleDisplayAndLoadTaskTable = this.handleDisplayAndLoadTaskTable.bind(this);
  }

  componentDidMount() {
    const partId = this.props.match.params.id;
    let getPart = FetchPart(partId);

    getPart.then(data => {
      if (data.error) {
        this.context.updateAuth();
        return Promise.reject('Session expired.');
      }
      return data;
    })
    .then(partData => {
      if (partData.detail === 'Not found.') {
        return this.setState({
          partFound: false,
          isLoaded: true,
        });
      }

      const { tag_types, ...parts} = partData; 

      this.setState({
        partId,
        isLoaded: true,
        partData: parts,
        tagTypes: tag_types,
        partFound: true,
      });
    })
    .catch(error => {
      console.log('Part detail error: ', error);
      return error;
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { togglePartEditing, displayAndLoadRelatedTasks, partId, relatedTasksData } = this.state;

    if (togglePartEditing !== prevState.togglePartEditing) {
      const partId = this.props.match.params.id;
      let getPart = FetchPart(partId)

      getPart.then(partData => {
        if (partData.detail === 'Not found.') {
          return this.setState({
            partFound: false,
            isLoaded: true,
          });
        }

        const { tag_types, ...parts} = partData;
        this.setState({
          partId,
          isLoaded: true,
          partData: parts,
          tagTypes: tag_types,
        });
      })
    }

    if (displayAndLoadRelatedTasks !== prevState.displayAndLoadRelatedTasks) {

      const getRelatedTasks = FetchAllTasksRelatedToParts(partId);

      getRelatedTasks.then(tasksData => {
        this.setState({ relatedTasksData: tasksData });
      });
    } 
  }

  filterOutputData(fieldType) {
    const { relatedTasksData, partData } = this.state;
    const filteredData = fieldType == 'form' ?
      renameStaticObjTableFields(partData, 'part', fieldType)
      : renameStaticTableFields(relatedTasksData, 'part', fieldType);

    return filteredData;
  }

  handleClickEditPartInModal() {
    this.setState({
      showEditModal: !this.state.showEditModal
    });
  }

  handlePartEdit() {
    this.setState({
      togglePartEditing: !this.state.togglePartEditing
    })
  }

  handleCloseEditModal() {
    this.setState({
      showEditModal: !this.state.showEditModal,
    });
  }

  handleShowDialog() {
    this.setState({ showDialog: true })
  }

  handleCloseDialog() {
    this.setState({ showDialog: !this.state.showDialog })
  }

  handleDisplayAndLoadTaskTable() {
    this.setState({ displayAndLoadRelatedTasks: !this.state.displayAndLoadRelatedTasks })
  }

  render() {
    const { 
      isLoaded, partId, partData, tagTypes, partFound, 
      showEditModal, showDialog, displayAndLoadRelatedTasks,
      relatedTasksData
    } = this.state;
    const placeholder = !isLoaded ? <p>Loading details...</p> : '';

    const displayOrHideTaskTableButtonTitle = displayAndLoadRelatedTasks ? 'Hide Task Table' : 'Show Task Table';
    const displayTaskTableButton = partFound ?
      <Button
        type={'primary'}
        title={displayOrHideTaskTableButtonTitle}
        action={this.handleDisplayAndLoadTaskTable}
      />
      : '';

    const renamedPartData = partFound ? this.filterOutputData('form'): partData;

    const showPartDetail = partFound ?
      <div> 
        <Button
          type={'primary'}
          title={'Edit this part'}
          action={this.handleClickEditPartInModal}
        />
        <DetailsTable 
          data={renamedPartData}
          tagTypes={tagTypes}
        />
      </div> : 
      <NotFound message={'This item may not exist.'}/>
    
    const renamedRelatedTasksData = displayAndLoadRelatedTasks && relatedTasksData.length > 0 ?
      this.filterOutputData('parent')
      : relatedTasksData;

    const showParentTaskTable = displayAndLoadRelatedTasks && relatedTasksData.length > 0 ? 
      <Table 
        data={renamedRelatedTasksData}
        extraColHeaders={''}
        fetchType={'tasks'}
        numberOfLinks={1}
      /> : '';

    const showParentTaskTableMessage = displayAndLoadRelatedTasks && relatedTasksData.length === 0 ?
      <p>No Tasks are using this Part.</p>
      : '';

    const showSuccessDialog = showDialog ?
      <Dialog
        dialogText={'Success'}
        showDialog={showDialog}
        handleCloseDialog={this.handleCloseDialog}
      /> : '';


    const partEditModal = showEditModal ? 
      <Modal 
        showModal={showEditModal} 
        handleCloseModal={this.handleCloseEditModal}
        headerText={'Editing Part'}
        actionType={'edit'}
      >
        <EditPartsForm 
          itemId={partId} 
          handleCloseModal={this.handleCloseEditModal} 
          itemEdit={this.handlePartEdit}
          handleShowDialog={this.handleShowDialog}
        />
      </Modal> : '';

    return(
      <div>
        { placeholder }
        { showPartDetail }
        { displayTaskTableButton }
        { showParentTaskTable }
        { showParentTaskTableMessage }
        { partEditModal }
        { showSuccessDialog }
      </div>
    );
  }
}

PartDetailWithState.contextType = IsAuthContext;

export default PartDetailWithState;
