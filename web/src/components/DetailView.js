import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { DetailsTable, Button } from './common';
import { editPathWithId, itemPathWithId } from './frontendBaseRoutes';
import NotFound from './NotFound';
import { FetchGlobalMarkup } from './endpoints';
import { 
  renameAndRebuildRelatedPartsDisplayFields,
  createTaskDetailTotalsTableData
} from './CalculationsWithGlobalMarkup';
import { renameStaticTableFields, renameStaticObjTableFields } from './fieldNameAliases';
import { TaskDetailTotalsTable } from './Tasks';

/*
Only applies to Tasks, Categories, Jobs. Reference PartDetailWithState for Parts Detail.
*/
class DetailView extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    // only display the totalsTable when it's task detail.
    const { currentItem } = this.props;
    const totalsTable = currentItem == 'task' ? true : false;

    this.state = {
      itemData: {},
      relatedChildData: [], // array
      relatedParent: '', // string's *parent_name
      tagTypes: {},
      isLoaded: false,
      globalMarkup: [],
      allowTotalsTable: totalsTable,
    }

    this.handleClickEditByRoute = this.handleClickEditByRoute.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    const { initRoute, itemId, relatedChild, relatedParent, currentItem } = this.props;
    let getData = Promise.all([
      initRoute(itemId),
      FetchGlobalMarkup()
    ]);

    getData.then(response => {
      if (response[0].error || response[1].error) {
        this.context.updateAuth();
        return Promise.reject('Session expired.');
      }
      return response;
    })
    .then(([data, markupData]) => {
      if (data.detail) {
        return
      }

      let parentName = '';

      const { 
        [relatedParent]: parent,
        [relatedChild]: childArr,
        ...filteredData 
      } = data;
      // default tag_name for jobs to null. Jobs do not require a tag_name.
      let tags = {id: data.id, tag_name: null};

      if (currentItem !== 'job') {
        const { tag_types } = data;

        const tagValue = tag_types == null ? 'This category has not been assigned to a job.' : tag_types.job_name;
        tags = currentItem == 'category' ?
          Object.assign({}, {
            id: data.id,
            tag_name: tagValue
          })
          : tag_types;
      }

      if (this._isMounted) {
        this.setState({
          itemData: filteredData,
          relatedChildData: childArr,
          relatedParent: parentName,
          tagTypes: tags,
          isLoaded:true,
          globalMarkup: markupData
        });        
      }
    })
    .catch(error => {
      console.log('Detail View error: ', error);
      return error;
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  filterOutputData() {
    const { relatedChildData, tagTypes, globalMarkup } = this.state;
    const { relatedTableDisplayFields, currentItem, relatedChild } = this.props;
    const tagTypeId = tagTypes.id;

    const filteredData = relatedChild === 'parts' ?
      renameAndRebuildRelatedPartsDisplayFields(relatedChildData, tagTypeId, globalMarkup, relatedTableDisplayFields)
      : renameStaticTableFields(relatedChildData, currentItem, 'child');

    return filteredData;
  }

  renameItemFields() {
    const { itemData, tagTypes } = this.state;
    const { tag_name } = tagTypes;
    const { currentItem } = this.props;

    // merge tagType to itemData if its not a job.
    const itemObj = currentItem == 'job' ?
      { ...itemData}
      : { ...itemData, tag_types: tag_name};

    const renamedData = renameStaticObjTableFields(itemObj, currentItem, 'form');

    return renamedData;
  }

  handleClickEditByRoute(e) {
    const { itemId, currentItem } = this.props;
    const id = this.props.itemId;

    const nextPath = editPathWithId(id, currentItem);
    const detailPath = itemPathWithId(id, currentItem);
    this.props.history.push(nextPath, {
      itemId: id,
      detailPath
    });
  }


  render() {
    const { 
      itemData, relatedChildData, relatedParent, tagTypes,
      isLoaded, allowTotalsTable, globalMarkup
    } = this.state;
    const { currentItem, fetchType, tableNumLinks } = this.props;

    const renamedRelatedChildData = this.filterOutputData();
    const renamedItemDetailFormData = this.renameItemFields();

    const showItemDetail = isLoaded ?
      <div>
        <p>Detail View</p>
        <Button 
          type={'primary'}
          title={`Edit this ${currentItem}`}
          action={this.handleClickEditByRoute}
        />
        <DetailsTable
          data={renamedItemDetailFormData}
          relatedChild={renamedRelatedChildData}
          relatedParent={relatedParent}
          fetchType={fetchType}
          numberOfLinks={tableNumLinks}
        />
      </div>
      : <NotFound message={'This item may not exist.'} />

    const tableData = allowTotalsTable && isLoaded ? 
      {
        task: itemData,
        tagType: tagTypes,
        parts: relatedChildData,
        markup: globalMarkup
      } : '';

    const displayTotalsTable = allowTotalsTable && isLoaded ?
      <TaskDetailTotalsTable
        data={tableData}
      /> : '';

    return (
      <div>
        {showItemDetail}
        {displayTotalsTable}
      </div>
    )
  }
}

export default withRouter(DetailView);
