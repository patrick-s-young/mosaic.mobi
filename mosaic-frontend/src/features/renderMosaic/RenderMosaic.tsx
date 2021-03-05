import * as React from 'react';
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
import { Button, Paper } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CloudDownload, AccessTime, Cached } from '@material-ui/icons';
// Components
import PopOver from 'components/PopOver';
import SlideInOut from 'components/SlideInOut';
// download service
const FileDownload = require('js-file-download');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      position: 'absolute', 
      backgroundColor: theme.palette.common.white, 
      marginTop: '0px',
      opacity: 0.95,
      zIndex: 20
    },
    centerScreen: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    },
    promptHeadline: {
      color: theme.palette.primary.dark,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      ...theme.typography.h5
    },
    promptBody: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& > *': {
        padding: theme.spacing(1)
      },
      margin: theme.spacing(4),
      padding: theme.spacing(1)
    }
  })
);

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


  function onRenderVideo () {
    const renderUrl = `/render/mosaic/?assetID=${assetID}&numTiles=${numTiles}&currentScrubberFrame=${currentScrubberFrame}`;
    dispatch(renderMosaic(renderUrl));
  }

  function onSaveVideo () {
    FileDownload(renderBlob, 'mosaic_render.mov');
    dispatch(setRenderPhase({ renderPhase: RenderPhaseEnum.RENDER_PROMPT }));
    dispatch(setNavPhase({navPhase: NavPhaseEnum.EDIT}));  
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
        <div className={classes.centerScreen}>

          <SlideInOut 
            isActive={renderPhase === RenderPhaseEnum.RENDER_PROMPT}
            enter={`${0.2 * displaySize.height}px`}
            exit={`${displaySize.height}px`}
          >
            <Paper className={classes.promptBody}>
              <div className={classes.promptHeadline}><AccessTime style={{ fontSize: 24 }}/> Render Video</div>
              <div>The mosaic video rendering process takes place in the cloud and usually requires ten to fifteen seconds.</div>
              <div>
                <Button
                  variant='outlined'
                  onClick={onRenderVideo}
                >
                RENDER VIDEO
                </Button>
            </div>
            </Paper>
          </SlideInOut>

          <SlideInOut 
            isActive={renderPhase === RenderPhaseEnum.RENDERING}
            enter={`${0.2 * displaySize.height}px`}
            exit={`${displaySize.height}px`}
          >
            <Paper className={classes.promptBody}>
              <div className={classes.promptHeadline}><Cached style={{ fontSize: 24 }}/> Rendering Video</div>
              <div>When rendering is complete, you will be prompted to download your mosaic video to your device.</div>
              <div>
                <CircularProgress />
              </div>
            </Paper>
          </SlideInOut>

          <SlideInOut 
            isActive={renderPhase === RenderPhaseEnum.READY_TO_SAVE}
            enter={`${0.2 * displaySize.height}px`}
            exit={`${displaySize.height}px`}
          >
            <Paper className={classes.promptBody}>
              <div className={classes.promptHeadline}><CloudDownload style={{ fontSize: 24 }}/> Save Video</div>
              <div>Your mosaic video is ready to save to your device. If you don't have the option to save to your photo library, save to files first and then add it to your photos.</div>
              <div>
                <Button
                  variant='outlined'
                  onClick={onSaveVideo}
                >
                SAVE VIDEO
                </Button>
            </div>
            </Paper>
          </SlideInOut>
    </div>
        </div>
    </PopOver>
  );
}

 