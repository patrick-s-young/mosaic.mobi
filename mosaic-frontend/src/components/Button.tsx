import React, { PropsWithChildren } from 'react';


export interface ButtonProps<T> {
  stateValue: T
  onClickCallback: (newStateValue: T) => void
  isEnabled: boolean
  className: { 
    default: string,
    hilite: string
  }
  imagePath: string
  altText: string
}

const Button = <T, >(
  props: PropsWithChildren<ButtonProps<T>>
) => {
  return (
    <div >
      { props.isEnabled ? 
          <img src={props.imagePath} className={props.className.default} onClick={() => props.onClickCallback(props.stateValue)} alt={props.altText} /> 
        : <img src={props.imagePath} className={props.className.hilite} alt={props.altText} />
      }
    </div>
  );
}

export default Button;