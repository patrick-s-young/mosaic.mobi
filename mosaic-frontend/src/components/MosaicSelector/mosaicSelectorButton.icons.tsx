import type { MosaicIcons } from "@typescript/types";
import type { MosaicIconProps } from "@interfaces/MosaicIconProps";

const Mosaic2: React.FC<MosaicIconProps> = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="24" strokeWidth="8"  fill="none"></rect>
      <path
        strokeWidth="2"
        stroke="currentColor"
        d="M 12,0 v 23"
      />
    </svg>
  )
}

const Mosaic3: React.FC<MosaicIconProps> = () => {
  return (  
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="24" strokeWidth="8"  fill="none"></rect>
      <path
        strokeWidth="2"
        stroke="currentColor"
        d="M 9,0 v 23
        M 15,0 v 23"
      />
    </svg>
  )
}

const Mosaic4: React.FC<MosaicIconProps> = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="24" strokeWidth="8"  fill="none"></rect>
      <path
        strokeWidth="2"
        stroke="currentColor"
        d="M 0,12 h 23
        M 12,0 v 23"
      />
    </svg>
  )
}

const Mosaic6: React.FC<MosaicIconProps> = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="24" strokeWidth="8"  fill="none"></rect>
      <path
        strokeWidth="2"
        stroke="currentColor"
        d="M 0,12 h 23
        M 9,0 v 23
        M 15,0 v 23"
      />
    </svg>
  )
}

const Mosaic9: React.FC<MosaicIconProps> = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="24" height="24" strokeWidth="8"  fill="none"></rect>
      <path
        strokeWidth="2"
        stroke="currentColor"
        d="M 0,9 h 23
        M 0,15 h 23
        M 9,0 v 23
        M 15,0 v 23"
      />
    </svg>
  )
}



const mosaicIcons: MosaicIcons = {
  2: Mosaic2,
  3: Mosaic3,
  4: Mosaic4,
  6: Mosaic6,
  9: Mosaic9
}

export default mosaicIcons;