export interface UploadFile {
  (file: File, url: string): Promise<string>
}

export const uploadFile: UploadFile = (file, url) => {
  
  const formData = new FormData();
  formData.append('myFile', file);

  return new Promise<string>((resolve, reject) => {
    fetch(url, {
      method: 'POST',
      body: formData
      })
      .then(response => response.json())
      .then(data => { resolve(data.assetID) })
      .catch(error => reject(error))
  });
}