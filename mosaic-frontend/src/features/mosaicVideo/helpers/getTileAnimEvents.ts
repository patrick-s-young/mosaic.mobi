import type { ActionGroupCollection } from 'features/mosaicVideo/mosaicSlice';

interface GetTileAnimEvents {
  (): ActionGroupCollection
} 

// retrieve values through function to facilitate filtering of data if needed
export const getTileAnimEvents: GetTileAnimEvents = () => {
  return {
  2:[
      [ // row: 0, col: 0
        { time: 500,    action: 'fadeIn'},
        { time: 2000,   action: 'fadeOut'},
        { time: 5000,   action: 'fadeIn'},
        { time: 6500,   action: 'fadeOut'},
        { time: 10000,  action: 'fadeIn'},
        { time: 11500,  action: 'fadeOut'}, 
        { time: 12500,  action: 'fadeIn'}, 
        { time: 14000,  action: 'fadeOut'}, 
        { time: 16000,  action: 'wait'},
      ],
      [ // row: 0, col: 1
        { time: 2500,   action: 'fadeIn'},
        { time: 4000,   action: 'fadeOut'},
        { time: 5000,   action: 'fadeIn'},
        { time: 6500,   action: 'fadeOut'},
        { time: 8000,   action: 'fadeIn'},
        { time: 9500,   action: 'fadeOut'}, 
        { time: 12500,  action: 'fadeIn'}, 
        { time: 14000,  action: 'fadeOut'}, 
        { time: 16000,  action: 'wait'},
      ]
    ],
  3:[
      [ // row: 0, col: 0
        { time: 1500,   action: 'fadeIn'},
        { time: 3000,   action: 'fadeOut'},
        { time: 5000,   action: 'fadeIn'},
        { time: 6500,   action: 'fadeOut'},
        { time: 10000,  action: 'fadeIn'},
        { time: 11500,  action: 'fadeOut'},
        { time: 12500,  action: 'fadeIn'},
        { time: 14000,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'},
      ],
      [ // row: 0, col: 1
        { time: 500,    action: 'fadeIn'},
        { time: 2000,   action: 'fadeOut'},
        { time: 6000,   action: 'fadeIn'},
        { time: 7500,   action: 'fadeOut'},
        { time: 9500,   action: 'fadeIn'},
        { time: 11000,  action: 'fadeOut'},
        { time: 12500,  action: 'fadeIn'},
        { time: 14000,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'},
      ],
      [ // row: 0, col: 2
        { time: 2000,   action: 'fadeIn'},
        { time: 3500,   action: 'fadeOut'},
        { time: 5500,   action: 'fadeIn'},
        { time: 7000,   action: 'fadeOut'},
        { time: 8500,   action: 'fadeIn'},
        { time: 10000,  action: 'fadeOut'},
        { time: 12500,  action: 'fadeIn'},
        { time: 14000,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'},
      ]
    ],
  4:[
      [  // row: 0, col: 0
        { time: 500,    action: 'fadeIn'},
        { time: 2000,   action: 'fadeOut'},
        { time: 4000,   action: 'fadeIn'},
        { time: 5500,   action: 'fadeOut'},
        { time: 7500,   action: 'fadeIn'},
        { time: 9000,   action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'},
      ],
      [ // row: 0, col: 1
        { time: 2000,   action: 'fadeIn'},
        { time: 3500,   action: 'fadeOut'},
        { time: 6000,   action: 'fadeIn'},
        { time: 7500,   action: 'fadeOut'},
        { time: 8000,   action: 'fadeIn'},
        { time: 9500,   action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'},
      ],
      [ // row: 1, col: 0
        { time: 1500,   action: 'fadeIn'},
        { time: 3000,   action: 'fadeOut'},
        { time: 4500,   action: 'fadeIn'},
        { time: 6000,   action: 'fadeOut'},
        { time: 9500,   action: 'fadeIn'},
        { time: 11000,  action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'},
      ],
      [ // row: 1, col: 1
        { time: 3000,   action: 'fadeIn'},
        { time: 4500,   action: 'fadeOut'},
        { time: 5500,   action: 'fadeIn'},
        { time: 7000,   action: 'fadeOut'},
        { time: 9000,   action: 'fadeIn'},
        { time: 10500,  action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ]
    ],
  6:[ 
      [ // row: 0, col: 0
        { time: 1000,   action: 'fadeIn'},
        { time: 2500,   action: 'fadeOut'},
        { time: 8500,   action: 'fadeIn'},
        { time: 10000,  action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 0, col: 1
        { time: 500,    action: 'fadeIn'},
        { time: 2000,   action: 'fadeOut'},
        { time: 7500,   action: 'fadeIn'},
        { time: 9000,   action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 0, col: 2
        { time: 3000,   action: 'fadeIn'},
        { time: 4500,   action: 'fadeOut'},
        { time: 7000,   action: 'fadeIn'},
        { time: 8500,   action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 1, col: 0
        { time: 2000,   action: 'fadeIn'},
        { time: 3500,   action: 'fadeOut'},
        { time: 6000,   action: 'fadeIn'},
        { time: 7500,   action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 1, col: 1
        { time: 5000,   action: 'fadeIn'},
        { time: 6500,   action: 'fadeOut'},
        { time: 9500,   action: 'fadeIn'},
        { time: 11000,  action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 1, col: 2
        { time: 4000,   action: 'fadeIn'},
        { time: 5500,   action: 'fadeOut'},
        { time: 8500,   action: 'fadeIn'},
        { time: 10000,  action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ]
    ],
  9:[
      [ // row: 0, col: 0
        { time: 250,    action: 'fadeIn'},
        { time: 1750,   action: 'fadeOut'},
        { time: 4250,   action: 'fadeIn'},
        { time: 5750,   action: 'fadeOut'},
        { time: 10500,  action: 'fadeIn'},
        { time: 12000,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 0, col: 1
        { time: 1000,   action: 'fadeIn'},
        { time: 2500,   action: 'fadeOut'},
        { time: 7250,   action: 'fadeIn'},
        { time: 8750,   action: 'fadeOut'},
        { time: 10750,  action: 'fadeIn'},
        { time: 12250,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 0, col: 2
        { time: 500,    action: 'fadeIn'},
        { time: 2000,   action: 'fadeOut'},
        { time: 5000,   action: 'fadeIn'},
        { time: 6500,   action: 'fadeOut'},
        { time: 10250,  action: 'fadeIn'},
        { time: 11750,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 1, col: 0
        { time: 1500,   action: 'fadeIn'},
        { time: 3000,   action: 'fadeOut'},
        { time: 5500,   action: 'fadeIn'},
        { time: 7000,   action: 'fadeOut'},
        { time: 11250,  action: 'fadeIn'},
        { time: 12750,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 1, col: 1
        { time: 1250,   action: 'fadeIn'},
        { time: 2750,   action: 'fadeOut'},
        { time: 7500,   action: 'fadeIn'},
        { time: 9000,   action: 'fadeOut'},
        { time: 11500,  action: 'fadeIn'},
        { time: 13000,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 1, col: 2
        { time: 2000,   action: 'fadeIn'},
        { time: 3500,   action: 'fadeOut'},
        { time: 6250,   action: 'fadeIn'},
        { time: 7750,   action: 'fadeOut'},
        { time: 11725,  action: 'fadeIn'},
        { time: 13250,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 2, col: 0
        { time: 1750,   action: 'fadeIn'},
        { time: 3250,   action: 'fadeOut'},
        { time: 4750,   action: 'fadeIn'},
        { time: 6250,   action: 'fadeOut'},
        { time: 12000,  action: 'fadeIn'},
        { time: 13500,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 2, col: 1
        { time: 2250,   action: 'fadeIn'},
        { time: 3750,   action: 'fadeOut'},
        { time: 8250,   action: 'fadeIn'},
        { time: 9750,   action: 'fadeOut'},
        { time: 12250,  action: 'fadeIn'},
        { time: 13750,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ],
      [ // row: 2, col: 1
        { time: 2500,   action: 'fadeIn'},
        { time: 4000,   action: 'fadeOut'},
        { time: 5000,   action: 'fadeIn'},
        { time: 6500,   action: 'fadeOut'},
        { time: 12500,  action: 'fadeIn'},
        { time: 14000,  action: 'fadeOut'},
        { time: 16000,  action: 'wait'}
      ]
    ]
  }
}