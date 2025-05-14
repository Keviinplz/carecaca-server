import { type CardValue } from "@engine/constants";
import { GamePhase } from "@engine/phases/base";
import { GameContext } from "@engine/context";

export class PlayerPlayabilityPhase implements GamePhase {
    public handlePlayerPlayability(ctx: GameContext) {
        if (!ctx.rules.isGameStillPlayable(ctx.players)) return ctx.toEndPhase()

        const currentPlayer = ctx.turn.getCurrentPlayer();

        if (currentPlayer.won()) return ctx.completeTurn()

        const canPlayFromHand = ctx.rules.canPlayerPlayFromHand(currentPlayer, ctx.table)
        const candPlayFromFaceUp = ctx.rules.canPlayerPlayFromFaceUp(currentPlayer, ctx.table)
        const canPlayFromFaceDown = ctx.rules.canPlayerPlayFromFaceDown(currentPlayer)

        if (canPlayFromHand || candPlayFromFaceUp || canPlayFromFaceDown) {
            return ctx.toPlayingPhase()
        }

        ctx.applyPenalty(currentPlayer)
        ctx.completeTurn()
    }

    public handlePlayedCard(_ctx: GameContext, _cardValue: CardValue): void {}
    public handlePlayFaceDownCard(_ctx: GameContext): void {}
    public handleCardEffect(_ctx: GameContext): void {}
}