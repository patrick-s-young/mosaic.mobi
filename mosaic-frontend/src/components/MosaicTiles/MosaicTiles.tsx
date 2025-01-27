import { traceEvent } from '@analytics/traceEvent';
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMosaicPhase } from '@components/MosaicTiles';
import MosaicTile from '@components/MosaicTiles/MosaicTile';
// enums
import { MosaicPhaseEnum } from '@enums/MosaicPhaseEnum';
// interfaces
import { MosaicState } from '@interfaces/MosaicState';
import { MosaicTilesProps } from '@interfaces/MosaicTilesProps';
// types
import type { UploadState, RootState } from '@typescript/types';
import '@components/MosaicTiles/mosaicTiles.scss';

// TODO: move to config
const ANIMATION_CYCLE_DURATION = 15000;

const MosaicTiles: React.FC<MosaicTilesProps> = () => {
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
  const mosaicTilesRef = useRef<Array<MosaicTile>>([]);
  const canvasClassName = canvasWidth ? 'mosaicTiles-canvas' : '';

  const cancelAnimation = () => {
    cancelAnimationFrame(animationFrameIdRef.current);
    mosaicTilesRef.current.forEach(tile => tile.clearAnimation());
    canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
  }

  useEffect(() => {
    switch(mosaicPhase) {
      case MosaicPhaseEnum.CANCEL_ANIMATION:
        cancelAnimation();
        break;
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        traceEvent({ 
          category: 'MosaicTiles',
          action: 'NUMTILES_UPDATED',
          label: 'N/A'
        });
        cancelAnimation();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));
        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        const newMosaicTiles: Array<MosaicTile> = [];
        for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
          const newMosaicTile = new MosaicTile();
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
        mosaicTilesRef.current = [...newMosaicTiles];
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.TILES_UPDATED }));
        break;
      case MosaicPhaseEnum.TILES_UPDATED:
        traceEvent({ 
          category: 'MosaicTiles',
          action: 'TILES_UPDATED',
          label: 'N/A'
        });
        waitUntilAnimationIsReady();
        break;
      case MosaicPhaseEnum.ANIMATION_READY:
        startAnimation();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STARTED }));
        break;
    }
  }, [mosaicPhase]);

  function waitUntilAnimationIsReady() {
    if (mosaicTilesRef.current.every(tile => tile._canPlayThrough) === false) {
      setTimeout(() => {
        waitUntilAnimationIsReady();
      }, 250);
      return;
    }
    dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_READY }));
  }

  function startAnimation () {
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

  return (
    <canvas
      className={canvasClassName}
      ref={canvasRef}
      width={canvasWidth}
      height={canvasWidth}
    />
  );
}

export default MosaicTiles;