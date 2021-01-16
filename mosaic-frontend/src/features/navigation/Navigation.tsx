import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNavSection } from 'features/navigation/navSlice';
import type { NavState, NavSection } from 'features/navigation/navSlice';
import { v1 as uuid } from 'uuid';
import type { RootState } from 'app/rootReducer';
import Button from 'components/Button';
import navigationConfig from 'features/navigation/navigation.config.ts';
import 'features/navigation/navigation.css';



export const Navigation: React.FC  = () => {
  const dispatch = useDispatch();
  const { navSection } = useSelector<RootState, NavState>((state) => state.nav);

  const onClickHandler = (newStateValue: NavSection) => {
    dispatch(setNavSection({navSection: newStateValue}));
  }

  return (
    <div className='navigation_flex-container'>
      { navigationConfig().map((button) =>
          <Button 
            onClickCallback={onClickHandler}
            stateValue={button.stateValue}
            isEnabled={button.stateValue !== navSection}
            imagePath={button.imagePath}
            className={button.className}
            altText={button.altText}
            key={uuid()}
          />)
      }
    </div>
  )

}