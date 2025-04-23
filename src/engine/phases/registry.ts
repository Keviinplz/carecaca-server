import { PlayerPlayabilityPhase } from '@engine/phases/playerPlayability';
import { PlayingPhase } from '@engine/phases/playing';
import { CardEffectPhase } from '@engine/phases/cardEffect';
import { EndPhase } from '@engine/phases/end';

export const Phases = {
    playerPlayability: new PlayerPlayabilityPhase(),
    playing: new PlayingPhase(),
    cardEffect: new CardEffectPhase(),
    end: new EndPhase(),
} as const;

export type PhaseKey = keyof typeof Phases;