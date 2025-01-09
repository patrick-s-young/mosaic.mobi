import { useRef, useEffect } from 'react';
import * as React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@store/rootReducer';
import type { ScrubberState } from '@components/Scrubber/scrubberSlice';
import '@components/Scrubber/scrubberFrames.css';

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
	const { currentScrubberFrame, videoUploadCount } = useSelector<RootState, ScrubberState>(
    (state) => state.scrubber
	);

	const imgRef = useRef<HTMLImageElement | null>(null);

	useEffect(() => {
		if (imgRef.current !== null) {
			imgRef.current.src = imageArr[currentScrubberFrame];
		}
	}, [currentScrubberFrame, videoUploadCount]);

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
