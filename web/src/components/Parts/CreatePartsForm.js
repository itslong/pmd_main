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
import { moneyLimitSixRegEx, lettersNumbersHyphenRegEx } from '../helpers';
import {   
  partNameErrorMsg,
  partNumLengthErrorMsg,
  partNumHyphensErrorMsg,
  partCostErrorMsg,
  tagTypesErrorMsg,
  fieldRequiredErrorMsg,
  fieldErrorStyle,
  fieldErrorInlineMsgStyle
} from './PartsValidators';


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
      partsMarkupData: [],
      formFieldErrors: {
        part_name: false,
        masterPartNum: false,
        basePartCost: false,
        tagTypes: false,
      },
      formFieldErrorMsgs: {
        part_name: '',
        masterPartNum: '',
        basePartCost: '',
        tagTypes: '',
      },
      formValid: false,
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
      redirectAfterSubmit: false,
      formFieldErrors: {
        ...this.state.formFieldErrors, 
        partName: false,
        masterPartNum: false,
        basePartCost: false,
        tagTypes: false,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        partName: '',
        masterPartNum: '',
        basePartCost: '',
        tagTypes: '',
      },
      formValid: false,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const formValid = this.validateFormState();

    if (!formValid) {
      return
    }

    const formData = this.getFormDataFromState();

    let create = CreatePart(formData);
    create.then(data => {
      console.log('created: ' + JSON.stringify(data))
      this.handleRedirectAfterSubmit();
    });
  }

  validateFormState() {
    const { formFieldErrors, part_name, master_part_num, base_part_cost, tag_types } = this.state;
    const { partName, masterPartNum, basePartCost, tagTypes } = formFieldErrors;

    // field must not be empy and no errors
    const partNameValid = part_name !== '' && !partName ? true : false;
    const partNumValid = master_part_num !== '' && !masterPartNum ? true : false;
    const partCostValid = base_part_cost !== '' && !basePartCost ? true : false;
    const tagTypesValid = tag_types.length !== 0 && !tagTypes ? true : false;

    const formValid = partNameValid && partNumValid && partCostValid && tagTypesValid ? true : false;

    if (!formValid) {
      this.setState({
        formValid: false,
        formFieldErrors: {
          ...this.state.formFieldErrors, 
          partName: !partNameValid,
          masterPartNum: !partNumValid,
          basePartCost: !partCostValid,
          tagTypes: !tagTypesValid,
        },
        formFieldErrorMsgs: {
          ...this.state.formFieldErrorMsgs,
          partName: fieldRequiredErrorMsg,
          masterPartNum: fieldRequiredErrorMsg,
          basePartCost: fieldRequiredErrorMsg,
          tagTypes: fieldRequiredErrorMsg,
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
        tagTypes: false,
      },
      formFieldErrorMsgs: {
        ...this.state.formFieldErrorMsgs,
        partName: '',
        masterPartNum: '',
        basePartCost: '',
        tagTypes: '',
      },
    });
    return formValid;
  }

  getFormDataFromState() {
    const {
      tagTypesAsValues,
      tagTypesChoices,
      tagTypesDisplay,
      is_active,
      redirectAfterSubmit,
      partsMarkupData,
      formFieldErrors,
      formFieldErrorMsgs,
      formValid,
      ...formData
    } = this.state;

    return formData;

  }

  handleRedirectAfterSubmit() {
    this.setState({ redirectAfterSubmit: true})
  }

  handlePartName(e) {
    const part_name = e.target.value;

    if (part_name.length < 3) {
      return this.setState({
        part_name: part_name,
        formFieldErrors: { ...this.state.formFieldErrors, partName: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, partName: partNameErrorMsg }
      });
    }

    this.setState({ 
      part_name: part_name,
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
      tagTypesAsValues: choicesAsValues,
      formFieldErrors: { ...this.state.formFieldErrors, tagTypes: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, tagTypes: '' },
    });
  }

  displayTagTypes(e) {
    e.preventDefault();
    this.setState({ tagTypesDisplay: !this.state.tagTypesDisplay });
  }

  handleBasePartCost(e) {
    const { partsMarkupData } = this.state;

    let partCost = e.target.value;
    const costObjValidated = moneyLimitSixRegEx.test(partCost);

    if (!costObjValidated) {
      return this.setState({
        base_part_cost: partCost,
        formFieldErrors: { ...this.state.formFieldErrors, basePartCost: true },
        formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, basePartCost: partCostErrorMsg },
      });
    }


    const costObj = calculateRetailCost(partCost, this.state.partsMarkupData);
    this.handleRetailPartCost(costObj);

    this.setState({ 
      base_part_cost: partCost,
      formFieldErrors: { ...this.state.formFieldErrors, basePartCost: false },
      formFieldErrorMsgs: { ...this.state.formFieldErrorMsgs, basePartCost: ''}
    });
  }


  handleRetailPartCost(costObj) {
    const { formFieldErrors } = this.state;
    const { markupId, retailCost } = costObj;

    this.setState({ 
      markup_percent_id: markupId,
      retail_part_cost: retailCost
    });
  }

  render() {
    const { 
      redirectAfterSubmit, tag_types, tagTypesChoices, tagTypesAsValues, 
      tagTypesDisplay, formFieldErrors, formFieldErrorMsgs, formValid
    } = this.state;
    if (redirectAfterSubmit) {
      return <Redirect to={PARTS_DISPLAY_PATH} />
    }

    const { basePartCost, partName, masterPartNum, tagTypes } = formFieldErrors;
    const { basePartCost: basePartMsg, partName: partNameMsg, masterPartNum: partNumMsg, tagTypes: tagTypesMsg } = formFieldErrorMsgs;

    const tagTypesValues = tagTypesAsValues.map(({ tag_name }) => tag_name).join(', ').toString();

    const tagTypesChoicesSelect = (tagTypesChoices.length > 0 && tagTypesDisplay) ?
      <Select
        multiple={true}
        title={'Select Tag Types'}
        options={tagTypesChoices}
        handleChange={this.handleMultiTagTypesChange}
      /> : '';

    const partNameErrorMsg = partName ?
      <p style={fieldErrorInlineMsgStyle}>{partNameMsg}</p>
      : ''; 

    const partNumErrorMsg = masterPartNum ?
      <p style={fieldErrorInlineMsgStyle}>{partNumMsg}</p>
      : ''; 

    const tagTypesErrorMsg = tagTypes ?
      <p style={fieldErrorInlineMsgStyle}>{tagTypesMsg}</p>
      : ''; 

    const basePartErrorMsg = basePartCost ?
      <p style={fieldErrorInlineMsgStyle}>{basePartMsg}</p>
      : '';


    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <div style={horizontalLayoutStyle}>
            <Input 
              type={'text'}
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
          
          <div style={horizontalLayoutStyle}>
            <Button           
              type={'edit'}
              title={'Select Tag Types'}
              action={this.displayTagTypes}
              style={tagTypes ? fieldErrorStyle : null}
            />
            {tagTypesChoicesSelect}
            {tagTypesErrorMsg}
          </div>
          
          <div style={horizontalLayoutStyle}>
            <Input 
              type={'text'}
              name={'basePartCost'}
              className={formFieldErrors.basePartCost ? 'error' : ''}
              title={'Base Part Cost'}
              placeholder={'Enter the base part cost.'}
              value={this.state.base_part_cost}
              handleChange={this.handleBasePartCost}
              style={basePartCost ? fieldErrorStyle : null}
            />
            {basePartErrorMsg}
          </div>

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

// remove when css is added
const horizontalLayoutStyle = {
  display: 'flex',
  flexDirection: 'row',
};

export default CreatePartsForm;
