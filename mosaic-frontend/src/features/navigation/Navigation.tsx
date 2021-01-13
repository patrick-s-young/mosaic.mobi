import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNavSection } from 'features/navigation/navSlice';
import type { NavState, NavSection } from 'features/navigation/navSlice';
import { v1 as uuid } from 'uuid';
import type { RootState } from 'app/rootReducer';
import 'app/iphone-x.css';



export const Navigation: React.FC  = () => {
  const dispatch = useDispatch();
  const navSections: Array<NavSection> = ['Upload Video', 'Edit Mosaic', 'Render Mosaic'];
  const { navSection } = useSelector<RootState, NavState>((state) => state.nav);

  const onClickHandler = (newStateValue: NavSection) => {
    dispatch(setNavSection({navSection: newStateValue}));
  }

  return (
    <div style={{display: 'flex', width: '480px'}}>
      { navSections.map((section) =>
        <div key={uuid()} >
          { section !== navSection ?
              <div  className='iphone-x-navigation-button' onClick={() => onClickHandler(section)}>
                    {section}
              </div>
            : <div  className='iphone-x-navigation-button' style={{ backgroundColor: 'lightgreen'}}>
                    {section}
              </div>
          }
        </div>  
        )
      }
    </div>
  )

}