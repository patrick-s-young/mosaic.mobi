import React from 'react';
import { NavigationButtonProps } from '@interfaces/NavigationButtonProps';
import './navigationButton.scss';


const NavigationButton: React.FC<NavigationButtonProps> = ({ 
  label, 
  value,
  activeNavPhase,
  onClick,
  nudge = false}) => {
  const buttonClass = [
    'navigationButton',
    value === activeNavPhase ? 'navigationButton--selected' : '',
    nudge ? 'navigationButton--nudge' : ''
  ].join(' ').trim();

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