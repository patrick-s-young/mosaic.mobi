import { NavPhaseEnum } from '@enums/NavPhaseEnum';

export type NavigationButtonProps = {
  label: string;
  value: NavPhaseEnum;
  activeNavPhase: NavPhaseEnum;
  onClick: (navPhase: NavPhaseEnum) => void;
}