import React from 'react';

const Input = (props) => {
  return (
    <div className='form-group'>
      <label htmlFor={props.name} className='form-label'>{props.title}</label>
      <input
        readOnly={props.readOnly}
        className='form-input'
        id={props.name}
        name={props.name}
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
        style={props.style}
      />
    </div>
  );
}

export default Input;
