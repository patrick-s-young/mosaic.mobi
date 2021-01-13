import React from 'react';
import type { ButtonProps } from 'components/button.config';

const Button: React.FC<ButtonProps> = ({
  onClickCallback,
  stateValue,
  isEnabled,
  imagePath,
  className,
  altText
}) => {
  return (
    <div >
      { isEnabled ? 
          <img src={imagePath} className={className.default} onClick={() => onClickCallback(stateValue)} alt={altText} /> 
        : <img src={imagePath} className={className.hilite} alt={altText} />
      }
    </div>
  );
}

export default Button;