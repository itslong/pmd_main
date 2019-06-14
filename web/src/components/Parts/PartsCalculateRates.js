import { preciseRound } from '../Tasks';


const calculatePartsMainDisplayFields = (partsArr, markupData, displayFields) => {
  const markupObj = markupData[0];
  const filteredData = partsArr.map(item => {
    const { retail_part_cost } = item;
    let filteredObj = {};


    let displayNames = Object.values(displayFields)
    let itemKeys = Object.keys(displayFields)

    itemKeys.map((data, index) => {
      Object.assign(filteredObj, {
        [displayNames[index]]: item[data]
      });
    });

    const retailPrice = calculatePartRetailWithMarkup(retail_part_cost, markupObj)

    Object.assign(filteredObj, {
      'Retail Price': retailPrice
    });

    return filteredObj;
  });

  return filteredData;
};

const calculatePartRetailWithMarkup = (partRetailCost, markupObj) => {
  const { standard_material_markup_percent } = markupObj;

  const newMarkup = parseInt(1) + parseFloat(standard_material_markup_percent / 100);
  const total = preciseRound(Number(partRetailCost) * newMarkup, 2);
  return total;
};

const calculatePartRetailWithQuantity = (retailPriceObj) => {
  const { part_retail_part_cost: partRetail, quantity } = retailPriceObj;

  return preciseRound(parseFloat(partRetail) * quantity, 2);
};

export { 
  calculatePartsMainDisplayFields,
  calculatePartRetailWithMarkup,
  calculatePartRetailWithQuantity,
};
