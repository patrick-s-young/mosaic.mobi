import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@typescript/types';
import { setNavPhase } from '@/components/Navigation/nav.slice';
import { setHint } from '@/app.slice';
import { AppState } from '@interfaces/AppState';
import { NavState } from '@interfaces/NavState';
import { NavPhaseEnum } from '@enums/NavPhaseEnum';
import { NavigationProps } from '@interfaces/NavigationProps';
import NavigationButton from './NavigationButton';
import './navigation.scss';


const Navigation: React.FC<NavigationProps> = ({ 
  width,
  pauseInput }) => {
  const dispatch = useDispatch();
  const { navPhase } = useSelector<RootState, NavState>((state) => state.nav);
  const { hint } = useSelector<RootState, AppState>((state) => state.app);

  const handleChange = (newValue: NavPhaseEnum) => {
    if (pauseInput) return;
    dispatch(setHint({ hint: undefined }));
    dispatch(setNavPhase({navPhase: newValue}));
  };

  return (
    <div className='navigation' style={{ width }}>
      <NavigationButton label='UPLOAD' value={NavPhaseEnum.UPLOAD} activeNavPhase={navPhase} onClick={handleChange} />
      <NavigationButton label='EDIT' value={NavPhaseEnum.EDIT} activeNavPhase={navPhase} onClick={handleChange} />
      <NavigationButton label='SAVE' value={NavPhaseEnum.DOWNLOAD} activeNavPhase={navPhase} onClick={handleChange} nudge={hint === 'nextStep'} />
    </div>
  );
}

export default Navigation;