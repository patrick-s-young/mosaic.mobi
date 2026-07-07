import { useDispatch, useSelector } from 'react-redux';
import { setAspectRatio } from '@/app.slice';
import { setAspectFormatting } from '@components/MosaicTiles';
import { AppState } from '@interfaces/AppState';
import { AppPhaseEnum } from '@typescript/enums';
import type { RootState, UploadState, AspectRatio } from '@typescript/types';
import './aspectRatioToggle.scss';

// Toggles the editor between 1:1 and 9:16. Both aspect-ratio preview sources are
// preloaded at upload time, so switching is an instant in-memory swap that just
// recomputes tile geometry and restarts the preview animation.
const AspectRatioToggle: React.FC = () => {
  const dispatch = useDispatch();
  const { aspectRatio, canvasWidth, appPhase } = useSelector<RootState, AppState>((state) => state.app);
  const { resizedWidth } = useSelector<RootState, UploadState>((state) => state.upload);
  const isLoading = appPhase === AppPhaseEnum.LOADING;

  const onToggle = () => {
    if (isLoading) return;
    const nextAspectRatio: AspectRatio = aspectRatio === '1x1' ? '9x16' : '1x1';
    dispatch(setAspectRatio({ aspectRatio: nextAspectRatio }));
    dispatch(setAspectFormatting({ videoWidth: resizedWidth, canvasWidth, aspectRatio: nextAspectRatio }));
  };

  // the icon shows the shape you will switch TO
  const isSquare = aspectRatio === '1x1';
  const targetLabel = isSquare ? '9:16' : '1:1';

  return (
    <button
      className='aspectRatioToggle'
      onClick={onToggle}
      disabled={isLoading}
      aria-label={`Switch to ${targetLabel} aspect ratio`}
      title={`Switch to ${targetLabel}`}
    >
      <svg width='22' height='22' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
        { isSquare
          ? <rect x='9' y='2' width='10' height='24' rx='1.5' stroke='currentColor' strokeWidth='2' />
          : <rect x='4' y='4' width='20' height='20' rx='1.5' stroke='currentColor' strokeWidth='2' />
        }
      </svg>
      <span className='aspectRatioToggle__label'>{targetLabel}</span>
    </button>
  );
}

export default AspectRatioToggle;
