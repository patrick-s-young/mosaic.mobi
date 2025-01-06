import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@app/rootReducer';
import type { MobileDisplayLogState } from './mobileDisplayLog.slice';
import { clearLogText } from './mobileDisplayLog.slice';
import './mobileDisplayLog.scss';

export const MobileDisplayLog: React.FC = () => {
  const { logText } = useSelector<RootState, MobileDisplayLogState>((state) => state.mobileDisplayLog);
  const dispatch = useDispatch();

  const handleDisplayClick = () => {
    dispatch(clearLogText());
  }

  return (
  <div 
    className="mobileDisplayLog" 
    dangerouslySetInnerHTML={{ __html: logText }} 
    onClick={handleDisplayClick} 
  />
  );
}