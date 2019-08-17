import React from 'react';
import { Button, Select } from './common';


const tagOptions = [
  {'drain_cleaning': 'Drain Cleaning'},
  {'plumbing': 'Plumbing'},
  {'water_heater': 'Water Heater'},
  {'misc': 'Misc'},
];

const filterStyle = {
  display: 'flex',
  maxHeight: '25px',
};

const Filter = ({ filterByName, changeFilterAction, handleResetFilter }) => {

  return (
    <div style={filterStyle}>
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
