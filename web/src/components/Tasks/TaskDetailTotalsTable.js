import React, { Component } from 'react';

import { Table, Button } from '../common';


class TaskDetailTotalsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      displayTotalsTable: true,
      totalsData: this.props.data,
      displayTaskButton: false,
      displayAddonButton: false,
      taskAttr: '',
    };

    this.handleTaskAttributeCalculations = this.handleTaskAttributeCalculations.bind(this);
  }

  componentDidMount() {
    const { task } = this.props.data;
    const { task_attribute } = task;

    const taskAttr = task_attribute.toLowerCase();

    if (taskAttr == 'addon and task') {
      return this.setState({
        displayTaskButton: true,
        displayAddonButton: true,
        taskAttr: 'both',
      });
    }

    if (taskAttr == 'task only') {
      return this.setState({
        displayTaskButton: true,
        taskAttr: 'task',
      });
    }

    this.setState({
      displayAddonButton: true,
      taskAttr: 'addon',
    });
  }

  handleTaskAttributeCalculations(e) {
    const { itemData, relatedChildData, globalMarkup, tagTypes } = this.state;
    const name = e.target.name;

    // const totalsTableData = (itemData, relatedChildData, tagTypes.id, globalMarkup)
    // this.setState({

    // })
    // const stuff = createTaskDetailTotalsTableData(itemData, relatedChildData, tagTypes.id, globalMarkup)
  }

  render() {
    const { totalsData } = this.state;

    return (
      <div>
        <Table
          data={totalsData}
          headerText={''}
          rowType={''}
/*          extraColHeaders={}
          extraRowProps={}
          extraPropsLayout={}
          numberOfLinks={}*/
        />
      </div>
    );  
  }
};

export default TaskDetailTotalsTable;
