
const partNameErrorMsg = 'Part Name must be 3 or more characters.';
const partNumLengthErrorMsg = 'The Part Number must be at least 3 or more characters and less than 11 characters.';
const partNumHyphensErrorMsg = 'The Part Number cannot begin or end with a hyphen (-). Only 1 hypen allowed.';
const partCostErrorMsg = 'Must be a positive number with (2) decimal places, greater than 0 or less than 99999.99. Must be in this format: 0.00';
const tagTypesErrorMsg = 'Must select at least one or more tag types.';
const fieldRequiredErrorMsg = 'This field is required.';

// remove when css is added.
const fieldErrorStyle = {
  border: '1px solid red',
};

const fieldErrorInlineMsgStyle = {
  color: 'red',
  paddingLeft: '20px',
};

export {
  partNameErrorMsg,
  partNumLengthErrorMsg,
  partNumHyphensErrorMsg,
  partCostErrorMsg,
  tagTypesErrorMsg,
  fieldRequiredErrorMsg,
  fieldErrorStyle,
  fieldErrorInlineMsgStyle,
};
