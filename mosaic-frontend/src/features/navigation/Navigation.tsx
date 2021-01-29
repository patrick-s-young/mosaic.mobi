import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNavPhase, NavPhaseEnum } from 'features/navigation/navSlice';
import type { NavState } from 'features/navigation/navSlice';
import { v1 as uuid } from 'uuid';
import type { RootState } from 'app/rootReducer';
import Button from 'components/Button';
import navigationConfig from 'features/navigation/navigation.config.ts';
import 'features/navigation/navigation.css';

export interface NavigationProps {
  pauseInput: boolean
}

export const Navigation: React.FC<NavigationProps> = ({ pauseInput }) => {
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);

  const onClickHandler = (newStateValue: NavPhaseEnum) => {
    if (!pauseInput) dispatch(setNavPhase({navPhase: newStateValue}));
  }

  return (
    <div className='navigation_flex-container'>
      { navigationConfig().map((button) =>
          <Button 
            onClickCallback={onClickHandler}
            stateValue={button.stateValue}
            isEnabled={button.stateValue !== navPhase}
            imagePath={button.imagePath}
            className={button.className}
            altText={button.altText}
            key={uuid()}
          />)
      }
    </div>
  )

}