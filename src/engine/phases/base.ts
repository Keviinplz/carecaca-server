import { type GameContext } from "@/engine/context";
import { CardValue } from "../constants";

export interface GamePhase {

    getName(): string;
    setContext(ctx: GameContext): void;
    handlePlayerPlayability(): void;
    handlePlayedCard(cardValue: CardValue): void;
    handleCardEffect(): void;
}