import { traceEvent } from '@analytics/traceEvent';
import { useDispatch, useSelector } from 'react-redux';
import { setAppPhase } from '@/app.slice';
import { setNavPhase } from '@components/Navigation/nav.slice';
import { setRenderPhase } from '@components/RenderMosaic/renderMosaic.slice';
import { renderMosaic } from '@api/index';
import { popOverProps, slideInOutProps } from '@/app.config';
import FileIOPrompt from '@components/FileIOPrompt/FileIOPrompt';
import SlideInOut from '@components/SideInOut/SlideInOut';
import PopOver from '@components/PopOver/PopOver';
import FileDownload from 'js-file-download'
// interfaces
import { MosaicState } from '@interfaces/MosaicState';
import { ScrubberState } from '@interfaces/ScrubberState';
import { RenderMosaicProps } from '@interfaces/RenderMosaicProps';
import { RenderState } from '@interfaces/RenderState';
// types
import type { AppDispatch, RootState, UploadState } from '@typescript/types';
// enums
import { AppPhaseEnum, NavPhaseEnum, RenderPhaseEnum } from '@typescript/enums';
import './renderMosaic.scss';


const RenderMosaic: React.FC<RenderMosaicProps> = ({ displaySize, isActive }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { assetID, imageFilenames, downloadFileName } = useSelector<RootState, UploadState>((state) => state.upload);
  const { numTiles } = useSelector<RootState, Partial<MosaicState>>((state) => state.mosaic);
  const { currentScrubberFrame } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const { renderPhase, renderBlob } = useSelector<RootState, RenderState>((state) => state.render);
  const imageFilename = imageFilenames[currentScrubberFrame];

  const onRenderVideo = () => {
    traceEvent({
      category: 'RenderMosaic',
      action: 'onRenderVideo',
      label: 'N/A'
    });
    const renderUrl = `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${imageFilename}`;
    dispatch(renderMosaic(renderUrl));
    dispatch(setAppPhase({ appPhase: AppPhaseEnum.LOADING}));
  }

  const onSaveVideo = () => {
    if (renderBlob) {
      traceEvent({
        category: 'RenderMosaic',
        action: 'onSaveVideo',
        label: 'N/A'
      });
      FileDownload(renderBlob, downloadFileName);
      dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
      dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));  
      dispatch(setAppPhase({ appPhase: AppPhaseEnum.NOT_LOADING}));
    }
  }

  const onCancel = () => {
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