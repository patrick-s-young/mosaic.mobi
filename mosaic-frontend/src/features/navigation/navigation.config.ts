
import { ButtonProps } from '../../components/Button';
import navUpload from '../../assets/images/nav_upload_160x160.png';
import navEdit from '../../assets/images/nav_edit_160x160.png';
import navDownload from '../../assets/images/nav_download_160x160.png';


type NavigationState =  'Upload Video' | 'Edit Mosaic' | 'Render Mosaic';

// instead of function store value in const
function navigationConfig (): ButtonProps<NavigationState>[] {
  const navValues: Array<NavigationState> = ['Upload Video', 'Edit Mosaic', 'Render Mosaic'];
  const imageModules: {[index: string]:any} = {
    'Upload Video': navUpload, 
    'Edit Mosaic': navEdit, 
    'Render Mosaic': navDownload
  }

  return navValues.map(navValue => {
    return {
      stateValue: navValue,
      onClickCallback: (newStateValue: NavigationState) => 1,
      isEnabled: false,
      className: {
        default: 'navigation_button_default',
        hilite: 'navigation_button_hilite' 
      },
      imagePath: imageModules[`${navValue}`],
      altText: `Click for ${navValue}`
    }
  });
}

export default navigationConfig;


