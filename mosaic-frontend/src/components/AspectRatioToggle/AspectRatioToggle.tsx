import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { setAspectRatio, setHint } from '@/app.slice';
import { loadAspectAssets, loadRemainingFrames, reportFailure } from '@api/index';
import { setAspectFormatting } from '@components/MosaicTiles';
import { AppState } from '@interfaces/AppState';
import { AppPhaseEnum } from '@typescript/enums';
import type { AppDispatch, RootState, UploadState, AspectRatio } from '@typescript/types';
import './aspectRatioToggle.scss';

// Toggles the editor between 1:1 and 9:16. The other format is fetched the first
// time it's needed; the toggle waits for it, then recomputes tile geometry and
// restarts the preview animation.
const AspectRatioToggle: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isSwitching, setIsSwitching] = useState(false);
  const { aspectRatio, canvasWidth, appPhase } = useSelector<RootState, AppState>((state) => state.app);
  const { resizedWidth, assetID } = useSelector<RootState, UploadState>((state) => state.upload);
  const isLoading = appPhase === AppPhaseEnum.LOADING;

  const onToggle = async () => {
    if (isLoading || isSwitching) return;
    const nextAspectRatio: AspectRatio = aspectRatio === '1x1' ? '9x16' : '1x1';
    setIsSwitching(true);
    const result = await dispatch(loadAspectAssets({ assetID, aspectRatio: nextAspectRatio }));
    setIsSwitching(false);
    if (loadAspectAssets.rejected.match(result)) {
      dispatch(setHint({ hint: 'formatFailed' }));
      reportFailure(result.payload ?? { stage: 'preload', reason: 'download_failed' }, assetID);
      return;
    }
    dispatch(loadRemainingFrames({ assetID, aspectRatio: nextAspectRatio }));
    dispatch(setAspectRatio({ aspectRatio: nextAspectRatio }));
    dispatch(setAspectFormatting({ videoWidth: resizedWidth, canvasWidth, aspectRatio: nextAspectRatio }));
    logEvent(AnalyticsEvent.SELECT_ASPECT_RATIO, { aspect_ratio: nextAspectRatio });
  };

  // the icon shows the shape you will switch TO
  const isSquare = aspectRatio === '1x1';
  const targetLabel = isSquare ? '9:16' : '1:1';

  return (
    <button
      className='aspectRatioToggle'
      onClick={onToggle}
      disabled={isLoading || isSwitching}
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
