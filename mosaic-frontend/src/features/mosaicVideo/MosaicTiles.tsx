import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MosaicSelector, setMosaicVideo, setNumTiles, mosaicTile } from 'features/mosaicVideo';
import type { RootState } from 'app/rootReducer';
import type { MosaicState, MosaicTile, NumTiles } from 'features/mosaicVideo';
import type { UploadState } from 'features/uploadVideo/uploadSlice';
import 'features/mosaicVideo/mosaicTiles.css';


export const MosaicTiles: React.FC= () => {
  ///// MOSAIC SLICE ///////////////////////////////////
  // mosaicSlice values describe the timing and the dimensions
  // of video drawn to a 2d canvas, resulting in a mosaic-like pattern.
  // default values are undefined
  const { 
    numTiles,
    canvasWidth, 
    inPoints, 
    copyVideoFromArea,
    drawToCanvasArea,
    tileAnimEvents } = useSelector<RootState, MosaicState>(
		(state) => state.mosaic as MosaicState
  );

  const { videoURL, duration } = useSelector<RootState, UploadState>((state) => state.upload);

  // dispatch setMosaicVideo({ duration, width, height }) to mosaicSlice
  const dispatch = useDispatch();

  // conditional render when mosaicSlice values have been initialized
  const [ mosaicStateLoaded, setMosaicStateLoaded] = useState<boolean>(false);

  // move to upload.slice
  const width: number = window.innerWidth; // 480;
  const height: number = window.innerWidth; // 480;


  // initialized on change in src video duration/dimensions
  useEffect(() => {
      dispatch(setMosaicVideo({ duration, width, height }));
      setMosaicStateLoaded(true);
  }, [duration]);

  const [ mosaicTiles, setMosaicTiles ] = useState<Array<MosaicTile>>([]);

  // each mosaicTile object has a refence to the canvas used in context.drawImage(video) method 
  const canvasRef = useRef() as React.MutableRefObject<HTMLCanvasElement>;

  // when mosaicSlice 'numTiles' state changes reinitialized 'mosaicTiles'
  // todo: move to redux
  useEffect(() => {
    console.log(`top of UseEffect. numTiles: ${numTiles}`);
    if (canvasRef.current !== null && mosaicStateLoaded) {
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
  }

  return () => {
    cancelAnimationFrame(frameIDRef.current);
    canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
    //mosaicTiles.forEach(tile => tile.clearAnimation());
  }

  }, [numTiles, mosaicStateLoaded]);

  


  ///// ANIMATION LOOP ///////////////////////////////////
  // each mosiacTile object in the 'mosaicTiles' array is checked to 
  // see if its animation sequence is due for an update based on the 
  // time elapsed from the beginning of the current loop
  useEffect(() => {
    // start 
    mosaicTiles.forEach(tile => tile.initAnimation());
    startAnimation()
  }, [mosaicTiles]);
  // animation loop restarts every fifteen sections
  const animationCycleDuration: number = 15000 
  // when exiting loop, cancelAnimationFrame(frameID)
  const frameIDRef = useRef<number>(0);
  //let frameID: number;
  // start requestAnimationFrame animation loop
  function startAnimation () {
    let beginTime = performance.now();
    // this function is recrusively passed to requestAnimationFrame
    function step(timeStamp: DOMHighResTimeStamp) {
      let elapsedTime = timeStamp - beginTime;
      // check of fifteen seconds have elapsed and restart loop if true
      if (elapsedTime > animationCycleDuration) {
        beginTime = performance.now();
        elapsedTime = 0;
        mosaicTiles.forEach((tile) => tile.resetAnimation());
      }
      // animation loop update
      mosaicTiles.forEach((mosaicTile) => {
        // check each mosaicTile object to see if an animation update is due
        if (elapsedTime > mosaicTile.nextEventTime) mosaicTile.updateCurrentEventAction();
        // fire each mosaicTile's current action
        mosaicTile.currentEventAction();
      });
      // recursive call - save return value for cancelAnimationFrame(frameID)
      frameIDRef.current = requestAnimationFrame(step);
    }
    // initial call - save return value for cancelAnimationFrame(frameID)
    frameIDRef.current = requestAnimationFrame(step);
  }

  ////////////////////////////////////////////////////////////////////
  // UI: onClick callback passed to <MosaicSelector>
  // <MosaicSelector> presents five buttons corresponding to 
  // mosaicSlice 'numTiles' state options 2, 3, 4, 6, or 9 tiles
 //const onClickHandler = (newStateValue: NumTiles) => {
   // cancelAnimationFrame(frameIDRef.current);
   // canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasWidth, canvasWidth);
    //mosaicTiles.forEach(tile => tile.clearAnimation());
   // dispatch(setNumTiles(newStateValue));
  //}


  return(
		  <div style={{position: 'relative', top: `-${window.innerWidth + 4}px`}}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasWidth}
        />
      </div>
  );
}
