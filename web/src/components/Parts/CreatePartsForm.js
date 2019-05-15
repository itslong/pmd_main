import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

import { 
  CreatePart,
  GetPartsMarkupPercents,
  FetchTagTypesChoices,
  GetCookie,
  CSRFToken 
} from '../endpoints';
import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { calculateRetailCost } from './CalculatePartsCustomMarkupField';
import { PARTS_DISPLAY_PATH } from '../frontendBaseRoutes';


class CreatePartsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      part_name: '',
      master_part_num: '',
      mfg_part_num: '',
      upc_num: '',
      tag_types: [], // array of pks
      tagTypesAsValues: [], // array of objects
      tagTypesChoices: [],
      tagTypesDisplay: false,
      part_desc: '',
      base_part_cost: '',
      markup_percent_id: '',
      retail_part_cost: '',
      is_active: true,
      redirectAfterSubmit: false,
      partsMarkupData: []
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleRedirectAfterSubmit = this.handleRedirectAfterSubmit.bind(this);

    this.handlePartName = this.handlePartName.bind(this);
    this.handleMasterPartNum = this.handleMasterPartNum.bind(this);
    this.handleMfgPartNum = this.handleMfgPartNum.bind(this);
    this.handleUpcNum = this.handleUpcNum.bind(this);
    this.handlePartDesc = this.handlePartDesc.bind(this);
    this.handleMultiTagTypesChange = this.handleMultiTagTypesChange.bind(this);
    this.displayTagTypes = this.displayTagTypes.bind(this);

    this.handleBasePartCost = this.handleBasePartCost.bind(this);
    this.handleRetailPartCost = this.handleRetailPartCost.bind(this);

  }

  componentDidMount() {
    Promise.all([
      GetPartsMarkupPercents(),
      FetchTagTypesChoices()
    ])
    .then(([markupData, tagsChoices]) => {
      this.setState({
        partsMarkupData: markupData,
        tagTypesChoices: tagsChoices
      });
    })
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      part_name: '',
      master_part_num: '',
      mfg_part_num: '',
      upc_num: '',
      part_desc: '',
      base_part_cost: '',
      markup_percent_id: '',
      retail_part_cost: '',
      is_active: true,
      redirectAfterSubmit: false
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formData = this.getFormDataFromState();
    // console.log('the formdata: ', JSON.stringify(formData))

    let create = CreatePart(formData);
    create.then(data => {
      console.log('created: ' + JSON.stringify(data))
      this.handleRedirectAfterSubmit();
      this.handleClearForm(e);
    })

  }

  getFormDataFromState() {
    const { 
      tagTypesAsValues,
      tagTypesChoices,
      tagTypesDisplay,
      is_active,
      redirectAfterSubmit,
      partsMarkupData,
      ...formData
    } = this.state;

    return formData;

  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true})
  }

  handlePartName(e) {
    this.setState({ part_name: e.target.value });
  }

  handleMasterPartNum(e) {
    this.setState({ master_part_num: e.target.value });
  }

  handleMfgPartNum(e) {
    this.setState({ mfg_part_num: e.target.value});
  }

  handleUpcNum(e) {
    this.setState({ upc_num: e.target.value });
  }

  handlePartDesc(e) {
    this.setState({ part_desc: e.target.value });
  }

  handleMultiTagTypesChange(e) {
    let selected = e.target.selectedOptions;
    let choicesAsValues = [];
    let tags = [];

    for (let choice of selected) {
      let choiceObj = {
        id: choice.id,
        tag_name: choice.value
      };
      tags.push(choice.id);
      choicesAsValues.push(choiceObj);
    }

    this.setState({
      tag_types: tags,
      tagTypesAsValues: choicesAsValues
    });
  }

  displayTagTypes(e) {
    e.preventDefault();
    this.setState({ tagTypesDisplay: !this.state.tagTypesDisplay });
  }

  handleBasePartCost(e) {
    let partCost = e.target.value;
    const costObj = calculateRetailCost(partCost, this.state.partsMarkupData)
    this.handleRetailPartCost(costObj)
    this.setState({ base_part_cost: partCost });
  }


  handleRetailPartCost(costObj) {
    let markupId = costObj.markupId ? costObj.markupId : '';
    let retailCost = costObj.retailCost ? costObj.retailCost : 'Base Part Cost Exceeded.';

    this.setState({ 
      markup_percent_id: markupId, 
      retail_part_cost: retailCost
    });
  }

  render() {
    const { redirectAfterSubmit, tag_types, tagTypesChoices, tagTypesAsValues, tagTypesDisplay } = this.state;
    if (redirectAfterSubmit) {
      return <Redirect to={PARTS_DISPLAY_PATH} />
    } 

    const tagTypesValues = tagTypesAsValues.map(({ tag_name }) => tag_name).join(', ').toString();

    const tagTypesChoicesSelect = (tagTypesChoices.length > 0 && tagTypesDisplay) ?
      <Select
        multiple={true}
        title={'Select Tag Types'}
        options={tagTypesChoices}
        handleChange={this.handleMultiTagTypesChange}
      /> : '';

    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Input 
            type={'text'}
            title={'Part Name'}
            placeholder={'Enter the new part name.'}
            value={this.state.part_name}
            handleChange={this.handlePartName}
          />

          <Input 
            type={'text'}
            title={'Master Part Number'}
            placeholder={'Enter the master part number.'}
            value={this.state.master_part_num}
            handleChange={this.handleMasterPartNum}
          />

          <Input 
            type={'text'}
            title={'Manufacturing Part Number'}
            placeholder={'Enter the manufacturing part name.'}
            value={this.state.mfg_part_num}
            handleChange={this.handleMfgPartNum}
          />

          <Input 
            type={'text'}
            title={'UPC Part Number'}
            placeholder={'Enter the UPC part name.'}
            value={this.state.upc_num}
            handleChange={this.handleUpcNum}
          />      
          
          <TextArea
            type={'text'}
            title={'Part Description'}
            placeholder={'Enter the part description.'}
            rows={5}
            value={this.state.part_desc}
            handleChange={this.handlePartDesc}
          />
          
          <Input
            readOnly
            type={'text'}
            title={'Tag Types'}
            value={tagTypesValues}
            style={{ width: '250px'}}
          />
          
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button           
              type={'edit'}
              title={'Select Tag Types'}
              action={this.displayTagTypes}
            />
            {tagTypesChoicesSelect}
          </div>
          
          <Input 
            type={'text'}
            title={'Base Part Cost'}
            placeholder={'Enter the base part cost.'}
            value={this.state.base_part_cost}
            handleChange={this.handleBasePartCost}
          />

          <Input 
            readOnly
            type={'text'}
            title={'Recommended Retail Part Cost'}
            defaultvalue={this.state.retail_part_cost}
            value={this.state.retail_part_cost}
          />

          <CSRFToken />
          <Button
            type={'primary'}
            title={'Submit'}
            action={this.handleSubmit}
          />
          <Button
            type={'secondary'}
            title={'Clear Form'}
            action={this.handleClearForm}
          />

        </form>
        <Link to={PARTS_DISPLAY_PATH}>Back to Parts</Link>
      </div>
    );
  }
}

export default CreatePartsForm;
