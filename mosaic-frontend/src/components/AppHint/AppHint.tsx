import { useDispatch, useSelector } from 'react-redux';
import { setHint } from '@/app.slice';
import { AppState } from '@interfaces/AppState';
import type { AppHintKind, RootState } from '@typescript/types';
import './appHint.scss';

const MESSAGES: Record<AppHintKind, string> = {
  nextStep: 'Your video is ready! Choose a layout and background, then tap SAVE.',
  formatFailed: 'We couldn\'t switch the format. Check your connection and try again.'
};

// a short message over the preview, placed so it never moves the controls
const AppHint: React.FC = () => {
  const dispatch = useDispatch();
  const { hint } = useSelector<RootState, AppState>((state) => state.app);
  if (hint === undefined) return null;

  return (
    <div className='appHint' role='status'>
      <span>{MESSAGES[hint]}</span>
      <button
        className='appHint__dismiss'
        onClick={() => dispatch(setHint({ hint: undefined }))}
        aria-label='Dismiss'
      >
        ×
      </button>
    </div>
  );
};

export default AppHint;
