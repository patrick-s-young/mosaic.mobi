import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  setMosaicPhase, 
  MosaicPhaseEnum, 
  GlTiles, 
  VideoTex } from 'features/mosaicVideo';
import type { MosaicState } from 'features/mosaicVideo';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import type { RootState } from 'app/rootReducer';
import 'features/mosaicVideo/mosaicTiles.css';



export const MosaicTiles: React.FC= () => {
  /// DEBUG
  const drawCount = useRef(0);

  drawCount.current += 1;
  console.log(`\n\nMosaicTiles > draw ${drawCount.current}`);
  //// 
  const [ mosaicTiles, setMosaicTiles ] = useState<Array<VideoTex>>([]);
  const dispatch = useDispatch();
  const frameIDRef = useRef<number>(0);
  const animationCycleDuration: number = 15000;
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;
  const glTilesRef = useRef() as React.MutableRefObject<GlTiles>;
  const { videoURL } = useSelector<RootState, UploadState>((state) => state.upload );
  const { 
    mosaicPhase,
    inPoints,
    copyVideoFromUvs,
    tileAnimEvents,
    drawToViewPort,
    canvasWidth,
    numTiles } = useSelector<RootState, MosaicState>((state) => state.mosaic as MosaicState);




  useEffect(() => {
    console.log(`MosaicTiles > useEffect > mosaicPhase: ${MosaicPhaseEnum[mosaicPhase]}`);
    switch(mosaicPhase) {
      case MosaicPhaseEnum.CANCEL_ANIMATION:
        cancelAnimationFrame(frameIDRef.current);
        //mosaicTiles.forEach(tile => tile.clearAnimation());
        //canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        break;
      case MosaicPhaseEnum.NUMTILES_UPDATED:
        cancelAnimationFrame(frameIDRef.current);
        //mosaicTiles.forEach(tile => tile.clearAnimation());
        //canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
        dispatch(setMosaicPhase({ mosaicPhase: MosaicPhaseEnum.ANIMATION_STOPPED}));
        break;
      case MosaicPhaseEnum.ANIMATION_STOPPED:
        const newMosaicTiles: Array<VideoTex> = [];
        if (glTilesRef.current === undefined) {
          glTilesRef.current = new GlTiles(canvasRef.current, new Float32Array(copyVideoFromUvs[numTiles]));
        } else {
          console.log('UPDATE UVS')
          glTilesRef.current.setUvs(new Float32Array(copyVideoFromUvs[numTiles]));
        }
        for (let tileIndex = 0; tileIndex < numTiles; tileIndex++) {
          const newMosaicTile = new VideoTex(videoURL); //Object.create(mosaicTile);
          newMosaicTile.setAttributes(
            inPoints[numTiles][tileIndex],
            tileAnimEvents[numTiles][tileIndex],
            drawToViewPort[numTiles][tileIndex]
          );
        
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
    const glTiles = glTilesRef.current;
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
        mosaicTile.updateVideoTex();
        if (mosaicTile.currentEventAction !== 'WAIT') {
          glTiles.drawImage(
            mosaicTile.video, 
            mosaicTile.fadeOpacity, 
            mosaicTile.viewPort);
        }
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
