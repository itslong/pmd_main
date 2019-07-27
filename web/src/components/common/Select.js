import React from 'react';

// options are passed in as an array and mapped over
const Select = (props) => {
  let placeholderOption = props.placeholder ? <option value='' disabled>{props.placeholder}</option> : '';

  return (
    <div>
      <label htmlFor={props.name}> {props.title} </label>
      <select
        className={props.className || 'form-select'}
        multiple={props.multiple}
        name={props.name}
        value={props.value}
        onChange={props.handleChange}
        style={props.style}
      >
      {placeholderOption}
      {props.options.map(({ id, ...option }) => {
        return (
          Object.entries(option).map((val, index) => {
            return (
              <option
                id={id}
                key={index}
                value={val[1]}
                data={val[0]}
                label={val[1]}>{val[1]}
              </option>
            )
          })
        )
      })}
      </select>
    </div>
  )
}

export default Select;
