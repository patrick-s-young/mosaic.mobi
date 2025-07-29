import type { 
  FadeInPresentationTimestamps, 
  OverlayOffsets, 
  CropDimensions, 
  ScaleDimensions } from '../../types';

// time offset for each panel to fade in
export const FADE_IN_PRESENTATION_TIMESTAMPS: FadeInPresentationTimestamps = 
  {
    2: 
      {
        0: [0.5, 5, 10, 12.5],
        1: [2.5, 5, 8, 12.5]
      },
    3: 
      {  
        0: [1.5, 5, 10, 12.5],
        1: [.5, 6, 9.5, 12.5],
        2: [2, 5.5, 8.5, 12.5]
      },
    4: 
      {  
        0: [0.5, 4.0, 7.5, 12.0],
        1: [2., 5.0, 8.0, 12.0],
        2: [1.5, 4.5, 9.5, 12.0],
        3: [3.0, 5.5, 9, 12.0]
      },
    6: 
      {
        0: [1.0, 8.5, 12],
        1: [0.5, 7.5, 12],
        2: [3.0, 7, 12],
        3: [2.0, 6.0, 12],
        4: [5.0, 9.5, 12],
        5: [4.0, 8.5, 12]
      },
    9: 
      {
        0: [0.25, 4.25, 10.25],
        1: [1.0, 7.25, 10.5],
        2: [0.5, 5.0, 10.75],
        3: [1.5, 5.5, 11.25],
        4: [1.25, 7.5, 11.5],
        5: [2, 6.25, 11.725],
        6: [1.75, 4.75, 12],
        7: [2.25, 8.25, 12.25],
        8: [2.5, 5, 12.5]
      }
  }

// x/y offsets for each video panel
export const OVERLAY_OFFSETS: OverlayOffsets = 
  {
    2: ['x=0:y=0', 'x=540:y=0'],
    3: ['x=0:y=0', 'x=360:y=0', 'x=720:y=0'],
    4: [
        'x=0:y=0',    'x=540:y=0', 
        'x=0:y=540',  'x=540:y=540'
        ],
    6: [
        'x=0:y=0',    'x=360:y=0',    'x=720:y=0', 
        'x=0:y=540',  'x=360:y=540',  'x=720:y=540'
       ],
    9: ['x=0:y=0',    'x=360:y=0', 'x=720:y=0',
        'x=0:y=360', 'x=360:y=360', 'x=720:y=360',
        'x=0:y=720', 'x=360:y=720', 'x=720:y=720']
  }

// crop dimensions for each video panel
export const CROP_DIMENSIONS: CropDimensions = 
  {
    2: '540:1080:270:0',
    3: '360:1080:360:0',
    4: '1080:1080:0:0',
    6: '720:1080:180:0',
    9: '1080:1080:0:0',
  }

// scale dimensions for each video panel
export const SCALE_DIMENSIONS: ScaleDimensions = 
  {
    2: '',
    3: '',
    4: ', scale=540:540',
    6: ', scale=360:540',
    9: ', scale=360:360'
  }