import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMosaicPhase, MosaicPhaseEnum } from '@features/mosaicVideo';
import type { MosaicState } from '@features/mosaicVideo';
import type { UploadState } from '@features/uploadVideo/uploadSlice';
import type { RootState } from '@app/rootReducer';
import { setLogText } from '@devTools/MobileDisplayLog/mobileDisplayLog.slice';
import '@features/mosaicVideo/mosaicTiles.css';

import MosaicTileClass from '@features/mosaicVideo/MosaicTileClass';


const ANIMATION_CYCLE_DURATION = 15000;
const MOSAIC_TILES: Array<MosaicTileClass> = Array.from({length: 9}, 
  () => {
    const tile = new MosaicTileClass();
    return tile;
  });

export const MosaicTiles: React.FC= () => {
  const dispatch = useDispatch();
  const animationFrameIdRef = useRef<number>(0);
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;
  const { videoURL } = useSelector<RootState, UploadState>((state) => state.upload );
  const { 
    mosaicPhase,
    inPoints,
    copyVideoFromArea,
    tileAnimEvents,
    drawToCanvasArea,
    canvasWidth,
    numTiles } = useSelector<RootState, MosaicState>((state) => state.mosaic as MosaicState);
    const activeMosaicTilesRef = useRef<Array<MosaicTileClass>>(MOSAIC_TILES.slice(0, numTiles));


  useEffect(() => {
    console.log('//////////////////// mosaicPhase', mosaicPhase);
    switch(mosaicPhase) {
      case MosaicPhaseEnum.CANCEL_ANIMATION:
        dispatch(setLogText({ logText: 'CANCEL_ANIMATION called' }));
        cancelAnimationFrame(animationFrameIdRef.current);
        MOSAIC_TILES.forEach(tile => tile.unloadVideoSrc());
        canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        break;
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        dispatch(setLogText({ logText: 'NUMTILES_UPDATED called' }));
        cancelAnimationFrame(animationFrameIdRef.current);
        activeMosaicTilesRef.current.forEach(tile => tile.clearAnimation());
        canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));
        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        dispatch(setLogText({ logText: 'ANIMATION_STOPPED called' }));
        for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
          MOSAIC_TILES[tileIndex].setAttributes({
            inPoint: inPoints[numTiles][tileIndex],
            copyVideoFromArea: copyVideoFromArea[numTiles], 
            drawToCanvasArea: drawToCanvasArea[numTiles][tileIndex],
            tileAnimEvents: tileAnimEvents[numTiles][tileIndex],
            videoSrc: videoURL,
            context: canvasRef.current.getContext('2d') as CanvasRenderingContext2D
          })
        }
        activeMosaicTilesRef.current = MOSAIC_TILES.slice(0, numTiles);
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.TILES_UPDATED }));
        break;
      case MosaicPhaseEnum.TILES_UPDATED:
        dispatch(setLogText({ logText: 'TILES_UPDATED called' }));
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STARTED }));
        waitUntilAnimationIsReady();
        break;
    }
  }, [mosaicPhase]);

  function waitUntilAnimationIsReady() {
    dispatch(setLogText({ logText: 'animationIsReady called' }));
    if (activeMosaicTilesRef.current.every(tile => tile.isReady()) === false) {
      setTimeout(() => {
        waitUntilAnimationIsReady();
      }, 500);
      return;
    }
    startAnimation();
  }

  function startAnimation () {
    dispatch(setLogText({ logText: 'startAnimation called' }));
    let beginTime = performance.now();
    function step(timeStamp: DOMHighResTimeStamp) {
      let elapsedTime = timeStamp - beginTime;
      if (elapsedTime > ANIMATION_CYCLE_DURATION) {
        beginTime = performance.now();
        elapsedTime = 0;
        activeMosaicTilesRef.current.forEach((tile) => tile.resetAnimation());
      }
      activeMosaicTilesRef.current.forEach((mosaicTile) => {
        if (elapsedTime > (mosaicTile.nextEventTime ?? Infinity)) {
          mosaicTile.updateCurrentEventAction();
        }
        mosaicTile.currentEventAction?.();
      });
      animationFrameIdRef.current = requestAnimationFrame(step);
    }
    animationFrameIdRef.current = requestAnimationFrame(step);
  }

  return(
		  <div style={{position: 'absolute', top: `0px`}}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasWidth}
        />
      </div>
  );
}
