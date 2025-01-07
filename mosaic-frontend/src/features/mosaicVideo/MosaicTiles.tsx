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
  //const [ mosaicTiles, setMosaicTiles ] = useState<Array<MosaicTileClass>>([]);
  const mosaicTilesRef = useRef<Array<MosaicTileClass>>([]);


  const cancelAnimation = () => {
    cancelAnimationFrame(animationFrameIdRef.current);
    mosaicTilesRef.current.forEach(tile => tile.clearAnimation());
    canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
  }

  console.log('mosaicTilesRef', mosaicTilesRef.current);
  useEffect(() => {
    switch(mosaicPhase) {
      case MosaicPhaseEnum.CANCEL_ANIMATION:
        cancelAnimation();
        dispatch(setLogText({ logText: 'CANCEL_ANIMATION called' }));
        break;
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        cancelAnimation();
        dispatch(setLogText({ logText: 'NUMTILES_UPDATED called' }));
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));
        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        const newMosaicTiles: Array<MosaicTileClass> = [];
        for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
          const newMosaicTile = new MosaicTileClass();
          newMosaicTile.setAttributes({
            videoSrc: videoURL,
            context: canvasRef.current.getContext('2d') as CanvasRenderingContext2D,
            inPoint: inPoints[numTiles][tileIndex],
            copyVideoFromArea: copyVideoFromArea[numTiles], 
            drawToCanvasArea: drawToCanvasArea[numTiles][tileIndex],
            tileAnimEvents: tileAnimEvents[numTiles][tileIndex]
          });
          newMosaicTiles.push(newMosaicTile);
        }
        console.log('newMosaicTiles', newMosaicTiles);
        mosaicTilesRef.current = [...newMosaicTiles];
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.TILES_UPDATED }));
        dispatch(setLogText({ logText: 'ANIMATION_STOPPED called' }));
        break;
      case MosaicPhaseEnum.TILES_UPDATED:
        dispatch(setLogText({ logText: 'TILES_UPDATED called' }));
        waitUntilAnimationIsReady();
        break;
      case MosaicPhaseEnum.ANIMATION_READY:
        startAnimation();
        dispatch(setLogText({ logText: 'ANIMATION_READY called' }));
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STARTED }));
        break;
    }
  }, [mosaicPhase]);


  function waitUntilAnimationIsReady() {
    dispatch(setLogText({ logText: 'waitUntilAnimationIsReady called' }));
    if (mosaicTilesRef.current.every(tile => tile._canPlayThrough) === false) {
      dispatch(setLogText({ logText: 'every tile._canPlayThrough is false' }));
      setTimeout(() => {
        waitUntilAnimationIsReady();
      }, 250);
      return;
    }
    dispatch(setLogText({ logText: 'every tile._canPlayThrough is true' }));
    dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_READY }));
  }



  function startAnimation () {
    console.log('startAnimation mosaicTiles', mosaicTilesRef.current);
    mosaicTilesRef.current.forEach(tile => tile.initAnimation());
    let beginTime = performance.now();
    function step(timeStamp: DOMHighResTimeStamp) {
      let elapsedTime = timeStamp - beginTime;

      if (elapsedTime > ANIMATION_CYCLE_DURATION) {
        beginTime = performance.now();
        elapsedTime = 0;
        mosaicTilesRef.current.forEach((tile) => tile.resetAnimation());
      }

      mosaicTilesRef.current.forEach((mosaicTile) => {
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
