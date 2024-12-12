import iPhone_XR from '@assets/device-preview/iPhone_XR_mock_414x712.png';
import './desktopDisplay.scss';

export type DesktopDisplayProps = {
  children: React.ReactNode
}

const DesktopDisplay: React.FC<DesktopDisplayProps> = ({ children }) => {

  return (
    <div className='desktopDisplay'>
      <div className='desktopDisplay__leftColumn'>
        <span className='desktopDisplay__title'>Mosaic</span><span className='desktopDisplay__title__by'>by <a href='https://www.linkedin.com/in/patrick-s-young/' target='_blank'>Patrick S. Young</a></span>
        <ul>
          <li>Mosaic is a web app for creating social media friendly video edits.</li>
          <li>Mosaic is inspired by my popular native app, <a href='https://apps.apple.com/us/app/cine-pic-photo-video-montage/id923762113' target='_blank'>Cine-pic</a>.</li>
          <li>I developed Mosaic to see if I could deliver a native app experience in a mobile browser.</li>
          <li>FRONTEND: 
            <ul>
              <li>React</li>
              <li>Redux Toolkit</li>
              <li>Typescript</li>
            </ul>
          </li>
          <li>BACKEND: 
            <ul>
            <li>Node.js</li>
              <li>FFMpeg</li>
              <li>Express</li>
              <li>Running on AWS</li>
            </ul>
          </li>
          <li>More project details on <a href='https://github.com/patrick-s-young/mosaic.mobi' target='_blank'>GitHub</a>.</li>
        </ul>
      </div>
         
      <div className='desktopDisplay__middleColumn'>
        <img src={iPhone_XR} style={{ position: 'absolute'}} id='device-png'/>
        <div className='desktopDisplay__appContainer'>
          {children}
        </div>
      </div>

       <div className='desktopDisplay__rightColumn'>
        <div><a href='https://github.com/patrick-s-young/mosaic.mobi' target='_blank'>GitHub</a></div>
        <div><a href='https://www.linkedin.com/in/patrick-s-young/' target='_blank'>LinkedIn</a></div>
      </div>
    </div>
  );
};

export default DesktopDisplay;
