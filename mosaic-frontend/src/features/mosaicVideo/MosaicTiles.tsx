import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { mosaicTile, setMosaicPhase, MosaicPhaseEnum } from 'features/mosaicVideo';
import type { MosaicState, MosaicTile } from 'features/mosaicVideo';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { RootState } from 'app/rootReducer';
import 'features/mosaicVideo/mosaicTiles.css';


export const MosaicTiles: React.FC= () => {
  /// DEBUG
  const drawCount = useRef(0);
  drawCount.current += 1;
  console.log(`\n\nMosaicTiles > draw ${drawCount.current}`);
  //// 
  const [ mosaicTiles, setMosaicTiles ] = useState<Array<MosaicTile>>([]);
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


  useEffect(() => {
    console.log(`MosaicTiles > useEffect > mosaicPhase: ${MosaicPhaseEnum[mosaicPhase]}`);
    switch(mosaicPhase) {
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        cancelAnimationFrame(frameIDRef.current);
        mosaicTiles.forEach(tile => tile.clearAnimation());
        canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));

        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        const newMosaicTiles: Array<MosaicTile> = [];
        for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
          const newMosaicTile = Object.create(mosaicTile);
          newMosaicTile.setVideoSrc(videoURL);
          newMosaicTile.setContext(canvasRef.current.getContext('2d') as CanvasRenderingContext2D);
          newMosaicTile.setAttributes(
            inPoints[numTiles][tileIndex],
            copyVideoFromArea[numTiles], 
            drawToCanvasArea[numTiles][tileIndex],
            tileAnimEvents[numTiles][tileIndex]
          )
          newMosaicTiles.push(newMosaicTile);
        }
        setMosaicTiles(newMosaicTiles);
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.TILES_UPDATED }));
        break;
      case MosaicPhaseEnum.TILES_UPDATED:
        mosaicTiles.forEach(tile => tile.initAnimation());
        startAnimation();
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STARTED }));
        break;
    }
  }, [mosaicPhase]);


  function startAnimation () {
    let beginTime = performance.now();
    function step(timeStamp: DOMHighResTimeStamp) {
      let elapsedTime = timeStamp - beginTime;
      if (elapsedTime > animationCycleDuration) {
        beginTime = performance.now();
        elapsedTime = 0;
        mosaicTiles.forEach((tile) => tile.resetAnimation());
      }
      mosaicTiles.forEach((mosaicTile) => {
        if (elapsedTime > mosaicTile.nextEventTime) mosaicTile.updateCurrentEventAction();
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
