import React, { Component, cloneElement, Children } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Button } from './common';
import Modal from './Modal';
import { FetchTagTypesChoices } from './endpoints';


class EditByRoute extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemId: '',
      itemData: [],
      // nextPath: '',
      // prevPath: '',
      tagTypesChoices: [],
    };

    this.handleLoadNewData = this.handleLoadNewData.bind(this);
  }

  componentDidMount() {
    // console.log('editroute : ' + JSON.stringify(this.props.match))
    const { fetchRoute } = this.props;
    // fetch by id
    const id = this.props.match.params.id;
 
    Promise.all([
      fetchRoute(id),
      FetchTagTypesChoices(),
    ])
    .then(([routeData, tagsChoices]) => {
      this.setState({
        itemId: id,
        itemData: routeData,
        tagTypesChoices: tagsChoices
      });
    })
    .catch(err => {
      return Promise.reject('Error from fetching a single item: ', err);
    })
  }

  handleLoadNewData() {
    this.setState({
      loadNewData: !this.state.loadNewData
    })
  }

  handleDisplayModalForChild(e) {
    e.preventDefault();
    this.setState({
      displayModalForChild: !this.state.displayModalForChild,
    })
  }


  render() {
    const { itemData, itemId, tagTypesChoices, isEditing } = this.state;
    const { children, searchTypeForChild, history } = this.props;

    // cloning TaskFormFields
    const childrenWithProps = Children.map(children, child => 
      cloneElement(child, {
        // handleCloseModal: this.handleCloseEditModal,
        // itemEdit: this.handleItemEdit,
        // handleShowDialog: this.handleShowDialog,
        // handleFormData: this.handleFormData,
        // itemId,
        data: itemData,
        tagTypesChoices: tagTypesChoices,
        fetchRoute: this.props.fetchRoute,
        updateRoute: this.props.updateRoute,
        history,
        searchTypeForChild
      })
    );

    const formFields = (itemData && itemId) ? childrenWithProps  : '';

    return (
      <div>
        { formFields }
        <Link to={this.props.mainPath}>Back to {this.props.mainPathName}</Link>

      </div>
    )
  }
};

export default withRouter(EditByRoute);