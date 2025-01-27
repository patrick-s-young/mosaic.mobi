import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@typescript/types';
import { ScrubberState } from '@interfaces/ScrubberState';
import { ScrubberFramesProps } from '@interfaces/ScrubberFramesProps';
import '@components/Scrubber/scrubberFrames.css';


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
