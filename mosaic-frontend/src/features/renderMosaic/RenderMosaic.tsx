import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { MosaicState } from 'features/mosaicVideo/mosaicSlice';
import type { ScrubberState } from 'features/mosaicImage/scrubberSlice';
import { RenderPhaseEnum, RenderState, setRenderPhase, setRenderBlob } from 'features/renderMosaic/renderSlice';
import loadingAnim from 'assets/images/loading_200x200.gif';
import 'features/renderMosaic/renderMosaic.css';

const axios = require('axios');
const FileDownload = require('js-file-download');

export const RenderMosaic: React.FC = () => {
  const dispatch = useDispatch();
  const { assetID } = useSelector<RootState, UploadState>((state) => state.upload);
  const { numTiles } = useSelector<RootState, Partial<MosaicState>>((state) => state.mosaic);
  const { currentScrubberFrame } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const { renderPhase, renderBlob } = useSelector<RootState, RenderState>((state) => state.render);

  function onClickHandler (assetID: string) {
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDERING }));
    axios({
     url: `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${currentScrubberFrame}`, 
     method: 'GET',
      responseType: 'blob'
    }).then((response) => dispatch(setRenderBlob(response.data)));
  }

  function downloadMosaic () {
    FileDownload(renderBlob, 'mosaic_render.mov');
    showRenderPrompt();
  }

  function showRenderPrompt () {
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
  }

  return (
    <div>
      {renderPhase === RenderPhaseEnum.RENDER_PROMPT &&
        <div >
          <label>RENDER MOSAIC?</label>
          <button type='button' onClick={() => onClickHandler(assetID)}>Render Mosaic</button>
        </div>
      }     
      {renderPhase === RenderPhaseEnum.RENDERING &&
        <div className='loading-anim-container'>
          <div className='loading-anim-item'>
            <img src={loadingAnim}  />
          </div>
      </div>
      }   
      {renderPhase === RenderPhaseEnum.SAVE_PROMPT &&
        <div >
          <label>SAVE MOSAIC?</label>
          <button type='button' onClick={downloadMosaic}>YES</button>
          <button type='button' onClick={showRenderPrompt}>CANCEL</button>
        </div>
      }  
    </div>
  )
}