import {useSpring, animated } from 'react-spring';
import { PopOverProps } from '@interfaces/PopOverProps';
import './popOver.scss';


const PopOver: React.FC<PopOverProps> = ({
  children,
  width,
  height,
  showTop,
  hideTop,
  isActive}) => {
  const slideProps = useSpring({
    from: { 
      top: isActive ? hideTop : showTop
    },
    to: {
      top: isActive ? showTop : hideTop
    }
  });

  return (
    <div 
      className='popOver'
      style={{ 
        width,  
        height
      }}
    >
      <animated.div
        className='popOver__animatedDiv'
        style={{...slideProps }}
      >
        {children}
      </animated.div>
    </div>
  );
}

export default PopOver;