import { type CardValue } from "@engine/constants";
import { GamePhase } from "@engine/phases/base";
import { GameContext } from "@engine/context";

export class CardEffectPhase implements GamePhase {
    public handlePlayerPlayability(_ctx: GameContext): void {}
    public handlePlayedCard(_ctx: GameContext, _cardValue: CardValue): void {}
    public handlePlayFaceDownCard(_ctx: GameContext): void {}
    public handleCardEffect(ctx: GameContext): void {
        const card = ctx.table.getTopCard()        
        if (card !== null) card.applyEffect(ctx);

        return ctx.completeTurn()
    }
}