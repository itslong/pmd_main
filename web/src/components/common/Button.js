import React from 'react';
import { GButton } from './styles';


const Button = (props) => {
  return (
    <GButton
      id={props.id}
      className={props.type}
      name={props.name}
      title={props.title}
      style={props.style}
      onClick={props.action}
    >
    {props.title}
    </GButton>
  )
}

export default Button;
