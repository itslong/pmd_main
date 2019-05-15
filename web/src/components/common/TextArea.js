import React from 'react';

const TextArea = (props) => {
  return (
    <div>
      <label htmlFor={props.name} className='form-label'>{props.title}</label>
      <textarea
        className='form-control'
        id={props.name}
        name={props.name}
        rows={props.rows}
        cols={props.cols}
        type={props.type}
        value={props.value}
        onChange={props.handleChange}
        placeholder={props.placeholder}
      />
    </div>
  )

}

export default TextArea;
