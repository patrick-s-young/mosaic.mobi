
export class VideoTex {
  nextEventTime: number;
  currentEventAction: string = 'WAIT';
  updateVideoTex: () => void;
  fadeOpacity: number;
  translation: Array<number>;
  tileIndex: number;
  video: HTMLVideoElement;
  private fadeDuration: number = 500;
  private fadeStartTime: number;
  private inPoint: number;
  private tileAnimEvents: Array<{time: number, action: string}>;
  private maxEventIndex: number;
  private nextEventIndex: number;


  constructor (videoURL: string) {
    this.video = document.createElement('video');
    this.video.src = videoURL;
    this.video.autoplay = true;
    this.video.loop = true;
    this.video.muted = true;
    this.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
    this.video.setAttribute('playsinline', 'playsinline');
  }

  setAttributes (
    inPoint: number, 
    tileAnimEvents: Array<{time: number, action: string}>,
    translation: Array<number>,
    tileIndex: number
    ) {
    this.inPoint = inPoint;
    this.tileAnimEvents = tileAnimEvents;
    this.maxEventIndex = tileAnimEvents.length;
    this.translation = translation;
    this.tileIndex = tileIndex;
  }

  initAnimation () {
    this.currentEventAction = 'WAIT';
    this.updateVideoTex = this.wait;
    this.nextEventIndex = 0;
    this.nextEventTime = this.tileAnimEvents[this.nextEventIndex].time;
    this.video.currentTime = this.inPoint;
  }

  resetAnimation() {
    this.nextEventIndex = 0;
    this.nextEventTime = this.tileAnimEvents[this.nextEventIndex].time;
  }

  updateCurrentEventAction() {
    console.log(`MosaicTile > updateCurrentEventAction`);
    const newCurrentEventAction = this.tileAnimEvents[this.nextEventIndex].action;
    this.nextEventIndex = (this.nextEventIndex + 1) % this.maxEventIndex;
    this.nextEventTime = this.tileAnimEvents[this.nextEventIndex].time;

    switch(newCurrentEventAction) {
      case 'fadeIn':
        this.initFadeIn();
        break;
      case 'fadeOut':
        this.initFadeOut();
        break;
      default:
        console.log(`ERROR: no case for ${newCurrentEventAction}`); // todo: add error handling
    }
  }




  initFadeIn() {
    this.video.currentTime = this.inPoint;
    this.fadeStartTime = Date.now();
    const playPromise = this.video.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        //console.log(`Automatic playback started!`);
        this.currentEventAction = 'FADE_IN';
        this.updateVideoTex = this.fadeIn;
        // Show playing UI.
      })
      .catch(error => {
        console.log(`Auto-play was prevented by error: ${error}`);
        // Auto-play was prevented
        // Show paused UI.
      });
    }

  }

  fadeIn() {
      const timeElapsed = Date.now() - this.fadeStartTime;
      this.fadeOpacity = timeElapsed / this.fadeDuration;
      if (this.fadeOpacity > 1) {
        this.fadeOpacity = 1;
        this.currentEventAction = 'DRAW_IMAGE';
        this.updateVideoTex = this.drawImage;
        return;
      }
  }

  initFadeOut() {
    this.fadeStartTime = Date.now();
    this.currentEventAction = 'FADE_OUT';
    this.updateVideoTex = this.fadeOut;
  }

  fadeOut() {
      const timeElapsed = Date.now() - this.fadeStartTime;
      this.fadeOpacity = 1 - timeElapsed / this.fadeDuration;
      if (this.fadeOpacity < 0) {
        this.fadeOpacity = 0;
        this.video.pause();
        this.video.currentTime = this.inPoint;
        this.currentEventAction = 'WAIT';
        this.updateVideoTex = this.drawImage;
        return;
      }
  }

  wait () {
    // don't do anything
  }

  drawImage () {
    // don't do anything
  }

  private initVideo = async (filePath: string) => {
    const videoDimensions = await new Promise<{videoWidth: number, videoHeight: number}>((_resolve, reject) => {
      this.video.src = filePath;
      //this.video.autoload = true;
      this.video.autoplay = true;
      this.video.loop = true;
      this.video.muted = true;
      this.video.setAttribute('webkit-playsinline', 'webkit-playsinline');
      this.video.setAttribute('playsinline', 'playsinline');
      this.video.addEventListener('loadedmetadata', (ev: Event) => {
        const target = ev.currentTarget as HTMLVideoElement;
        console.log(`initVideo > videoWidth: ${target.videoWidth}, videoHeight: ${target.videoHeight}`);
        _resolve({
          videoWidth: target.videoWidth,
          videoHeight: target.videoHeight
        });
        this.video.play();
      });
    });
  
    return videoDimensions;
  }

}