import type { 
  CopyVideoFromArea,
  DrawToCanvasArea
} from '../MosaicTileClass.interface';

type VideoToImageArrayProps = {
  videoURL: string, 
  inPoint: number, 
  copyVideoFromArea: CopyVideoFromArea,
  drawToCanvasArea: DrawToCanvasArea
}

export const videoToImageArray = async ({
  videoURL, 
  inPoint, 
  copyVideoFromArea,
  drawToCanvasArea
}: VideoToImageArrayProps) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const images = [];
    const outPoint = inPoint + 2;
    const video = document.createElement('video');


    canvas.width = drawToCanvasArea.width;
    canvas.height = drawToCanvasArea.height;
    video.src = videoURL;
    video.autoplay = true;
    video.currentTime = inPoint;
    video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    video.setAttribute('playsinline', 'playsinline');


    while (video.currentTime <= outPoint) {
      // Draw the current frame on the canvas
      context?.drawImage(video,       
        copyVideoFromArea.x, 
        copyVideoFromArea.y, 
        copyVideoFromArea.width, 
        copyVideoFromArea.height,
        0,
        0, 
        drawToCanvasArea.width, 
        drawToCanvasArea.height);
  
        canvas.toBlob((imageBlob) => {
          //const url = canvas.toDataURL('image/jpeg');
          const url = URL.createObjectURL(imageBlob);

        const newImage = document.createElement('img');
        newImage.src = url;
          // newImage.src = url;
          images.push(newImage);
       },'image/jpg');



 
  
      // Seek to the next frame
      video.currentTime += 1 / 30; // Adjust for desired frame rate
      await new Promise(resolve => setTimeout(resolve, 50)); // Wait for the frame to render
    }
    return images;
}
