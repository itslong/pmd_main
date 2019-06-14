import { preciseRound } from '../Tasks';


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

const allRelatedPartsBaseSubtotalCost = (partsArr) => {
  const sum = partsArr.length > 0 ? partsArr.reduce((acc, { total_cost }) => {
    return acc + Number(total_cost);
  }, 0) : 0;

  return sum;
};

const allRelatedPartsRetailSubtotalCost = (partsArr, materialMarkupPercent) => {
  const materialPercent = parseFloat(materialMarkupPercent / 100);
  const sum = partsArr.length > 0 ? partsArr.reduce((acc, { part_retail_part_cost }) => {
    return acc + (Number(part_retail_part_cost) * (parseInt(1) + materialPercent));
  }, 0) : 0;

  return sum;
};

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

const allPartsRetailWithTax = () => {

}

const profitAllParts = () => {

}


export { 
  calculatePartsMainDisplayFields,
  calculatePartRetailWithMarkup,
  calculatePartRetailWithQuantity,
  allRelatedPartsBaseSubtotalCost,
  allRelatedPartsRetailSubtotalCost,
};
