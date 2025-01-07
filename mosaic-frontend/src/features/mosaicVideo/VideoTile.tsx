import { useRef, useEffect } from 'react';

interface VideoTileProps {
  videoURL: string;
  inPoint: number;
}

const VideoTile: React.FC<VideoTileProps> = ({
  videoURL,
  inPoint
}) => {
  const videoRef = useRef() as React.MutableRefObject<HTMLVideoElement>;



  useEffect(() => {
    videoRef.current.pause();
    videoRef.current.currentTime = inPoint;
    videoRef.current.play();
  }, [inPoint]);

  if (!videoURL) {
    return null;
  }

  return (
    <video 
      ref={videoRef} 
      src={videoURL} 
      loop={true} 
      autoPlay={true} 
      webkit-playsinline="webkit-playsinline" 
      playsInline={true}
    />
  )
}

export default VideoTile;
