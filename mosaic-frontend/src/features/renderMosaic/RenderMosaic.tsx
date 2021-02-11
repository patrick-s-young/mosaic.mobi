import * as React from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// <RenderMosaic>
import 'features/renderMosaic/renderMosaic.css';
import loadingAnim from 'assets/images/loading_200x200.gif';
// Slices 
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { MosaicState } from 'features/mosaicVideo/mosaicSlice';
import type { ScrubberState } from 'features/mosaicImage/scrubberSlice';
import { 
  RenderPhaseEnum, 
  RenderState, 
  setRenderPhase } from 'features/renderMosaic/renderSlice';
// render request and download services
const axios = require('axios');
const FileDownload = require('js-file-download');

export interface RenderMosaicProps {
  displaySize: { width: number, height: number }
}


export const RenderMosaic: React.FC<RenderMosaicProps> = ({ displaySize }) => {
  const dispatch = useDispatch();
  const { assetID } = useSelector<RootState, UploadState>((state) => state.upload);
  const { numTiles } = useSelector<RootState, Partial<MosaicState>>((state) => state.mosaic);
  const { currentScrubberFrame } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const { renderPhase } = useSelector<RootState, RenderState>((state) => state.render);

  function onClickHandler (assetID: string) {
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDERING }));
    axios({
     url: `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${currentScrubberFrame}`, 
     method: 'GET',
      responseType: 'blob'
    }).then((response) => onFileDownload(response.data));
  }

  function onFileDownload (blob: Blob) {
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
    FileDownload(blob, 'mosaic_render.mov');
  }

  return (
    <div className='renderMosaic_container' style={{ width: displaySize.width, height: displaySize.height }}>
      {renderPhase === RenderPhaseEnum.RENDER_PROMPT &&
      <div className='renderMosaic_flex-container'>
        <div className="renderMosaic_button_wrapper">
          <div className="renderMosaic_button_label" onClick={() => onClickHandler(assetID)}>
            Download Video
          </div>
        </div>
      </div>
      }     
      {renderPhase === RenderPhaseEnum.RENDERING &&
        <div className='renderMosaic_flex-container'>
          <div className='renderMosaic_loading-animation'>
            <img src={loadingAnim}  />
          </div>
      </div>
      }   
    </div>
  )
}

 