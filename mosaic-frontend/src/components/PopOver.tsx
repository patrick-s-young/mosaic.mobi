import {useSpring, animated } from 'react-spring';

export interface PopOverProps {
  children: React.ReactNode,
  width: string,
  height: string,
  showTop: string
  hideTop: string
  isActive: boolean
}

const PopOver: React.FC<PopOverProps> = ({
  children,
  width,
  height,
  showTop,
  hideTop,
  isActive }) => {
  const slideProps = useSpring({
    from: { 
      top: isActive ? hideTop : showTop
    },
    to: {
      top: isActive ? showTop : hideTop
    }
  });

  return (
    <div style={{ 
      position: 'absolute', 
      overflow: 'hidden',
      marginTop: '0',
      width,  
      height,
      display: 'block' }}
    >
      <animated.div
        style={{
          ...slideProps,
          position: 'absolute',
          display: 'block'
        }}
      >
        {children}
      </animated.div>
    </div>
  );
}

export default PopOver;