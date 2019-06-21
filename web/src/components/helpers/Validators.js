
//must be two decimal places. Does not allow comma, limited to 99999.99
const moneyLimitSixRegEx = /^(0([.]\d{2})$)|^([1-9]{1}([.]\d{2})$)|^([1-9]{1}\d{0,4}([.]\d{2})$)/;

//must be 2 characters minimum. Must start and end with a character or digit. One hyphen allowed.
const lettersNumbersHyphenRegEx = /^(\w{1}\w*[-]?\w*\w{1})$/;

export {
  moneyLimitSixRegEx,
  lettersNumbersHyphenRegEx,
};
