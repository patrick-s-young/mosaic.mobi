
interface PreloadSequentialImagesArgs {
  startIdx: number
  endIdx: number
  nameFormat: string
  zeroPadding: number
  directoryPath: string 
}

export interface PreloadSequentialImages {
  (args: PreloadSequentialImagesArgs): Promise<Array<string>>
}

export const preloadSequentialImages: PreloadSequentialImages = ({
  startIdx,
  endIdx,
  nameFormat,
  zeroPadding,
  directoryPath
}) => {
  const filenameArr: Array<string> = Array(endIdx - startIdx + 1).fill(startIdx).map((val, idx) => {
    const imgIdx = val + idx + '';
    const imgName = nameFormat.replace(' ', imgIdx.padStart(zeroPadding, '0'));
    return imgName;
  });

  const imageArr: Array<Promise<string>> = filenameArr.map((filename) => {
    return new Promise<string>((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.open('GET', `${directoryPath}/${filename}`, true);
      req.responseType = 'blob';
      req.onload = function() {
        if (this.status === 200) {
          const imageBlob: Blob  = this.response;
          const imageURL: string = URL.createObjectURL(imageBlob); // IE10+
           resolve(imageURL);
        }
     }
     req.onerror = function() {
       reject('req ERROR')
     }
     req.send();
    });
  });

  return Promise.all(imageArr);
}


