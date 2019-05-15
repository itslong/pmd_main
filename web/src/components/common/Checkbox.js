import React from 'react';

const Checkbox = (props) => {
  return (
    <div className="form-group">
      <label htmlFor={props.name} className="form-label">{props.title}</label>
      <label className="checkbox-inline">
        <input
          id={props.name}
          name={props.name}
          onChange={props.handleChange}
          value={props.value}
          checked={props.checked}
          type="checkbox"
        />
      </label>

    </div>
  );
}


export default Checkbox;
