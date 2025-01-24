import { traceEvent } from '@analytics/traceEvent';
import { useDispatch, useSelector } from 'react-redux';
import { setAppPhase, AppPhaseEnum } from '@components/App/app.slice';
import { setNavPhase, NavPhaseEnum } from '@components/Navigation/nav.slice';
import { RenderPhaseEnum, RenderState, setRenderPhase } from '@components/RenderMosaic/renderMosaic.slice';
import type { MosaicState } from '@components/MosaicTiles/mosaicTiles.slice';
import type { ScrubberState } from '@components/Scrubber/scrubber.slice';
import type { UploadState } from '@components/UploadVideo/upload.slice.interface';
import type { RootState } from '@store/rootReducer';
import type { AppDispatch } from '@store/store';
import { renderMosaic } from '@api/index';
import { popOverProps, slideInOutProps } from '@components/App/app.config';
import FileIOPrompt from '@components/FileIOPrompt/FileIOPrompt';
import SlideInOut from '@components/SideInOut/SlideInOut';
import PopOver from '@components/PopOver/PopOver';
import FileDownload from 'js-file-download'
import './renderMosaic.scss';

export interface RenderMosaicProps {
  displaySize: { width: number, height: number }
  isActive: boolean
}

const RenderMosaic: React.FC<RenderMosaicProps> = ({ displaySize, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { assetID } = useSelector<RootState, UploadState>((state) => state.upload);
  const { numTiles } = useSelector<RootState, Partial<MosaicState>>((state) => state.mosaic);
  const { currentScrubberFrame } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const { renderPhase, renderBlob } = useSelector<RootState, RenderState>((state) => state.render);

  const onRenderVideo = () => {
    traceEvent({
      category: 'RenderMosaic',
      action: 'RENDER_VIDEO',
      label: 'N/A'
    });
    const renderUrl = `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${currentScrubberFrame}`;
    dispatch(renderMosaic(renderUrl));
    dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
  }

  const onSaveVideo = () => {
    if (renderBlob) {
      traceEvent({
        category: 'RenderMosaic',
        action: 'SAVE_VIDEO',
        label: 'N/A'
      });
      FileDownload(renderBlob, 'mosaic_render.mov');
      dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
      dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));  
      dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING}));
    }
  }

  const onCancel = () => {
    traceEvent({
      category: 'RenderMosaic',
      action: 'CANCEL_RENDER',
      label: 'N/A'
    });
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
    dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));  
    dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING}));
  }

  return (
    <PopOver {...popOverProps} isActive={isActive}>
      <div className='renderMosaic' style={{ width: displaySize.width, height: displaySize.height }}>
        <div className='renderMosaic__centerScreen'>
          <SlideInOut 
            isActive={renderPhase === RenderPhaseEnum.RENDER_PROMPT}
            {...slideInOutProps}
          >
            <FileIOPrompt action='render' callBack={onRenderVideo} onCancel={onCancel} />
          </SlideInOut>

          <SlideInOut 
            isActive={renderPhase === RenderPhaseEnum.RENDERING}
            {...slideInOutProps}
          >
            <FileIOPrompt action='rendering' />
          </SlideInOut>

          <SlideInOut 
            isActive={renderPhase === RenderPhaseEnum.READY_TO_SAVE}
            {...slideInOutProps}
          >
            <FileIOPrompt action='save' callBack={onSaveVideo} onCancel={onCancel} />
          </SlideInOut>
          </div>
        </div>
    </PopOver>
  );
}

export default RenderMosaic;