import { CardValue } from "@engine/constants";
import { GameContext } from "@engine/context";

export interface GamePhase {
    handlePlayerPlayability(ctx: GameContext): void;
    handlePlayedCard(ctx: GameContext, cardValue: CardValue): void;
    handlePlayFaceDownCard(ctx: GameContext): void;
    handleCardEffect(ctx: GameContext): void;
}