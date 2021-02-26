import * as React from 'react';
import { useEffect } from 'react';
// Redux
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
// Slices 
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { MosaicState } from 'features/mosaicVideo/mosaicSlice';
import type { ScrubberState } from 'features/mosaicImage/scrubberSlice';
import { setNavPhase, NavPhaseEnum } from 'features/navigation/navSlice';
import { 
  RenderPhaseEnum, 
  RenderState, 
  setRenderPhase } from 'features/renderMosaic/renderSlice';
// api
import { renderMosaic } from 'api';
// Material-UI
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
// <RenderMosaic>
import loadingAnim from 'assets/images/loading_200x200.gif';
// <PopOver>
import PopOver from 'components/PopOver';
// render request and download services
const axios = require('axios');
const FileDownload = require('js-file-download');

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute', 
    marginTop: '0px',
    opacity: 0.95,
    backgroundColor: '#ffffff',
    zIndex: 20
  },
  centerScreen: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  }
}));

export interface RenderMosaicProps {
  displaySize: { width: number, height: number }
  isActive: boolean
}

export const RenderMosaic: React.FC<RenderMosaicProps> = ({ displaySize, isActive }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { assetID } = useSelector<RootState, UploadState>((state) => state.upload);
  const { numTiles } = useSelector<RootState, Partial<MosaicState>>((state) => state.mosaic);
  const { currentScrubberFrame } = useSelector<RootState, ScrubberState>((state) => state.scrubber);
  const { renderPhase, renderBlob } = useSelector<RootState, RenderState>((state) => state.render);

  useEffect(() => {
    switch(renderPhase) {
      case RenderPhaseEnum.RENDERING:
        // 
        break;
      case RenderPhaseEnum.READY_TO_SAVE:
        dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
        dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));  
        FileDownload(renderBlob, 'mosaic_render.mov');
        break;
    }
  }, [renderPhase]);

  function onClickHandler () {
    const renderUrl = `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${currentScrubberFrame}`;
    dispatch(renderMosaic(renderUrl));
  }

  return (
    <PopOver
      width={`${displaySize.width}px`}
      height={`${displaySize.height}px`}
      showTop={`0px`}
      hideTop={`${displaySize.height}px`}
      isActive={isActive}
    >
      <div className={classes.container} style={{ width: displaySize.width, height: displaySize.height }}>
        {
          renderPhase === RenderPhaseEnum.RENDER_PROMPT &&
            <div className={classes.centerScreen}>
              <Button
                variant='outlined'
                size='large'
                onClick={onClickHandler}
              >
              SAVE VIDEO
              </Button>
            </div>
        }     
        {
          renderPhase === RenderPhaseEnum.RENDERING &&
            <div className={classes.centerScreen}>
              <img src={loadingAnim}  />
            </div>
        }   
        </div>
    </PopOver>
  );
}

 