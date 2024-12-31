import * as React from 'react';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mosaicTile, setMosaicPhase, MosaicPhaseEnum } from '@features/mosaicVideo';
import type { MosaicState, MosaicTile } from '@features/mosaicVideo';
import type { UploadState } from '@features/uploadVideo/uploadSlice';
import type { RootState } from '@app/rootReducer';
import '@features/mosaicVideo/mosaicTiles.css';

const MOSAIC_TILES = Array.from({length: 9}, 
  () => {
    const tile = Object.create(mosaicTile);
    tile.initMosaicTile();
    return tile;
  });

export const MosaicTiles: React.FC= () => {
  /// DEBUG
  const drawCount = useRef(0);
  drawCount.current += 1;
  //console.log(`\n\nMosaicTiles > draw ${drawCount.current}`);

  const dispatch = useDispatch();
  const frameIDRef = useRef<number>(0);
  const animationCycleDuration: number = 15000;
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
    const activeMosaicTilesRef = useRef<Array<MosaicTile>>(MOSAIC_TILES.slice(0, numTiles));


  useEffect(() => {
    console.log('//////////////////// mosaicPhase', mosaicPhase);
    switch(mosaicPhase) {
      case MosaicPhaseEnum.CANCEL_ANIMATION:
        console.log('CANCEL_ANIMATION called');
        cancelAnimationFrame(frameIDRef.current);
        //activeMosaicTilesRef.current.forEach(tile => tile.clearAnimation());
        MOSAIC_TILES.forEach(tile => tile.unloadVideoSrc());
        canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        break;
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        console.log('NUMTILES_UPDATED called');
        cancelAnimationFrame(frameIDRef.current);
        activeMosaicTilesRef.current.forEach(tile => tile.clearAnimation());
        canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));
        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        console.log('ANIMATION_STOPPED called');
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
       // mosaicTilesRef.current = newMosaicTiles;
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.TILES_UPDATED }));
        break;
      case MosaicPhaseEnum.TILES_UPDATED:
        //mosaicTilesRef.current.forEach(tile => tile.initAnimation());
        startAnimation();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STARTED }));
        break;
    }
  }, [mosaicPhase]);



  function startAnimation () {
    console.log('^^^^^^^^^^^^^^^^^startAnimation mosaicTiles', activeMosaicTilesRef.current);
    if (activeMosaicTilesRef.current.every(tile => tile.isReady()) === false) {
      setTimeout(() => {
        startAnimation();
      }, 500);
      return;
    }
    console.log('MosaicTiles > startAnimation > tile.isReady');
  //  activeMosaicTilesRef.current.forEach(tile => tile.initAnimation());
    let beginTime = performance.now();
    function step(timeStamp: DOMHighResTimeStamp) {
      let elapsedTime = timeStamp - beginTime;
      if (elapsedTime > animationCycleDuration) {
        beginTime = performance.now();
        elapsedTime = 0;
        activeMosaicTilesRef.current.forEach((tile) => tile.resetAnimation());
      }
      activeMosaicTilesRef.current.forEach((mosaicTile) => {
        if (elapsedTime > mosaicTile.nextEventTime) {
          mosaicTile.updateCurrentEventAction();
        }
        mosaicTile.currentEventAction();
      });
      frameIDRef.current = requestAnimationFrame(step);
    }
    frameIDRef.current = requestAnimationFrame(step);
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
