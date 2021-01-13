import { 
  NumTiles          // buttons in <MosiacSelector>
} from 'features/mosaicVideo/mosaicSlice';

// union NumTiles with future state value types that will be set using <Button> component
export type StateValue =  NumTiles; 

export interface ButtonConfig {
  stateValue: StateValue
  imagePath: string
  altText: string
}

export interface ButtonProps extends ButtonConfig {
  onClickCallback: (newStateValue: StateValue) => void
  className: { 
    default: string,
    hilite: string
  }
  isEnabled: boolean
}