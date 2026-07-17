import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setMosaicPhase } from '@components/MosaicTiles';
import MosaicTile from '@components/MosaicTiles/MosaicTile';
import { drawGridLines } from '@components/MosaicTiles/helpers/drawGridLines';
// enums
import { MosaicPhaseEnum } from '@enums/MosaicPhaseEnum';
// interfaces
import { MosaicState } from '@interfaces/MosaicState';
import { MosaicTilesProps } from '@interfaces/MosaicTilesProps';
import { AppState } from '@interfaces/AppState';
// types
import type { UploadState, RootState } from '@typescript/types';
import '@components/MosaicTiles/mosaicTiles.scss';


const MosaicTiles: React.FC<MosaicTilesProps> = () => {
  const dispatch = useDispatch();
  const animationFrameIdRef = useRef<number>(0);
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;
  const { videoURL, videoURL9x16 } = useSelector<RootState, UploadState>((state) => state.upload );
  const { aspectRatio } = useSelector<RootState, AppState>((state) => state.app);
  const {
    mosaicPhase,
    inPoints,
    copyVideoFromArea,
    tileAnimEvents,
    drawToCanvasArea,
    canvasWidth,
    canvasHeight,
    numTiles } = useSelector<RootState, MosaicState>((state) => state.mosaic as MosaicState);
  const mosaicTilesRef = useRef<Array<MosaicTile>>([]);
  const activeVideoURL = aspectRatio === '9x16' ? videoURL9x16 : videoURL;
  const canvasClassName = canvasWidth
    ? `mosaicTiles-canvas ${aspectRatio === '9x16' ? 'mosaicTiles-canvas--9x16' : ''}`
    : '';



  useEffect(() => {
    switch(mosaicPhase) {
      case MosaicPhaseEnum.CANCEL_ANIMATION:
        cancelAnimation();
        break;
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        cancelAnimation();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));
        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        const newMosaicTiles: Array<MosaicTile> = [];
        for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
          const newMosaicTile = new MosaicTile({
            videoSrc: activeVideoURL,
            context: canvasRef.current.getContext('2d') as CanvasRenderingContext2D,
            inPoint: inPoints[numTiles][tileIndex],
            copyVideoFromArea: copyVideoFromArea[numTiles], 
            drawToCanvasArea: drawToCanvasArea[numTiles][tileIndex],
            tileAnimEvents: tileAnimEvents[numTiles][tileIndex]
          });
          newMosaicTiles.push(newMosaicTile);
        }
        mosaicTilesRef.current = [...newMosaicTiles];
        drawGrid();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.TILES_UPDATED }));
        break;
      case MosaicPhaseEnum.TILES_UPDATED:
        waitUntilAnimationIsReady();
        break;
      case MosaicPhaseEnum.ANIMATION_READY:
        startAnimation();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STARTED }));
        break;
    }
  }, [mosaicPhase]);

  const cancelAnimation = () => {
    cancelAnimationFrame(animationFrameIdRef.current);
    mosaicTilesRef.current.forEach(tile => tile.clearAnimation());
  }
  
  function waitUntilAnimationIsReady() {
    if (mosaicTilesRef.current.every(tile => tile.isReady()) !== true) {
      setTimeout(() => {
        waitUntilAnimationIsReady();
      }, 250);
      return;
    }
    dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_READY }));
  }

  // draws the white separator grid on top of the tiles. Redrawn every frame
  // because each tile clears/redraws its own region (which would otherwise
  // erase the lines at the shared tile borders).
  function drawGrid () {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawGridLines(ctx, canvasWidth, canvasHeight, numTiles);
  }

  function startAnimation () {
    const beginTimeStamp = performance.now();
    mosaicTilesRef.current.forEach(tile => tile.initAnimation(beginTimeStamp));

    function step(timeStamp: DOMHighResTimeStamp) {
      mosaicTilesRef.current.forEach((tile) => {
        tile.animationFrameUpdate(timeStamp)
      });
      drawGrid();
      animationFrameIdRef.current = requestAnimationFrame(step);
    }

    animationFrameIdRef.current = requestAnimationFrame(step);
  }



  return (
    <canvas
      className={canvasClassName}
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
    />
  );
}

export default MosaicTiles;