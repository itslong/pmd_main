
const taskNameErrorMsg = 'Task Name must be 3 or more characters.';
const taskIdLengthErrorMsg = 'The Task ID must be at least 3 or more characters and less than 11 characters.';
const taskIdHyphensErrorMsg = 'The Task ID cannot begin or end with a hyphen (-). Only 1 hypen allowed.';
const taskFixedLaborRateErrorMsg = 'Must be a positive number with (2) decimal places, greater than 0 or less than 99999.99. Must be in this format: 0.00';


export {
  taskNameErrorMsg,
  taskIdLengthErrorMsg,
  taskIdHyphensErrorMsg,
  taskFixedLaborRateErrorMsg,
};
