import React, { Component } from 'react';

import { FetchPart, FetchAllTasksRelatedToParts } from '../endpoints';
import NotFound from '../NotFound';
import DialogModal from '../DialogModal'
import Modal from '../Modal';
import EditPartsForm from './EditPartsForm';
import { Button, Table, DetailsTable } from '../common';
import { renameStaticTableFields, renameStaticObjTableFields } from '../fieldNameAliases';


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
      partEditing: false,
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
        partFound: true,
      });
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { partEditing, displayAndLoadRelatedTasks, partId, relatedTasksData } = this.state;

    if (partEditing !== prevState.partEditing) {
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
    console.log('edit clicked')
    this.setState({
      showEditModal: !this.state.showEditModal
    }, () => {
      console.log('part detail state: ', JSON.stringify(this.state))
    })
  }

  handlePartEdit(bool) {
    console.log('part edit state fired')
    this.setState({
      partEditing: bool
    })
  }

  handleCloseEditModal() {
    console.log('closed modal fired')
    this.setState({
      showEditModal: !this.state.showEditModal,
    });
  }

  handleShowDialog() {
    this.setState({ showDialog: true })
  }

  handleCloseDialog() {
    console.log('close dialog fired: ');
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
      <NotFound message={'Part may not exist.'}/>
    
    const renamedRelatedTasksData = displayAndLoadRelatedTasks && relatedTasksData.length > 0 ?
      this.filterOutputData('parent')
      : relatedTasksData;

    const showParentTaskTable = displayAndLoadRelatedTasks && relatedTasksData.length > 0 ? 
      <Table 
        data={renamedRelatedTasksData}
        extraColHeaders={''}
        extraRowProps={undefined}
        extraPropsLayout={null}
        fetchType={'tasks'}
        numberOfLinks={1}
      /> : '';

    const showParentTaskTableMessage = displayAndLoadRelatedTasks && relatedTasksData.length === 0 ?
      <p>No Tasks are using this Part.</p>
      : '';

    const showSuccessDialog = showDialog ?
      <DialogModal 
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
        <Button
          type={'primary'}
          title={displayOrHideTaskTableButtonTitle}
          action={this.handleDisplayAndLoadTaskTable}
        />
        { showParentTaskTable }
        { showParentTaskTableMessage }
        { partEditModal }
        { showSuccessDialog }
      </div>
    );
  }
}

export default PartDetailWithState;
