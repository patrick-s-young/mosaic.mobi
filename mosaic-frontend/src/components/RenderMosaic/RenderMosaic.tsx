import { logEvent, AnalyticsEvent } from '@analytics/analytics';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAppPhase } from '@/app.slice';
import { setNavPhase } from '@components/Navigation/nav.slice';
import { setRenderBlob, setRenderPhase } from '@components/RenderMosaic/renderMosaic.slice';
import { setMosaicPhase } from '@components/MosaicTiles';
import { canShareVideo, renderMosaic, reportFailure, saveVideo } from '@api/index';
import { popOverProps, slideInOutProps } from '@/app.config';
import { failureMessage } from '@components/FileIOPrompt/fileIOPrompt.config';
import FileIOPrompt from '@components/FileIOPrompt/FileIOPrompt';
import SlideInOut from '@components/SideInOut/SlideInOut';
import PopOver from '@components/PopOver/PopOver';
// interfaces
import { AppState } from '@interfaces/AppState';
import { MosaicState } from '@interfaces/MosaicState';
import { ScrubberState } from '@interfaces/ScrubberState';
import { RenderMosaicProps } from '@interfaces/RenderMosaicProps';
import { RenderState } from '@interfaces/RenderState';
// types
import type { AppDispatch, RootState, UploadState } from '@typescript/types';
// enums
import { AppPhaseEnum, MosaicPhaseEnum, NavPhaseEnum, RenderPhaseEnum } from '@typescript/enums';
import './renderMosaic.scss';

// room left for the headline, message and buttons around the finished video
const RESULT_CHROME_HEIGHT = 300;

const RenderMosaic: React.FC<RenderMosaicProps> = ({ displaySize, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { assetID, imageFilenames } = useSelector<RootState, UploadState>((state) => state.upload);
  const { numTiles } = useSelector<RootState, Partial<MosaicState>>((state) => state.mosaic);
  const { aspectRatio, keepSound } = useSelector<RootState, AppState>((state) => state.app);
  const { currentScrubberFrame } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const { renderPhase, renderBlob, failure, downloadFraction } = useSelector<RootState, RenderState>((state) => state.render);
  const renderRequestRef = useRef<{ abort: () => void }>();
  const [resultURL, setResultURL] = useState<string>();
  const imageFilename = imageFilenames[currentScrubberFrame];

  useEffect(() => {
    if (!renderBlob) return;
    const url = URL.createObjectURL(renderBlob);
    setResultURL(url);
    return () => {
      URL.revokeObjectURL(url);
      setResultURL(undefined);
    };
  }, [renderBlob]);

  const startExport = () => {
    logEvent(AnalyticsEvent.RENDER_VIDEO, {
      num_tiles: numTiles ?? 0,
      aspect_ratio: aspectRatio,
      background_frame: currentScrubberFrame,
      sound: keepSound
    });
    // the preview is hidden behind this screen, so don't spend the phone's
    // decoders on it while the finished video needs one
    dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.CANCEL_ANIMATION }));
    const renderUrl = `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${imageFilename}&aspectRatio=${aspectRatio}${keepSound ? '&sound=1' : ''}`;
    renderRequestRef.current = dispatch(renderMosaic({ url: renderUrl, assetID }));
    dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
  }

  // tapping EXPORT is the only step: there's no separate confirmation
  useEffect(() => {
    if (isActive && renderPhase === RenderPhaseEnum.RENDER_PROMPT) startExport();
  }, [isActive]);

  const leaveExport = (navPhase: NavPhaseEnum) => {
    dispatch(setRenderBlob({ renderBlob: undefined }));
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
    dispatch(setNavPhase({ navPhase }));
    dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING}));
    // restarts the preview stopped in startExport
    dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.NUMTILES_UPDATED }));
  }

  // an expired upload can't be rendered again, so send the user back to upload
  const isAssetExpired = failure?.reason === 'asset_expired';
  const onRetryExport = () => {
    if (isAssetExpired) leaveExport(NavPhaseEnum.UPLOAD);
    else startExport();
  }

  const onSaveVideo = async () => {
    if (!renderBlob) return;
    const result = await saveVideo(renderBlob);
    if (result === 'cancelled') {
      logEvent(AnalyticsEvent.CANCEL, { stage: 'share_sheet' });
      return;
    }
    logEvent(AnalyticsEvent.SAVE_VIDEO, {
      num_tiles: numTiles ?? 0,
      aspect_ratio: aspectRatio,
      method: result,
      sound: keepSound
    });
  }

  const onCancelRender = () => {
    renderRequestRef.current?.abort();
    logEvent(AnalyticsEvent.CANCEL, { stage: 'rendering' });
    reportFailure({ stage: 'render', reason: 'cancelled' }, assetID);
    leaveExport(NavPhaseEnum.EDIT);
  }

  const onBackToEdit = () => {
    logEvent(AnalyticsEvent.CANCEL, { stage: String(renderPhase) });
    leaveExport(NavPhaseEnum.EDIT);
  }

  return (
    <PopOver {...popOverProps} isActive={isActive}>
      <div className='renderMosaic' style={{ width: displaySize.width, height: displaySize.height }}>
        <div className='renderMosaic__centerScreen'>
          <SlideInOut
            isActive={renderPhase === RenderPhaseEnum.RENDERING}
            {...slideInOutProps}
          >
            <FileIOPrompt
              action='rendering'
              isActive={renderPhase === RenderPhaseEnum.RENDERING}
              renderDownloadFraction={downloadFraction}
              onCancel={onCancelRender}
            />
          </SlideInOut>

          <SlideInOut
            isActive={renderPhase === RenderPhaseEnum.READY_TO_SAVE}
            {...slideInOutProps}
            enter='12px'
          >
            <FileIOPrompt
              action='exportReady'
              callBack={onSaveVideo}
              onCancel={onBackToEdit}
              cancelLabelOverride='BACK'
              messageOverride={canShareVideo()
                ? 'Tap SAVE, then choose Save Video or an app to share it with.'
                : 'Tap SAVE to download your video.'}
            >
              {resultURL &&
                <video
                  className='renderMosaic__result'
                  src={resultURL}
                  style={{ maxHeight: displaySize.height - RESULT_CHROME_HEIGHT }}
                  aria-label='Your finished video'
                  // phones only autoplay muted, so a video with sound needs controls to unmute it
                  controls={keepSound}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              }
            </FileIOPrompt>
          </SlideInOut>

          <SlideInOut
            isActive={renderPhase === RenderPhaseEnum.RENDER_FAILED}
            {...slideInOutProps}
          >
            <FileIOPrompt
              action='renderFailed'
              callBack={onRetryExport}
              onCancel={onBackToEdit}
              messageOverride={failureMessage(failure)}
              buttonLabelOverride={isAssetExpired ? 'UPLOAD' : undefined}
            />
          </SlideInOut>
          </div>
        </div>
    </PopOver>
  );
}

export default RenderMosaic;
