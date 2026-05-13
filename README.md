# Mosaic

- Mosaic is a web app for creating social media friendly video edits.
- Mosaic is a port of the popular native app, [Cine-pic](https://apps.apple.com/us/app/cine-pic-photo-video-montage/id923762113).

[https://github.com/user-attachments/assets/e5b8cb93-94c7-41e8-8b78-3eb70b540e53](https://github.com/user-attachments/assets/b4eefe15-9676-4c4f-a6fa-08cd964e05bd
)

## Project Organization
Mosaic is Docker-based and the project is organized by container:
- `/mosaic-backend` (Express + FFmpeg)
- `/mosaic-frontend` (React + TypeScript)
- `/mosaic-proxy` (nginx reverse proxy)

## Application Logic Flow
Mosaic turns a short user-uploaded video into a square, social-media-friendly mosaic edit. The frontend owns the upload, edit, and save experience with React and Redux. The backend owns durable upload storage, FFmpeg processing, frame extraction, and final video rendering.

```mermaid
flowchart TD
    User[User selects a video] --> Validate[Frontend validates duration]
    Validate -->|15 seconds or less| Upload[POST /uploadvideo]
    Validate -->|too long| TooLong[Show upload warning]

    Upload --> Proxy[nginx proxy]
    Proxy --> Backend[Express backend]
    Backend --> Store[Save upload.mov under assetID]
    Store --> Probe[ffprobe video metadata]
    Probe --> Crop[Crop to square]
    Crop --> Resize[Create mobile-friendly resized.mov]
    Resize --> Frames[Export preview images]
    Frames --> AssetID[Return assetID]

    AssetID --> PreloadVideo[Frontend preloads resized.mov]
    PreloadVideo --> PreloadFrames[Frontend preloads preview frames]
    PreloadFrames --> InitMosaic[Redux initializes mosaic timing and tile layout]
    InitMosaic --> Edit[Canvas preview: scrub frame and choose tile count]

    Edit --> RenderRequest[GET /render/mosaic with assetID, frame, tile count]
    RenderRequest --> RenderFFmpeg[Backend builds FFmpeg filter graph]
    RenderFFmpeg --> FinalMovie[Create mosaic.mov]
    FinalMovie --> DownloadBlob[Return rendered video blob]
    DownloadBlob --> Save[Frontend prompts user to save]

    Backend -. Socket.IO progress .-> Progress[Upload/render progress prompt]
    RenderFFmpeg -. Socket.IO progress .-> Progress
```

### Frontend Flow
The React app renders three main modes through navigation state: upload, edit, and save. Upload actions are handled by Redux async thunks that validate the selected file, send it to the backend, preload the optimized video, and preload the exported frame images. Once those assets are ready, the mosaic slice calculates tile timing, copy areas, draw areas, and animation events.

During editing, the scrubber chooses the background frame and the mosaic selector chooses the tile count. `MosaicTiles` uses a canvas animation preview so the user can see the selected mosaic layout before rendering.

### Backend Flow
The Express backend exposes two primary routes:
- `POST /uploadvideo` saves the upload, probes it with ffprobe, crops it square, creates a lightweight resized video, exports preview images, and returns an `assetID`.
- `GET /render/mosaic` accepts the `assetID`, selected scrubber frame, and tile count, then builds an FFmpeg filter graph to render the final `mosaic.mov`.

FFmpeg progress is emitted over Socket.IO so the frontend prompt can show upload and render status.


## Running Locally
```
git clone https://github.com/patrick-s-young/mosaic.mobi.git
cd mosaic.mobi/mosaic-backend
npm install
cd ../mosaic-frontend
npm install
```



To build images and run containers, run `docker compose -f docker-compose-dev.yaml up` from the root directory.

To update just the UI, run `npm run dev` from the `/mosaic-frontend` directory. Note: you will not be able to upload or render new videos.

To update the UI with upload and render enabled, run `docker compose -f docker-compose-frontend-dev.yaml up` from the root directory.

To run the containers on Docker Hub, run `docker compose up` from the root directory.

## Author

* **Patrick Young** - [Patrick Young](https://www.linkedin.com/in/patrick-s-young/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
