import { ScreenType, TransitionType, PlayerState } from '../../types';

export interface GameProps {
  onNavigate: (screen: ScreenType, transition?: TransitionType) => void;
  playerState?: PlayerState;
  setPlayerState?: React.Dispatch<React.SetStateAction<PlayerState>>;
  onLoseHeart?: () => void;
  onWin?: (questId: string) => Promise<void>;
}