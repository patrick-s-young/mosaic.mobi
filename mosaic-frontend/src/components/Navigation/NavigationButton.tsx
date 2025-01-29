import React from 'react';
import { NavigationButtonProps } from '@interfaces/NavigationButtonProps';
import './navigationButton.scss';


const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  label, 
  value,
  activeNavPhase, 
  onClick}) => {
  const buttonClass = value === activeNavPhase 
    ? 'navigationButton navigationButton--selected' 
    : 'navigationButton';

  return (
    <button 
      className={buttonClass} 
      onClick={() => onClick(value)}
    >
      {label}
    </button>
  );
};  

export default NavigationButton;