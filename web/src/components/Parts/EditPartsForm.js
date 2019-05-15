import React, { Component } from 'react';

import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { calculateRetailCost } from './CalculatePartsCustomMarkupField';
import { 
  FetchPart,
  UpdatePart,
  GetPartsMarkupPercents,
  FetchTagTypesChoices,
  CSRFToken 
} from '../data';


class EditPartsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      part_name: '',
      master_part_num: '',
      mfg_part_num: '',
      upc_num: '',
      part_desc: '',
      tag_types: [], // for submission: array of ints
      tag_types_as_values: [], // array of objects
      tag_types_display: false,
      tag_types_choices: [], // choices from API
      base_part_cost: '',
      markup_percent_id: '',
      set_custom_part_cost: false,
      custom_retail_part_cost: '',
      retail_part_cost: '',
      is_active: true,
      actionType: this.props.actionType,
      parts_markup_data: []
    }

    this.handlePartName = this.handlePartName.bind(this);
    this.handleMasterPartNum = this.handleMasterPartNum.bind(this);
    this.handleMfgPartNum = this.handleMfgPartNum.bind(this);
    this.handleUpcNum = this.handleUpcNum.bind(this);
    this.handlePartDesc = this.handlePartDesc.bind(this);
    this.handleBasePartCost = this.handleBasePartCost.bind(this);
    this.handleSetCustomPartCostChecked = this.handleSetCustomPartCostChecked.bind(this);
    this.handleCustomRetailPartCost = this.handleCustomRetailPartCost.bind(this);
    this.handleRetailPartCost = this.handleRetailPartCost.bind(this);
    this.handleIsActiveChecked = this.handleIsActiveChecked.bind(this);
    this.handleMultiTagTypesChange = this.handleMultiTagTypesChange.bind(this);
    this.displayTagTypes = this.displayTagTypes.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // itemId is passed from prev component or pass through props.history
    // TODO: add error handling when history is undefined or when user routes to /part/edit/id directly
    // check for history first
    // console.log('parts: ' + JSON.stringify(this.props));
    const { match, itemId } = this.props;

    const id = itemId ? itemId : match.params.id;
    Promise.all([
      FetchPart(id),
      GetPartsMarkupPercents(),
      FetchTagTypesChoices(),
    ])
    .then(([part, markups, tagsChoices]) => {
      // state.tag_types only accepts array of ints
      const cleanTagTypes = part.tag_types.map(obj => {
        return obj.id;
      })

      this.setState({
        id: part.id,
        part_name: part.part_name,
        master_part_num: part.master_part_num,
        mfg_part_num: part.mfg_part_num,
        upc_num: part.upc_num,
        part_desc: part.part_desc,
        tag_types: cleanTagTypes,
        tag_types_as_values: part.tag_types,
        base_part_cost: part.base_part_cost,
        markup_percent_id: part.markup_percent_id,
        set_custom_part_cost: part.set_custom_part_cost,
        custom_retail_part_cost: part.custom_retail_part_cost,
        retail_part_cost: part.retail_part_cost,
        is_active: part.is_active,
        parts_markup_data: markups,
        tag_types_choices: tagsChoices
      })
    })
    .catch(err => {
      console.log('Error from fetching a single part', err);
    })
  }

  handleSubmit(e) {
    e.preventDefault();

    // clean state
    const { tag_types_as_values, parts_markup_data, tag_types_choices, ...formData }  = this.state;

    if (this.state.actionType === 'delete') {
      formData.is_active = false;
    }

    let update = UpdatePart(this.state.id, formData);
    update.then(() => {
      this.props.itemEdit(true);
      this.props.handleCloseModal();
      this.props.handleShowDialog();
      console.log('updated')
    })
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

  handleBasePartCost(e) {
    this.setState({ base_part_cost: e.target.value }, () => {
      if (!this.state.set_custom_part_cost) {
        const costObj = calculateRetailCost(this.state.base_part_cost, this.state.parts_markup_data);
        this.handleRetailPartCost(costObj);
      }
    });

  }

  handleSetCustomPartCostChecked(e) {
    this.setState({ 
      set_custom_part_cost: e.target.checked,
      custom_retail_part_cost: 0
    });
  }

  handleCustomRetailPartCost(e) {
    this.setState({
    markup_percent_id: 9999, 
      custom_retail_part_cost: e.target.value,
      retail_part_cost: e.target.value
    })
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
      tag_types_as_values: choicesAsValues
    });
  }

  displayTagTypes(e) {
    e.preventDefault();
    this.setState({ tag_types_display: !this.state.tag_types_display })
  }

  handleIsActiveChecked(e) {
    this.setState({ is_active: e.target.checked })
  }

  handleRetailPartCost(cost) {
    let markupId = cost.markupId ? cost.markupId : '';
    let retailCost = cost.retailCost ? cost.retailCost : 'Base Part Cost Exceeded.';

    this.setState({ 
      markup_percent_id: markupId, 
      retail_part_cost: retailCost
    });
  }

  render() {
    // console.log('the action type: ' + this.state.actionType)
    const {actionType, part_name, tag_types, tag_types_display, tag_types_choices, tag_types_as_values} = this.state;
    let showCustomRetailPartCostField = this.state.set_custom_part_cost ?
      <Input 
        type={'text'}
        title={'Enter Custom Retail Part Cost'}
        placeholder={'Enter a custom retail part cost.'}
        value={this.state.custom_retail_part_cost}
        handleChange={this.handleCustomRetailPartCost}
      /> : '';

    const tagTypesValues = tag_types_as_values.map(({ tag_name }) => tag_name).join(', ').toString();

    const tagTypesChoicesSelect = (tag_types_choices.length > 0 && tag_types_display ) ?
      <Select
        multiple={true}
        title={'Select Tag Types'}
        options={tag_types_choices}
        handleChange={this.handleMultiTagTypesChange}
      /> : '';


    const partsFields = (actionType === 'delete') ?
      <div>
        <p>Are you sure you want to delete: {part_name} ?</p>
      </div> : 
      <div>
        <Input
          readOnly
          title={'ID'}
          value={this.state.id}
        />

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
        
        <Input
          readOnly
          type={'text'}
          title={'Tag Types'}
          value={tagTypesValues}
          style={{ width: '250px'}}
        />

        <div style={{ display: 'flex', flexDirection: 'row'}}>
           <Button           
              type={'edit'}
              title={'Edit Tag Types'}
              action={this.displayTagTypes}
            />
          {tagTypesChoicesSelect}
        </div> 

        <TextArea
          type={'text'}
          title={'Part Description'}
          placeholder={'Enter the part description.'}
          rows={5}
          value={this.state.part_desc}
          handleChange={this.handlePartDesc}
        />


        <Input 
          type={'text'}
          title={'Base Part Cost'}
          placeholder={'Enter the base part cost.'}
          value={this.state.base_part_cost}
          handleChange={this.handleBasePartCost}
        />

        <Checkbox 
          title={'Set Custom Retail Part Cost?'}
          checked={this.state.set_custom_part_cost}
          handleChange={this.handleSetCustomPartCostChecked}
        />

        {showCustomRetailPartCostField}

        <Input 
          readOnly
          type={'text'}
          title={'Recommended Retail Part Cost'}
          defaultvalue={this.state.retail_part_cost}
          value={this.state.retail_part_cost}
        />

        <Checkbox
          title={'Part Active'}
          checked={this.state.is_active}
          handleChange={this.handleIsActiveChecked}
        />
        </div>

    return (
      <form>
        { partsFields }

        <CSRFToken />
        <Button
          type={'primary'}
          title={'Submit'}
          action={this.handleSubmit}
        />

        <Button
          type={'primary'}
          title={'Cancel'}
          action={this.props.handleCloseModal}
        />

      </form>
    );
  }
}

export default EditPartsForm;
