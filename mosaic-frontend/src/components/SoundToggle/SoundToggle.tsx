import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VolumeOff, VolumeUp } from '@material-ui/icons';
import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { setKeepSound } from '@/app.slice';
import { startSoundPreview, stopSoundPreview } from './soundPreview';
import { AppState } from '@interfaces/AppState';
import type { RootState, UploadState } from '@typescript/types';
import './soundToggle.scss';

// Keeps the video's original sound in the preview and the export. Only offered
// for videos that have sound, and off until tapped.
const SoundToggle: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const dispatch = useDispatch();
  const { keepSound } = useSelector<RootState, AppState>((state) => state.app);
  const { assetID, hasAudio } = useSelector<RootState, UploadState>((state) => state.upload);

  // also covers a new upload, which turns sound back off
  useEffect(() => {
    if (!keepSound) stopSoundPreview();
  }, [keepSound]);

  if (!isVisible || !hasAudio) return null;

  const onToggle = () => {
    const nextKeepSound = !keepSound;
    dispatch(setKeepSound({ keepSound: nextKeepSound }));
    if (nextKeepSound) startSoundPreview(`/uploads/${assetID}/audio.m4a`);
    logEvent(AnalyticsEvent.TOGGLE_SOUND, { sound: nextKeepSound });
  };

  return (
    <button
      className='soundToggle'
      onClick={onToggle}
      aria-pressed={keepSound}
      aria-label='Keep original sound'
      title={keepSound ? 'Original sound on' : 'Original sound off'}
    >
      {keepSound ? <VolumeUp /> : <VolumeOff />}
    </button>
  );
};

export default SoundToggle;
