import { useRef, useEffect } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from 'app/rootReducer';
import type { ScrubberState } from 'features/mosaicImage/scrubberSlice';
import 'features/mosaicImage/scrubberStyles.css';

interface ScrubberFramesProps {
  width: number
	height: number
	imageArr: Array<string>
}

// todo: add wait animation while 'videoFramesToCanvasArray' is resolving.
const ScrubberFrames: React.FC<ScrubberFramesProps> = ({ 
  width,
	height,
	imageArr
}) => {
	const { currentScrubberFrame } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
	);

	const imgRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		if (imgRef.current !== null) {
			imgRef.current.src = imageArr[currentScrubberFrame];
		}
	}, [currentScrubberFrame]);

	return(
		<div className='scrubberFrames-container'>
			<img
				ref={imgRef}
				width={width}
				height={height}
			/>
		</div>
	);
}

export default ScrubberFrames;
