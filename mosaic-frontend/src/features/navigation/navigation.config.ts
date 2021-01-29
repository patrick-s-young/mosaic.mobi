
import { ButtonProps } from '../../components/Button';
import { NavPhaseEnum } from 'features/navigation/navSlice';
import navUpload from '../../assets/images/nav_upload_160x160.png';
import navEdit from '../../assets/images/nav_edit_160x160.png';
import navDownload from '../../assets/images/nav_download_160x160.png';

function navigationConfig (): ButtonProps<NavPhaseEnum>[] {
  const navValues: Array<NavPhaseEnum> = [NavPhaseEnum.UPLOAD, NavPhaseEnum.EDIT, NavPhaseEnum.DOWNLOAD];
  const imageModules = [navUpload, navEdit, navDownload];
  const altText: Array<string> = ['Upload Video', 'Edit Mosaic', 'Download Mosaic'];

  return navValues.map(navPhase => {
    return {
      stateValue: navPhase,
      onClickCallback: (newStateValue: NavPhaseEnum) => 1,
      isEnabled: false,
      className: {
        default: 'navigation_button_default',
        hilite: 'navigation_button_hilite' 
      },
      imagePath: imageModules[navPhase],
      altText: `Click for ${altText[navPhase]}`
    }
  });
}

export default navigationConfig;


