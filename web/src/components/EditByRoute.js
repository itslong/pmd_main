import React, { Component, cloneElement, Children } from 'react';
import { withRouter, Link } from 'react-router-dom';

import { Button, Modal } from './common';
import { FetchTagTypesChoices } from './endpoints';
import { IsAuthContext } from './AppContext';


class EditByRoute extends Component {
  _isMounted = false;
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
    this._isMounted = true;
    const { fetchRoute } = this.props;
    // fetch by id
    const id = this.props.match.params.id;

    const fetchItemAndTags = Promise.all([
      fetchRoute(id),
      FetchTagTypesChoices(),
    ])
    .then(data => {
      if (data[0].error || data[1].error) {
        this.context.updateAuth();
        return Promise.reject('Session expired.')
      }
      return data;
    })
    .then(([routeData, tagsChoices]) => {
      if (this._isMounted) {
        this.setState({
          itemId: id,
          itemData: routeData,
          tagTypesChoices: tagsChoices
        });
      }
    })
    .catch(err => {
      console.log('Error when routing to edit item: ', err);
      return err;
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
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
    const { children, searchTypeForChild, history, mainPath, mainPathName } = this.props;
    const { location } = history;

    const detailPath = location.state ? location.state.detailPath : (location.pathname).replace('edit/', '');

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
        <Link to={mainPath}>Back to {mainPathName}</Link>
        <Link style={{paddingLeft: '40px'}} to={detailPath}>Go to {mainPathName} detail</Link>
      </div>
    )
  }
};

const WrappedEditByRoute = withRouter(EditByRoute);
WrappedEditByRoute.WrappedComponent.contextType = IsAuthContext;

export default WrappedEditByRoute;
