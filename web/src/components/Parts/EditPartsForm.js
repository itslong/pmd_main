import React, { Component } from 'react';

import { Input, Button, TextArea, Checkbox, Select } from '../common';
import { calculateRetailCost } from './CalculatePartsCustomMarkupField';
import { 
  FetchPart,
  UpdatePart,
  GetPartsMarkupPercents,
  FetchTagTypesChoices,
  CSRFToken
} from '../endpoints';
import { moneyLimitSixRegEx, lettersNumbersHyphenRegEx } from '../helpers';
import {   
  partNameErrorMsg,
  partNumLengthErrorMsg,
  partNumHyphensErrorMsg,
  partCostErrorMsg,
  customRetailErrorMsg,
  fieldRequiredErrorMsg,
  fieldErrorStyle,
  fieldErrorInlineMsgStyle,
  horizontalLayoutStyle
} from '../helpers';


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
      custom_retail_part_cost: '0.00',
      retail_part_cost: '',
      is_active: true,
      actionType: this.props.actionType,
      partsMarkupData: [],
      formFieldErrors: {
        partName: false,
        masterPartNum: false,
        basePartCost: false,
        customRetail: false,
      },
      formFieldErrorMsgs: {
        partName: '',
        masterPartNum: '',
        basePartCost: '',
        customRetail: '',
      },
      formValid: false,
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
        partsMarkupData: markups,
        tag_types_choices: tagsChoices
      })
    })
    .catch(err => {
      console.log('Error from fetching a single part', err);
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    const formValid = this.validateFormState();

    if (!formValid) {
      return;
    }

    const formData = this.getFormDataFromState();
    if (this.state.actionType === 'delete') {
      formData.is_active = false;
    }

    let update = UpdatePart(this.state.id, formData);
    update.then(() => {
      this.props.itemEdit();
      this.props.handleCloseModal();
      this.props.handleShowDialog();
    })
  }

  validateFormState() {
    const { 
      formFieldErrors, part_name, master_part_num, base_part_cost,
      set_custom_part_cost, custom_retail_part_cost
    } = this.state;
    const { partName, masterPartNum, basePartCost, customRetail } = formFieldErrors;

    // field must not be empy and no errors
    const partNameValid = part_name !== '' && !partName ? true : false;
    const partNumValid = master_part_num !== '' && !masterPartNum ? true : false;
    const partCostValid = base_part_cost !== '' && !basePartCost ? true : false;

    let customRetailValid = true;

    if (set_custom_part_cost) {
      customRetailValid = custom_retail_part_cost !== '' && !customRetail ? true : false;
    }

    const formValid = partNameValid && partNumValid && partCostValid && customRetailValid ? true : false;

    if (!formValid) {
      this.setState({
        formValid: false,
        formFieldErrors: {
          ...this.state.formFieldErrors, 
          partName: !partNameValid,
          masterPartNum: !partNumValid,
          basePartCost: !partCostValid,
          customRetail: !customRetailValid,
        },
        formFieldErrorMsgs: {
          ...this.state.formFieldErrorMsgs,
          partName: fieldRequiredErrorMsg,
          masterPartNum: fieldRequiredErrorMsg,
          basePartCost: fieldRequiredErrorMsg,
          customRetail: fieldRequiredErrorMsg,
        },
      });
      return false;
    }

    this.setState({ 
      formValid,
      formFieldErrors: {
        ...this.state.formFieldErrors, 
        partName: false,
        masterPartNum: false,
        basePartCost: false,
        customRetail: false,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        partName: '',
        masterPartNum: '',
        basePartCost: '',
        customRetail: '',
      },
    });
    return formValid;
  }

  getFormDataFromState() {
    const {
      tag_types_as_values,
      tag_types_choices,
      tag_types_display,
      partsMarkupData,
      actionType,
      formFieldErrors,
      formFieldErrorMsgs,
      formValid,
      ...formData
    } = this.state;

    return formData;
  }

  handlePartName(e) {
    const partName = e.target.value;

    if (partName.length < 3) {
      return this.setState({
        part_name: partName,
        formFieldErrors: { ...this.state.formFieldErrors, partName: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, partName: partNameErrorMsg }
      });
    }

    this.setState({ 
      part_name: partName,
      formFieldErrors: { ...this.state.formFieldErrors, partName: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, partName: '' }
    });
  }

  handleMasterPartNum(e) {
    const partNum = e.target.value;

    const partNumValidated = lettersNumbersHyphenRegEx.test(partNum);
    const lengthValid = partNum.length < 3 || partNum.length > 10 ? false : true;


    if (!lengthValid || !partNumValidated) {
      // check if length is satisfied.
      const errorMsg = !lengthValid ? partNumLengthErrorMsg : partNumHyphensErrorMsg;

      return this.setState({
        master_part_num: partNum,
        formFieldErrors: { ...this.state.formFieldErrors, masterPartNum: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, masterPartNum: errorMsg }
      });
    }

    this.setState({ 
      master_part_num: partNum,
      formFieldErrors: { ...this.state.formFieldErrors, masterPartNum: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, masterPartNum: '' },
    });
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
    const { set_custom_part_cost, partsMarkupData } = this.state;

    const partCost = e.target.value;
    const costObjValidated = moneyLimitSixRegEx.test(partCost);

    if (!costObjValidated) {
      return this.setState({
        base_part_cost: partCost,
        formFieldErrors: { ...this.state.formFieldErrors, basePartCost: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, basePartCost: partCostErrorMsg },
      });
    }

    this.setState({ 
      base_part_cost: partCost,
      formFieldErrors: { ...this.state.formFieldErrors, basePartCost: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, basePartCost: ''}
    }, () => {
      if (!set_custom_part_cost) {
        // must reference 'this.state.base_part_cost' to get the value AFTER setState.
        const costObj = calculateRetailCost(this.state.base_part_cost, partsMarkupData);
        this.handleRetailPartCost(costObj);
      }
    });
  }

  handleSetCustomPartCostChecked(e) {
    //when checked, forces an error to the user to set the custom retail.
    const initialCustomRetailCost = e.target.checked ? '' : '0.00';

    this.setState({ 
      set_custom_part_cost: e.target.checked,
      custom_retail_part_cost: initialCustomRetailCost,
    }, () => {
      if (!this.state.set_custom_part_cost) {
        // must reference state directly to get the value AFTER setState.
        const costObj = calculateRetailCost(this.state.base_part_cost, this.state.partsMarkupData);
        this.handleRetailPartCost(costObj);
      }
    });
  }

  handleCustomRetailPartCost(e) {
    const customRetailCost = e.target.value;

    const costObjValidated = moneyLimitSixRegEx.test(customRetailCost);

    if (!costObjValidated) {
      return this.setState({
        retail_part_cost: customRetailCost,
        custom_retail_part_cost: customRetailCost,
        formFieldErrors: { ...this.state.formFieldErrors, customRetail: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, customRetail: partCostErrorMsg },
      });
    }

    this.setState({
      markup_percent_id: 9999, 
      custom_retail_part_cost: customRetailCost,
      retail_part_cost: customRetailCost,
      formFieldErrors: { ...this.state.formFieldErrors, customRetail: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, customRetail: ''}
    });
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

  handleRetailPartCost(costObj) {
    const { markupId, retailCost } = costObj;

    this.setState({ 
      markup_percent_id: markupId, 
      retail_part_cost: retailCost
    });
  }

  render() {
    const {
      actionType, part_name, tag_types, tag_types_display, tag_types_choices,
      tag_types_as_values, formFieldErrors, formFieldErrorMsgs
    } = this.state;

    const { basePartCost, partName, masterPartNum, customRetail } = formFieldErrors;
    const { basePartCost: basePartMsg, partName: partNameMsg, masterPartNum: partNumMsg, customRetail: customRetailMsg } = formFieldErrorMsgs;


    const tagTypesValues = tag_types_as_values.map(({ tag_name }) => tag_name).join(', ').toString();

    const tagTypesChoicesSelect = (tag_types_choices.length > 0 && tag_types_display ) ?
      <Select
        multiple={true}
        title={'Select Tag Types'}
        options={tag_types_choices}
        handleChange={this.handleMultiTagTypesChange}
      /> : '';

    const partNameErrorMsg = partName ?
      <p style={fieldErrorInlineMsgStyle}>{partNameMsg}</p>
      : '';

    const partNumErrorMsg = masterPartNum ?
      <p style={fieldErrorInlineMsgStyle}>{partNumMsg}</p>
      : '';

    const basePartErrorMsg = basePartCost ?
      <p style={fieldErrorInlineMsgStyle}>{basePartMsg}</p>
      : '';

    const customRetailErrorMsg = customRetail ?
      <p style={fieldErrorInlineMsgStyle}>{customRetailMsg}</p>
      : '';

    const showCustomRetailPartCostField = this.state.set_custom_part_cost ?
      <div style={horizontalLayoutStyle}>
        <Input 
          type={'text'}
          className={formFieldErrors.customRetail ? 'error' : ''}
          title={'Enter Custom Retail Part Cost'}
          placeholder={'Enter a custom retail part cost.'}
          value={this.state.custom_retail_part_cost}
          handleChange={this.handleCustomRetailPartCost}
          style={customRetail ? fieldErrorStyle : null}
        />
        {customRetailErrorMsg}
      </div> : '';

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

        <div style={horizontalLayoutStyle}>
          <Input
            type={'text'}
            className={formFieldErrors.basePartCost ? 'error' : ''}
            title={'Part Name'}
            placeholder={'Enter the new part name.'}
            value={this.state.part_name}
            handleChange={this.handlePartName}
            style={partName ? fieldErrorStyle : null}
          />
          {partNameErrorMsg}
        </div>

        <div style={horizontalLayoutStyle}>
          <Input 
            type={'text'}
            className={formFieldErrors.masterPartNum ? 'error': ''}
            title={'Master Part Number'}
            placeholder={'Enter the master part number.'}
            value={this.state.master_part_num}
            handleChange={this.handleMasterPartNum}
            style={masterPartNum ? fieldErrorStyle : null}
          />
          {partNumErrorMsg}
        </div>

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

        <div style={horizontalLayoutStyle}>
          <Input
            type={'text'}
            className={formFieldErrors.basePartCost ? 'error' : ''}
            title={'Base Part Cost'}
            placeholder={'Enter the base part cost.'}
            value={this.state.base_part_cost}
            handleChange={this.handleBasePartCost}
            style={basePartCost ? fieldErrorStyle : null}
          />
          {basePartErrorMsg}
        </div>

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
