import { 
  calculatePartRetailWithMarkup, 
  calculatePartRetailWithQuantity,
  allRelatedPartsBaseSubtotalCost,
  allRelatedPartsRetailSubtotalCostWithMarkup,
} from '../Parts';


const preciseRound = (x, decimalPlaces) => {
  return parseFloat(Math.round(x *  Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces);
};

const taskOnlyLaborCost = (taskObj, markupObj) => {
  const { estimated_contractor_hours, estimated_asst_hours } = taskObj;
  const { labor_cost_hourly_rate, asst_labor_cost_hourly_rate } = markupObj;

  const contractor = labor_cost_hourly_rate * estimated_contractor_hours;
  const asst = asst_labor_cost_hourly_rate * estimated_asst_hours;
  const laborTotal = Number(contractor + asst);

  return laborTotal;
};

const taskOnlyLaborRetail = (taskObj, markupObj) => {
  const { estimated_contractor_hours, estimated_asst_hours, use_fixed_labor_rate, fixed_labor_rate } = taskObj;
  const { labor_retail_hourly_rate, asst_labor_retail_hourly_rate } = markupObj;

  if (use_fixed_labor_rate) {
    return fixed_labor_rate;
  }

  const contractor = Number(labor_retail_hourly_rate) * estimated_contractor_hours;
  const asst = Number(asst_labor_retail_hourly_rate) * estimated_asst_hours;
  const laborTotal = Number(contractor + asst);

  return laborTotal;
};

const addonOnlyLaborCost = (addonObj, markupObj) => {
  const { estimated_contractor_minutes, estimated_asst_minutes } = addonObj;
  const { labor_cost_hourly_rate, asst_labor_cost_hourly_rate } = markupObj;

  const contractor = (labor_cost_hourly_rate / 60) * estimated_contractor_minutes;
  const asst = (asst_labor_cost_hourly_rate / 60) * estimated_asst_minutes;
  const laborTotal = Number(contractor + asst);

  return laborTotal;
};

const addonOnlyLaborRetail = (addonObj, markupObj) => {
  const { estimated_contractor_minutes, estimated_asst_minutes, use_fixed_labor_rate, fixed_labor_rate } = addonObj;
  const { labor_retail_hourly_rate, asst_labor_retail_hourly_rate } = markupObj;

  if (use_fixed_labor_rate) {
    return fixed_labor_rate;
  } 

  const contractor = (Number(labor_retail_hourly_rate) / 60) * estimated_contractor_minutes;
  const asst = (Number(asst_labor_retail_hourly_rate) / 60) * estimated_asst_minutes;
  const laborTotal = Number(contractor + asst);

  return laborTotal;
}

const taskOnlyTotalCost = (calcObj) => {
  const { related: partsArr, markup, ...taskCostObj } = calcObj;
  const { misc_tos_cost_hourly_rate } = markup;

  const partsSubtotalCost = allRelatedPartsBaseSubtotalCost(partsArr);
  const taskLaborCost = taskOnlyLaborCost(taskCostObj, markup);

  const total = preciseRound((partsSubtotalCost + taskLaborCost) + Number(misc_tos_cost_hourly_rate), 2);

  return total;
};

const addonOnlyTotalCost = (calcObj) => {
  const { related: partsArr, markup, ...addonCostObj } = calcObj;


  const partsSubtotalCost = allRelatedPartsBaseSubtotalCost(partsArr);
  const addonLaborCost = addonOnlyLaborCost(addonCostObj, markup);

  const total = preciseRound((partsSubtotalCost + addonLaborCost), 2);

  return total;
};

const taskOnlyStandardRate = (calcObj) => {
  const { related: partsArr, markup, ...taskRetailObj } = calcObj;
  const { standard_material_markup_percent, standard_labor_markup_percent, misc_tos_retail_hourly_rate } = markup;

  const partsSubtotalRetail = allRelatedPartsRetailSubtotalCostWithMarkup(partsArr, standard_material_markup_percent);
  const taskLaborRetail = taskOnlyLaborRetail(taskRetailObj, markup);
  const markupPercent = parseFloat(standard_material_markup_percent / 100);

  const materialMarkup = partsSubtotalRetail * (parseInt(1) + markupPercent);
  const laborMarkup = taskLaborRetail * (parseInt(1) + markupPercent);
  const total = preciseRound((materialMarkup + laborMarkup) + Number(misc_tos_retail_hourly_rate), 2);

  return total;
};

const addonOnlyStandardRate = (calcObj) => {
  const { related: partsArr, markup, ...addonRetailObj } = calcObj;
  const { standard_material_markup_percent, standard_labor_markup_percent } = markup;

  const partsSubtotalRetail = allRelatedPartsRetailSubtotalCostWithMarkup(partsArr, standard_material_markup_percent);
  const addonLaborRetail = addonOnlyLaborRetail(addonRetailObj, markup);
  const markupPercent = parseFloat(standard_material_markup_percent / 100);

  const materialMarkup = partsSubtotalRetail * (parseInt(1) + markupPercent);
  const laborMarkup = addonLaborRetail * (parseInt(1) + markupPercent);
  const total = preciseRound((materialMarkup + laborMarkup), 2);

  return total;
};

const calculateTasksMainDisplayFields = (taskArr, markupData, displayFields, calcFields) => {
  const filteredData = taskArr.map(item => {
    let filteredObj = {};
    let calculationObj = {};

    const markup = markupData.find(markupObj => {
      return markupObj.id === item.tag_types.id
    });


    let displayNames = Object.values(displayFields)
    let itemKeys = Object.keys(displayFields)

    itemKeys.map((data, index) => {
      Object.assign(filteredObj, {
        [displayNames[index]]: item[data]
      });
    });

    calcFields.map(calcName => {
      Object.assign(calculationObj, {
        [calcName]: item[calcName],
        markup
      });
    })

    let taskOnlyTotal = item.task_attribute == 'Task Only' ? taskOnlyTotalCost(calculationObj) : 'N/A';
    let addonOnlyTotal = item.task_attribute == 'Addon Only' ? addonOnlyTotalCost(calculationObj) : 'N/A';;
    let taskOnlyRate = item.task_attribute == 'Task Only' ? taskOnlyStandardRate(calculationObj) : 'N/A';
    let addonOnlyRate = item.task_attribute == 'Addon Only' ? addonOnlyStandardRate(calculationObj) : 'N/A';

    if (item.task_attribute == 'Addon And Task' || item.task_attribute == 'Task And Addon') {
      taskOnlyTotal = taskOnlyTotalCost(calculationObj);
      addonOnlyTotal = addonOnlyTotalCost(calculationObj);
      taskOnlyRate = taskOnlyStandardRate(calculationObj);
      addonOnlyRate = addonOnlyStandardRate(calculationObj);
    }

    Object.assign(filteredObj, {
      'Task Only Total Cost': taskOnlyTotal,
      'Addon Only Total Cost': addonOnlyTotal,
      'Task Only Standard Rate': taskOnlyRate,
      'Addon Only Standard Rate': addonOnlyRate,
    });

    return filteredObj;
  });

  return filteredData;
};



const calculateTaskDetailRelatedPartsTableFields = (partsArr, tagTypeId, markupData, displayFields) => {
  const markup = markupData.find(markupObj => {
    return markupObj.id == tagTypeId
  });

  const filteredParts = partsArr.map(item => {
    let filteredObj = {};
    let retailPriceObj = {};

    let displayNames = Object.values(displayFields)
    let itemKeys = Object.keys(displayFields)

    itemKeys.map((data, index) => {
      let filteredVal = item[data];

      if (data == 'part_retail_part_cost') {
        filteredVal = calculatePartRetailWithMarkup(item[data], markup);
        Object.assign(retailPriceObj, {
          [data]: filteredVal
        });
      }

      if (data == 'quantity') {
        Object.assign(retailPriceObj, {
          [data]: item[data]
        })
      }

      Object.assign(filteredObj, {
        [displayNames[index]]: filteredVal
      });
    });

    const retailPrice = item.calc_total_retail ? 
      item.calc_total_retail :
      calculatePartRetailWithQuantity(retailPriceObj);

    Object.assign(filteredObj, {
      'Total Retail Price': retailPrice
    });

    return filteredObj;
  });

  return filteredParts;
};

export { 
  calculateTasksMainDisplayFields,
  calculateTaskDetailRelatedPartsTableFields,
  calculatePartRetailWithMarkup,
  preciseRound,
};
