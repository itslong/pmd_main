import React, { Component } from 'react';

import { Table, Button } from '../common';
import { createTaskDetailTotalsTableData } from '../CalculationsWithGlobalMarkup';


class TaskDetailTotalsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayTotalsTable: true,
      totalsData: this.props.data,
      displayTaskTable: false,
      displayAddonTable: false,
      taskAttr: '',
      totalsTableTaskData: [],
      totalsTableAddonData: [],
    };

    this.toggleTotalsTableButton = this.toggleTotalsTableButton.bind(this);
  }

  componentDidMount() {
    const { task, parts, tagType, markup } = this.props.data;
    const { task_attribute } = task;

    const taskAttr = task_attribute.toLowerCase();
    const totalsTableTaskData = createTaskDetailTotalsTableData(task, parts, tagType.id, markup, 'task')
    const totalsTableAddonData = createTaskDetailTotalsTableData(task, parts, tagType.id, markup, 'addon')

    if (taskAttr == 'addon and task') {
      return this.setState({
        displayTaskTable: true,
        displayAddonTable: true,
        taskAttr: 'both',
        totalsTableTaskData,
        totalsTableAddonData,
      });
    }

    if (taskAttr == 'task only') {
      return this.setState({
        displayTaskTable: true,
        taskAttr: 'task',
        totalsTableTaskData,
      });
    }

    this.setState({
      displayAddonTable: true,
      taskAttr: 'addon',
      totalsTableAddonData,
    });
  }

  toggleTotalsTableButton(e) {
    const name = (e.target.name).toString();
    const nameCapitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const tableStateName = 'display' + nameCapitalized + 'Table';

    this.setState({
      [tableStateName]: !this.state[tableStateName]
    });
  }


  render() {
    const { 
      totalsData, taskAttr, displayTaskTable, displayAddonTable,
      totalsTableTaskData, totalsTableAddonData
    } = this.state;

    const taskButtonName = displayTaskTable ? 'Hide' : 'Display';
    const addonButtonName = displayAddonTable ? 'Hide' : 'Display';

    const totalsTaskTable = displayTaskTable ?
      <Table
        data={totalsTableTaskData}
        dblTableHeaders={true}
        dblTableHeaderText={'Task Table'}
        dblStyleType={'task'}
      /> : '';

    const totalsAddonTable = displayAddonTable ?
      <Table
        data={totalsTableAddonData}
        dblTableHeaders={true}
        dblTableHeaderText={'Addon Table'}
        dblStyleType={'addon'}
      /> : '';

    if (taskAttr == 'both') {
      return (
        <div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Button
              type={'primary'}
              name={'task'}
              title={`${taskButtonName} task totals table`}
              action={this.toggleTotalsTableButton}
            />
            <Button
              type={'primary'}
              name={'addon'}
              title={`${addonButtonName} addon totals table`}
              action={this.toggleTotalsTableButton}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {totalsTaskTable}
            {totalsAddonTable}
          </div>
        </div>
      );
    }


    const buttonName = taskAttr == 'task' ? taskButtonName : addonButtonName;
    const tableData = totalsTableTaskData.length > 0 ? totalsTableTaskData : totalsTableAddonData;

    return (
      <div>
        <Button
          type={'primary'}
          name={`${taskAttr}`}
          title={`${buttonName} ${taskAttr} totals table`}
          action={this.toggleTotalsTableButton}
        />
        {totalsTaskTable}
        {totalsAddonTable}
      </div>
    );  
  }
};

export default TaskDetailTotalsTable;
