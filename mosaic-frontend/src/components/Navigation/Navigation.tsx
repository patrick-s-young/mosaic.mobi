import { traceEvent } from '@analytics/traceEvent';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@typescript/types';
import { setNavPhase } from '@/components/Navigation/nav.slice';
import { NavState } from '@interfaces/NavState';
import { NavPhaseEnum } from '@enums/NavPhaseEnum';
import { NavigationProps } from '@interfaces/NavigationProps';
import navPhaseString from '@analytics/traceEvent.config';
import NavigationButton from './NavigationButton';
import './navigation.scss';


const Navigation: React.FC<NavigationProps> = ({ 
  width,
  pauseInput }) => {
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);

  const handleChange = (newValue: NavPhaseEnum) => {
    traceEvent({
      category: 'Navigation',
      action: navPhaseString[newValue],
      label: 'N/A'
    });
    if (!pauseInput) dispatch(setNavPhase({navPhase: newValue}));
  };

  return (
    <div className='navigation' style={{ width }}>
      <NavigationButton label='UPLOAD' value={NavPhaseEnum.UPLOAD} activeNavPhase={navPhase} onClick={handleChange} />
      <NavigationButton label='EDIT' value={NavPhaseEnum.EDIT} activeNavPhase={navPhase} onClick={handleChange} />
      <NavigationButton label='SAVE' value={NavPhaseEnum.DOWNLOAD} activeNavPhase={navPhase} onClick={handleChange} />
    </div>
  );
}

export default Navigation;