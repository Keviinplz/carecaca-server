import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { GameContext } from "@/engine/context";

export class EndPhase implements GamePhase {
    public handlePlayerPlayability(_ctx: GameContext): void {}
    public handlePlayedCard(_ctx: GameContext, _cardValue: CardValue): void {}
    public handlePlayFaceDownCard(_ctx: GameContext, _cardIndex: number): void {}
    public handleCardEffect(_ctx: GameContext): void {}
}