import { NavPhaseEnum } from '@enums/NavPhaseEnum';

// Google Analytics event names
const navPhaseString = {
  [NavPhaseEnum.UPLOAD]: 'NAV_PHASE_CHANGED_UPLOAD',
  [NavPhaseEnum.EDIT]: 'NAV_PHASE_CHANGED_EDIT',
  [NavPhaseEnum.DOWNLOAD]: 'NAV_PHASE_CHANGED_DOWNLOAD'
}

export default navPhaseString;
