import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { GameContext } from "@/engine/context";

export class CardEffectPhase implements GamePhase {
    getName(): string {
        return "CardEffect"
    }

    public handlePlayerPlayability(_ctx: GameContext): void {}
    public handlePlayedCard(_ctx: GameContext, _cardValue: CardValue): void {}
    public handlePlayFaceDownCard(_ctx: GameContext, _cardIndex: number): void {}
    public handleCardEffect(ctx: GameContext): void {
        const card = ctx.table.getTopCard()
        if (card == null) return;

        card.applyEffect(ctx);
        return ctx.completeTurn()
    }
}