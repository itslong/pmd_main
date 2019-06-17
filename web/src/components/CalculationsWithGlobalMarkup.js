import { 
  calculateTasksMainDisplayFields,
  calculateTaskDetailRelatedPartsTableFields,
  createSingleMarkupObj,
  createCalcObj,
  taskOnlyLaborCost,
  addonOnlyLaborCost,
  taskOnlyLaborRetail,
  taskOrAddonLaborWithPartsRetail,
  taskOnlyStandardRate,
  addonOnlyStandardRate,
  profitTaskOrAddonLabor,
  profitMiscTos,
  taxTotalForTaskAddonLaborWithPartsRetail,
  profitTaskOrAddonRetail,
  taxTotalForTaskAddonLaborWithPartsRetailMarkup,
  profitTaskOrAddonRetailWithMarkup
} from './Tasks';
// import { calculatePartsMainDisplayFields } from './PartsCalculateRates';
import { 
  calculatePartsMainDisplayFields,
  allRelatedPartsBaseSubtotalCost,
  allRelatedPartsRetailWithQuantitySubtotal,
  calculateTaxForAllRelatedPartsRetailSubtotal,
  calculateProfitAllParts,
  allRelatedPartsRetailIncludingTax,
} from './Parts';

const renameAndRebuildMainDisplayFields = (type, dataArr, markupData, displayFields, calcFields) => {
  const fields = type == 'tasks' ?
    calculateTasksMainDisplayFields(dataArr, markupData, displayFields, calcFields) 
    : calculatePartsMainDisplayFields(dataArr, markupData, displayFields);
  
  return fields;
};

const renameAndRebuildRelatedPartsDisplayFields = (dataArr, tagTypeId, markupData, displayFields) => {
  return calculateTaskDetailRelatedPartsTableFields(dataArr, tagTypeId, markupData, displayFields);
};

const createTaskDetailTotalsTableData = (taskObj, partsArr, tagTypeId, markupData) => {
  const markupObj = createSingleMarkupObj(tagTypeId, markupData);
  const calcObj = createCalcObj(taskObj, partsArr, tagTypeId, markupData);

  //check taskData.task_attribute
  const { task_attribute } = taskObj;

  // let taskType = task_attribute == 'Task Only' ? 'task' : 'addon';
  let taskType = 'task'

  const customerTotal = createTotalsTableCustomerTotal(taskObj, partsArr, tagTypeId, markupData, taskType);
  const costs = createTotalsTableCosts(taskObj, partsArr, tagTypeId, markupData, taskType);
  const retail = createTotalsTableRetail(taskObj, partsArr, tagTypeId, markupData, taskType);
  const tax = createTotalsTableSalesTax(partsArr, tagTypeId, markupData);
  const profit = createTotalsTableProfit(taskObj, partsArr, tagTypeId, markupData, taskType);

  const totalsTableArr = [customerTotal, costs, retail, tax, profit];

  return totalsTableArr;
}

const createTotalsTableCustomerTotal = (taskObj, partsArr, tagTypeId, markupData, taskType) => {
  const markupObj = createSingleMarkupObj(tagTypeId, markupData);
  const { misc_tos_retail_hourly_rate } = markupObj;
 
  const totalParts = allRelatedPartsRetailIncludingTax(partsArr, tagTypeId, markupData);
  const totalLabor = taskType == 'task' ? taskOnlyLaborRetail(taskObj, markupObj) : addonOnlyLaborRetail(taskObj, markupObj);
  const totalMisc = taskType == 'task' ? misc_tos_retail_hourly_rate : 'N/A';
  const totalValue = taxTotalForTaskAddonLaborWithPartsRetail(taskObj, partsArr, tagTypeId, markupData, taskType);
  const totalStandard = taxTotalForTaskAddonLaborWithPartsRetailMarkup(taskObj, partsArr, tagTypeId, markupData, taskType);
  
  const totalObj = {
    totalParts,
    totalLabor,
    totalMisc,
    totalValue,
    totalStandard
  };

  return totalObj
}

const createTotalsTableCosts = (taskObj, partsArr, tagTypeId, markupData, taskType) => {
  const markupObj = createSingleMarkupObj(tagTypeId, markupData);
  const { misc_tos_cost_hourly_rate } = markupObj;

  const costParts = allRelatedPartsBaseSubtotalCost(partsArr);
  const costLabor = taskType == 'task' ? taskOnlyLaborCost(taskObj, markupObj) : addonOnlyLaborCost(taskObj, markupObj);
  const costMisc = taskType == 'task' ? misc_tos_cost_hourly_rate : 'N/A';
  const costValue = 'N/A';
  const costStandard = 'N/A';
  
  const costObj = {
    costParts,
    costLabor,
    costMisc,
    costValue,
    costStandard,
  };

  return costObj;
}

const createTotalsTableRetail = (taskObj, partsArr, tagTypeId, markupData, taskType) => {
  const markupObj = createSingleMarkupObj(tagTypeId, markupData);
  const { misc_tos_retail_hourly_rate } = markupObj;
  const calcObj = createCalcObj(taskObj, partsArr, tagTypeId, markupData);

  const retailParts = allRelatedPartsRetailWithQuantitySubtotal(partsArr);
  const retailLabor = taskType == 'task' ? taskOnlyLaborRetail(taskObj, markupObj) : addonOnlyLaborRetail(taskObj, markupObj);
  const retailMisc = taskType == 'task' ? misc_tos_retail_hourly_rate : 'N/A';
  const retailValue = taskOrAddonLaborWithPartsRetail(taskObj, partsArr, tagTypeId, markupData, taskType);
  const retailStandard = taskType == 'task' ? taskOnlyStandardRate(calcObj) : addonOnlyStandardRate(calcObj);
  const retailObj = {
    retailParts,
    retailLabor,
    retailMisc,
    retailValue,
    retailStandard
  };

  return retailObj;
}

const createTotalsTableSalesTax = (partsArr, tagTypeId, markupData) => {
  const taxParts = calculateTaxForAllRelatedPartsRetailSubtotal(partsArr, tagTypeId, markupData);
  const taxLabor = 'N/A';
  const taxMisc = 'N/A';
  const taxValue = 'N/A';
  const taxStandard = 'N/A';
  const taxObj = {
    taxParts,
    taxLabor,
    taxMisc,
    taxValue,
    taxStandard
  };

  return taxObj;
};

const createTotalsTableProfit = (taskObj, partsArr, tagTypeId, markupData, taskType) => {
  const profitParts = calculateProfitAllParts(partsArr);
  const profitLabor = profitTaskOrAddonLabor(taskObj, tagTypeId, markupData, taskType);
  const profitMisc = taskType == 'task' ? profitMiscTos(tagTypeId, markupData) : 'N/A';
  const profitValue = profitTaskOrAddonRetail(taskObj, partsArr, tagTypeId, markupData, taskType)
  const profitStandard = profitTaskOrAddonRetailWithMarkup(taskObj, partsArr, tagTypeId, markupData, taskType)
  const profitObj = {
    profitParts,
    profitLabor,
    profitMisc,
    profitValue,
    profitStandard
  };

  return profitObj;
};

export {
  renameAndRebuildMainDisplayFields,
  renameAndRebuildRelatedPartsDisplayFields,
  createTaskDetailTotalsTableData,
}
