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
  // subtotal_cost_all_parts
  // total_cost is base_cost * quantity
  const sum = partsArr.length > 0 ? partsArr.reduce((acc, { total_cost }) => {
    return acc + Number(total_cost);
  }, 0) : 0;

  return sum;
};

const allRelatedPartsRetailWithQuantitySubtotal = (partsArr) => {
  // subtotal_value-retail_all_parts: parts actual retail * quanty
  if (partsArr.length == 0) {
    return 0;
  }

  const sum = partsArr.map((partObj) => {
    const partRetail = calculatePartRetailWithQuantity(partObj);
    return partRetail;
  })
  .reduce((acc, val) => {
    return preciseRound(Number(acc) + parseFloat(val), 2);
  });

  return sum;
};

const allRelatedPartsRetailSubtotalCostWithMarkup = (partsArr, materialMarkupPercent) => {
  // Standard_part_retail: part's retail * material percent
  const materialPercent = parseFloat(materialMarkupPercent / 100);
  const sum = partsArr.length > 0 ? partsArr.reduce((acc, { part_retail_part_cost }) => {
    return acc + (parseFloat(part_retail_part_cost) * (parseInt(1) + materialPercent));
  }, 0) : 0;

  return sum;
};

const allRelatedPartsRetailWithMarkupAndQuantitySubtotal = (partsArr, materialMarkupPercent) => {
 // subtotal_standard-retail_single_part: (part's retail * markup) = "standard-retail" * quantity
  const materialPercent = parseFloat(materialMarkupPercent / 100);
  const sum = partsArr.length > 0 ? partsArr.reduce((acc, { part_retail_part_cost, quantity }) => {
    const standardRate = (parseFloat(part_retail_part_cost) * (parseInt(1) + materialPercent));
    return acc + (standardRate * quantity);
  }, 0) : 0;

  return sum;
}

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

const calculateProfitAllParts = (partsArr) => {
  const baseSubtotal = allRelatedPartsBaseSubtotalCost(partsArr);
  const retailSubtotal = allRelatedPartsRetailWithQuantitySubtotal(partsArr);
  const profit = preciseRound(parseFloat(retailSubtotal - baseSubtotal), 2);

  return profit;
};

const calculateTaxForAllRelatedPartsRetailSubtotal = (partsArr, tagTypeId, markupData) => {
  // part's retail only or "value retail"
  const markup =  markupData.find(markupObj => {
    return markupObj.id == tagTypeId;
  });

  const { parts_tax_percent } = markup;

  const partRetailSubtotal = allRelatedPartsRetailWithQuantitySubtotal(partsArr);
  const total = preciseRound((parseFloat(parts_tax_percent / 100) * parseFloat(partRetailSubtotal)), 2);

  return total;
};

const calculateTaxForAllRelatedPartsRetailMarkupWithQuantity = (partsArr, tagTypeId, markupData) => {
  // part's retail with markup or "standard retail"
  const markup =  markupData.find(markupObj => {
    return markupObj.id == tagTypeId;
  });

  const { parts_tax_percent, standard_material_markup_percent } = markup;

  const partRetailSubtotal = allRelatedPartsRetailWithMarkupAndQuantitySubtotal(partsArr, standard_material_markup_percent);
  const total = preciseRound((parseFloat(parts_tax_percent / 100) * parseFloat(partRetailSubtotal)), 2);

  return total;

};

const allRelatedPartsRetailIncludingTax = (partsArr, tagTypeId, markupData) => {
  const retailSubtotal = allRelatedPartsRetailWithQuantitySubtotal(partsArr);
  const tax = calculateTaxForAllRelatedPartsRetailSubtotal(partsArr, tagTypeId, markupData);
  const total = preciseRound(parseFloat(retailSubtotal) + parseFloat(tax), 2);

  return total;
};

export { 
  calculatePartsMainDisplayFields,
  calculatePartRetailWithMarkup,
  calculatePartRetailWithQuantity,
  allRelatedPartsBaseSubtotalCost,
  allRelatedPartsRetailSubtotalCostWithMarkup,
  allRelatedPartsRetailWithQuantitySubtotal,
  allRelatedPartsRetailWithMarkupAndQuantitySubtotal,
  allRelatedPartsRetailIncludingTax,
  calculateTaxForAllRelatedPartsRetailSubtotal,
  calculateTaxForAllRelatedPartsRetailMarkupWithQuantity,
  calculateProfitAllParts,
};
