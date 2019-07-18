import React from 'react';
import { StyledButton } from './styles';


const Button = (props) => {
  return (
    <StyledButton
      id={props.id}
      className={props.type}
      name={props.name}
      title={props.title}
      style={props.style}
      onClick={props.action}
    >
    {props.title}
    </StyledButton>
  )
}

export default Button;
