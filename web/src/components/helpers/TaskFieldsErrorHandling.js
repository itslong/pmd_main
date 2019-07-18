
const taskNameErrorMsg = 'Task Name must be 3 or more characters.';
const taskIdLengthErrorMsg = 'The Task ID must be at least 3 or more numbers and less than 11 numbers.';
const taskIdHyphensErrorMsg = 'The Task ID cannot begin or end with a hyphen (-). Only 1 hypen allowed.';
const taskIdNumbersOnlyErrorMsg = 'The Task ID must contain only numbers: 0-9.';
const taskFixedLaborRateErrorMsg = 'Must be a positive number with (2) decimal places, greater than 0 or less than 99999.99. Must be in this format: 0.00';


export {
  taskNameErrorMsg,
  taskIdLengthErrorMsg,
  taskIdHyphensErrorMsg,
  taskFixedLaborRateErrorMsg,
  taskIdNumbersOnlyErrorMsg
};
