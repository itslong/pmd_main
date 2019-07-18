import { 
  calculatePartRetailWithMarkup, 
  calculatePartRetailWithQuantity,
  allRelatedPartsBaseSubtotalCost,
  allRelatedPartsRetailWithQuantitySubtotal,
  allRelatedPartsRetailSubtotalCostWithMarkup,
  allRelatedPartsRetailWithMarkupAndQuantitySubtotal,
  calculateTaxForAllRelatedPartsRetailSubtotal,
  calculateTaxForAllRelatedPartsRetailMarkupWithQuantity,
} from '../Parts';


const preciseRound = (x, decimalPlaces) => {
  return parseFloat(Math.round(x *  Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces)).toFixed(decimalPlaces);
};

const taskOnlyLaborCost = (taskObj, markupObj) => {
  //subtotal_cost_task_labor 
  const { estimated_contractor_hours, estimated_asst_hours, use_fixed_labor_rate, fixed_labor_rate } = taskObj;
  const { labor_cost_hourly_rate, asst_labor_cost_hourly_rate } = markupObj;

  if (use_fixed_labor_rate) {
    return fixed_labor_rate;
  }

  const contractor = labor_cost_hourly_rate * estimated_contractor_hours;
  const asst = asst_labor_cost_hourly_rate * estimated_asst_hours;
  const laborTotal = preciseRound(parseFloat(contractor) + parseFloat(asst), 2);

  return laborTotal;
};

const taskOnlyLaborRetail = (taskObj, markupObj) => {
  //subtotal_retail_task_labor
  const { estimated_contractor_hours, estimated_asst_hours, use_fixed_labor_rate, fixed_labor_rate } = taskObj;
  const { labor_retail_hourly_rate, asst_labor_retail_hourly_rate } = markupObj;

  if (use_fixed_labor_rate) {
    return fixed_labor_rate;
  }

  const contractor = labor_retail_hourly_rate * estimated_contractor_hours;
  const asst = asst_labor_retail_hourly_rate * estimated_asst_hours;
  const laborTotal = preciseRound(parseFloat(contractor + parseFloat(asst)), 2);

  return laborTotal;
};

const addonOnlyLaborCost = (addonObj, markupObj) => {
  //subtotal_cost_addon_labor
  const { estimated_contractor_minutes, estimated_asst_minutes, use_fixed_labor_rate, fixed_labor_rate } = addonObj;
  const { labor_cost_hourly_rate, asst_labor_cost_hourly_rate } = markupObj;

  if (use_fixed_labor_rate) {
    return fixed_labor_rate;
  }

  const contractor = (labor_cost_hourly_rate / 60) * estimated_contractor_minutes;
  const asst = (asst_labor_cost_hourly_rate / 60) * estimated_asst_minutes;
  const laborTotal = preciseRound(parseFloat(contractor) + parseFloat(asst), 2);

  return laborTotal;
};

const addonOnlyLaborRetail = (addonObj, markupObj) => {
  //subtotal_retail_addon_labor
  const { estimated_contractor_minutes, estimated_asst_minutes, use_fixed_labor_rate, fixed_labor_rate } = addonObj;
  const { labor_retail_hourly_rate, asst_labor_retail_hourly_rate } = markupObj;

  if (use_fixed_labor_rate) {
    return fixed_labor_rate;
  } 

  const contractor = (parseFloat(labor_retail_hourly_rate) / 60) * estimated_contractor_minutes;
  const asst = (parseFloat(asst_labor_retail_hourly_rate) / 60) * estimated_asst_minutes;
  const laborTotal = preciseRound(parseFloat(contractor) + parseFloat(asst), 2);

  return laborTotal;
}

const taskOnlyTotalCost = (calcObj) => {
  //main Task Display (retail without markup)
  const { related: partsArr, markup, ...taskCostObj } = calcObj;
  const { misc_tos_cost_hourly_rate } = markup;

  const partsSubtotalCost = allRelatedPartsBaseSubtotalCost(partsArr);
  const taskLaborCost = taskOnlyLaborCost(taskCostObj, markup);

  const total = preciseRound(parseFloat(partsSubtotalCost) + parseFloat(taskLaborCost) + parseFloat(misc_tos_cost_hourly_rate), 2);

  return total;
};

const addonOnlyTotalCost = (calcObj) => {
  //main Task Display (retailout with markup)
  const { related: partsArr, markup, ...addonCostObj } = calcObj;


  const partsSubtotalCost = allRelatedPartsBaseSubtotalCost(partsArr);
  const addonLaborCost = addonOnlyLaborCost(addonCostObj, markup);

  const total = preciseRound(parseFloat(partsSubtotalCost) + parseFloat(addonLaborCost), 2);

  return total;
};

const taskOnlyStandardRate = (calcObj) => {
  //total_standard-retail_task 
  const { related: partsArr, markup, ...taskRetailObj } = calcObj;
  const { standard_material_markup_percent, standard_labor_markup_percent, misc_tos_retail_hourly_rate } = markup;

  const partsSubtotalRetail = allRelatedPartsRetailWithMarkupAndQuantitySubtotal(partsArr, standard_material_markup_percent);
  const taskLaborRetail = taskOnlyLaborRetail(taskRetailObj, markup);

  const markupPercent = parseInt(1) + parseFloat(standard_labor_markup_percent / 100);
  const laborWithMarkup = parseFloat(taskLaborRetail) * markupPercent;

  const total = preciseRound(partsSubtotalRetail + laborWithMarkup + parseFloat(misc_tos_retail_hourly_rate), 2);

  return total;
};

const addonOnlyStandardRate = (calcObj) => {
  //total_standard-retail_addon 
  const { related: partsArr, markup, ...addonRetailObj } = calcObj;
  const { standard_material_markup_percent, standard_labor_markup_percent } = markup;

  const partsSubtotalRetail = allRelatedPartsRetailWithMarkupAndQuantitySubtotal(partsArr, standard_material_markup_percent);
  const addonLaborRetail = addonOnlyLaborRetail(addonRetailObj, markup);

  const markupPercent = parseInt(1) + parseFloat(standard_labor_markup_percent / 100);
  const laborWithMarkup = parseFloat(addonLaborRetail * markupPercent);

  const total = preciseRound(partsSubtotalRetail + laborWithMarkup, 2);
  return total;
};

const taskOrAddonLaborWithPartsRetail = (taskObj, partsArr, tagTypeId, markupData, taskAttrType) => {
  //total_value-retail_addon, total_value-retail_task
  const markup = createSingleMarkupObj(tagTypeId, markupData);

  const partRetailSubtotal = allRelatedPartsRetailWithQuantitySubtotal(partsArr);

  const labor = taskAttrType == 'task' ?
    taskOnlyLaborRetail(taskObj, markup)
    : addonOnlyLaborRetail(taskObj, markup)

  const rate = taskAttrType == 'task' ?
    markup.misc_tos_retail_hourly_rate
    : 0;

  const total = preciseRound(parseFloat(partRetailSubtotal) + parseFloat(labor) + parseFloat(rate), 2)

  return total;
};

const taskAddonLaborPartsRetailWithMarkup = (taskObj, partsArr, tagTypeId, markupData, taskAttrType) => {
  const markup = createSingleMarkupObj(tagTypeId, markupData);

  const { 
    estimated_asst_hours, estimated_asst_minutes, estimated_contractor_hours,
    estimated_contractor_minutes, fixed_labor_rate, use_fixed_labor_rate 
  } = taskObj;

  const calcObj = Object.assign({}, {
    estimated_asst_hours,
    estimated_asst_minutes,
    estimated_contractor_hours,
    estimated_contractor_minutes,
    use_fixed_labor_rate,
    fixed_labor_rate,
    markup,
    related: partsArr
  });

  const laborStandardRate = taskAttrType == 'task' ? taskOnlyStandardRate(calcObj) : addonOnlyStandardRate(calcObj);

  return preciseRound(laborStandardRate, 2);
}

const taxTotalForTaskAddonLaborWithPartsRetail = (taskObj, partsArr, tagTypeId, markupData, taskAttrType) => {
  //tax_total_value-retail_task, tax_total_value-retail_addon 
  const laborRetail = taskAttrType == 'task' ?
    taskOrAddonLaborWithPartsRetail(taskObj, partsArr, tagTypeId, markupData, 'task')
    : taskOrAddonLaborWithPartsRetail(taskObj, partsArr, tagTypeId, markupData, 'addon');

  const tax = calculateTaxForAllRelatedPartsRetailSubtotal(partsArr, tagTypeId, markupData);
  const total = preciseRound(parseFloat(laborRetail) + parseFloat(tax), 2);

  return total;
};

const taxTotalForTaskAddonLaborWithPartsRetailMarkup = (taskObj, partsArr, tagTypeId, markupData, taskAttrType) => {
  //tax_total_standard-retail_task, tax_total_standard-retail_addon
  const laborRetailMarkup = taskAttrType == 'task' ?
    taskAddonLaborPartsRetailWithMarkup(taskObj, partsArr, tagTypeId, markupData, 'task')
    : taskAddonLaborPartsRetailWithMarkup(taskObj, partsArr, tagTypeId, markupData, 'addon');

  const tax = calculateTaxForAllRelatedPartsRetailSubtotal(partsArr, tagTypeId, markupData);
  // const tax = calculateTaxForAllRelatedPartsRetailMarkupWithQuantity(partsArr, tagTypeId, markupData);
  const total = preciseRound(parseFloat(laborRetailMarkup) + parseFloat(tax), 2);

  return total;
};

const profitTaskOrAddonLabor = (taskObj, tagTypeId, markupData, taskAttrType) => {
  //profit_task_labor, profit_addon_labor 
  const markup = createSingleMarkupObj(tagTypeId, markupData);

  const retail = taskAttrType == 'task' ?
    taskOnlyLaborRetail(taskObj, markup)
    : addonOnlyLaborRetail(taskObj, markup);

  const cost = taskAttrType == 'task' ?
    taskOnlyLaborCost(taskObj, markup)
    : addonOnlyLaborCost(taskObj, markup);

  const profit = preciseRound(parseFloat(retail) - parseFloat(cost), 2);

  return profit;
};

const profitTaskOrAddonRetail = (taskObj, partsArr, tagTypeId, markupData, taskAttrType) => {
  //profit_value-retail_task, profit_value-retail_addon
  const calcObj = createCalcObj(taskObj, partsArr, tagTypeId, markupData);

  const retail = taskAttrType == 'task' ?
    taskOrAddonLaborWithPartsRetail(taskObj, partsArr, tagTypeId, markupData, 'task')
    : taskOrAddonLaborWithPartsRetail(taskObj, partsArr, tagTypeId, markupData, 'addon');

  const cost = taskAttrType == 'task' ?
    taskOnlyTotalCost(calcObj)
    : addonOnlyTotalCost(calcObj);

  const total = preciseRound(parseFloat(retail) - parseFloat(cost), 2);

  return total;
};

const profitTaskOrAddonRetailWithMarkup = (taskObj, partsArr, tagTypeId, markupData, taskAttrType) => {
  //profit_standard-retail_task, profit_value-retail_addon 
  const calcObj = createCalcObj(taskObj, partsArr, tagTypeId, markupData);

  const retail = taskAttrType == 'task' ?
    taskOnlyStandardRate(calcObj)
    : addonOnlyStandardRate(calcObj);

  const cost = taskAttrType == 'task' ?
    taskOnlyTotalCost(calcObj)
    : addonOnlyTotalCost(calcObj);

  const total = preciseRound(parseFloat(retail) - parseFloat(cost), 2);

  return total;
}

const profitMiscTos = (tagTypeId, markupData) => {
  const markup = createSingleMarkupObj(tagTypeId, markupData);

  const { misc_tos_retail_hourly_rate, misc_tos_cost_hourly_rate } = markup;
  const miscTosRate = preciseRound(parseFloat(misc_tos_retail_hourly_rate - misc_tos_cost_hourly_rate), 2);

  return miscTosRate;
};


const createSingleMarkupObj = (tagTypeId, markupData) => {
  const markup = markupData.find(markupObj => {
    return markupObj.id == tagTypeId
  });

  return markup;
};

const createCalcObj = (taskObj, partsArr, tagTypeId, markupData) => {
  const markup = createSingleMarkupObj(tagTypeId, markupData);

  const { 
    estimated_asst_hours, estimated_asst_minutes, estimated_contractor_hours,
    estimated_contractor_minutes, fixed_labor_rate, use_fixed_labor_rate 
  } = taskObj;

  const calcObj = Object.assign({}, {
    estimated_asst_hours,
    estimated_asst_minutes,
    estimated_contractor_hours,
    estimated_contractor_minutes,
    use_fixed_labor_rate,
    fixed_labor_rate,
    markup,
    related: partsArr
  });

  return calcObj;
};


const calculateTasksMainDisplayFields = (taskArr, markupData, displayFields, calcFields) => {
  const filteredData = taskArr.map(item => {
    let filteredObj = {};
    let calculationObj = {};

    const markup = createSingleMarkupObj(item.tag_types.id, markupData);


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
  const markup = createSingleMarkupObj(tagTypeId, markupData);

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
  preciseRound,
  createSingleMarkupObj,
  createCalcObj,
  taskOnlyLaborCost,
  addonOnlyLaborCost,
  taskOnlyLaborRetail,
  addonOnlyLaborRetail,
  taskOrAddonLaborWithPartsRetail,
  taskOnlyStandardRate,
  addonOnlyStandardRate,
  profitTaskOrAddonLabor,
  profitMiscTos,
  taxTotalForTaskAddonLaborWithPartsRetail,
  profitTaskOrAddonRetail,
  taxTotalForTaskAddonLaborWithPartsRetailMarkup,
  profitTaskOrAddonRetailWithMarkup

};
