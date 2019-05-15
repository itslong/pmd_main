import { calculatePartRetailWithMarkup } from '../Tasks';


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

export default calculatePartsMainDisplayFields;
