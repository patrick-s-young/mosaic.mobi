import React from 'react';
import { useSpring, animated } from 'react-spring';

export interface SlideInOutProps {
  isActive: boolean
  enter: string
  exit: string
}

const SlideInOut: React.FC<SlideInOutProps> = ({
  children,
  isActive,
  enter,
  exit }) => {
  const slideProps = useSpring({
    from: { 
      top: isActive ? exit : enter,
      opacity: isActive ? 0 : 1
    },
    to: {
      top: isActive ? enter : exit,
      opacity: isActive ? 1 : 0
    }
  });

  return (

      <animated.div
        style={{
          ...slideProps,
          position: 'absolute',
          display: 'block',
        }}
      >
        {children}
      </animated.div>

  );
}

export default SlideInOut;