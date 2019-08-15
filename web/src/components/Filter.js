import React from 'react';
import { Button, Select } from './common';


const tagOptions = [
  {'drain_cleaning': 'Drain Cleaning'},
  {'plumbing': 'Plumbing'},
  {'water_heater': 'Water Heater'},
  {'misc': 'Misc'},
];

const Filter = ({ filterByName, changeFilterAction, handleResetFilter }) => {

  return (
    <div style={{ display: 'flex' }}>
      <Select
        placeholder={'Filter by...'}
        value={filterByName}
        options={tagOptions}
        handleChange={changeFilterAction}
      />
      <Button
        type={'primary'}
        title={'Reset Filter'}
        action={handleResetFilter}
      />
    </div>
  );
}

export default Filter;
