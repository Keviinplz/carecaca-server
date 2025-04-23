import { CardValue } from "@/engine/constants";
import { GameContext } from "@/engine/context";

export interface GamePhase {

    getName(): string;
    handlePlayerPlayability(ctx: GameContext): void;
    handlePlayedCard(ctx: GameContext, cardValue: CardValue): void;
    handlePlayFaceDownCard(ctx: GameContext, cardIndex: number): void;
    handleCardEffect(ctx: GameContext): void;
}