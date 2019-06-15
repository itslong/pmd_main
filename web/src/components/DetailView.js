import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { DetailsTable, Button } from './common';
import { editPathWithId } from './frontendBaseRoutes';
import NotFound from './NotFound';
import { FetchGlobalMarkup } from './endpoints';
import { renameAndRebuildRelatedPartsDisplayFields, TaxTotalWithPartRetailAndTaskOnlyLabor } from './CalculationsWithGlobalMarkup';
import { renameStaticTableFields, handlePluralNames } from './fieldNameAliases';

// import { TaxTotalForTaskAddonLaborWithPartsRetailMarkup } from './Tasks';

/*
Only applies to Tasks, Categories, Jobs. Reference PartDetailWithState for Parts Detail.
*/
class DetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemData: {},
      relatedChildData: [], // array
      relatedParent: '', // string's *parent_name
      tagTypes: {},
      isLoaded: false,
      globalMarkup: [],
      taskAndAddonTotalsData: [], //array of objects
    }

    this.handleClickEditByRoute = this.handleClickEditByRoute.bind(this);
    this.handleTaskAttributeCalculations = this.handleTaskAttributeCalculations.bind(this);
  }

  componentDidMount() {
    const { initRoute, itemId, relatedChild, relatedParent } = this.props;
    let getData = Promise.all([
      initRoute(itemId),
      FetchGlobalMarkup()
    ]);

    getData.then(([data, markupData]) => {
      let parentName = '';

      const { 
        [relatedParent]: parent,
        [relatedChild]: childArr,
        tag_types, ...filteredData 
      } = data;

      // tag_types only in Task. Category's tag_types = job's id
      const tags = !tag_types ? 
        Object.assign({}, {
          id: data.id,
          tag_name: data.job_name
        }) : tag_types;

      this.setState({
        itemData: filteredData,
        relatedChildData: childArr,
        relatedParent: parentName,
        tagTypes: tags,
        isLoaded:true,
        globalMarkup: markupData
      });

      // console.log('detail state: ', this.state);
      // console.log('related child (parts) arr: ', this.state.relatedChildData)
    });
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

  handleClickEditByRoute(e) {
    const { itemId, currentItem } = this.props;
    const id = this.props.itemId;

    const nextPath = editPathWithId(id, currentItem)
    console.log('next path: ' + nextPath)
    this.props.history.push(nextPath, {
      itemId: id
    })
  }

  handleTaskAttributeCalculations() {
    const { itemData, relatedChildData, globalMarkup, tagTypes } = this.state;
    

    // const stuff = TaxTotalForTaskAddonLaborWithPartsRetailMarkup(itemData, relatedChildData, tagTypes.id, globalMarkup, 'addon')
    // console.log('stuff: ', stuff)
  }

  render() {
    const { itemData, relatedChildData, relatedParent, tagTypes, isLoaded } = this.state;
    const { currentItem, fetchType, tableNumLinks } = this.props;

    const renamedRelatedChildData = this.filterOutputData();

    const showItemDetail = isLoaded ?
      <div>
        <p>Detail View</p>
        <Button 
          type={'primary'}
          title={`Edit this ${currentItem}`}
          action={this.handleClickEditByRoute}
        />
        <DetailsTable
          data={itemData}
          tagTypes={tagTypes}
          relatedChild={renamedRelatedChildData}
          relatedParent={relatedParent}
          fetchType={fetchType}
          numberOfLinks={tableNumLinks}
        />
      </div>
      : <NotFound message={'This item does not exist.'} />

    const taskAttributeButton = itemData.task_attribute ? 
      <Button
        type={'primary'}
        title={`Display ${itemData.task_attribute} table.`}
        action={this.handleTaskAttributeCalculations}
      /> : '';


    return (
      <div>
        {showItemDetail}
        {taskAttributeButton}
      </div>
    )
  }
}

export default withRouter(DetailView);
