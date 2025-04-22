import { type CardValue } from "@/engine/constants"
import { GamePhase } from "@/engine/phases/base"
import { PlayerPlayabilityPhase } from "@/engine/phases/playerPlayability"
import { CardEffectPhase } from "@/engine/phases/cardEffect"
import { GameContext } from "../context";

export class PlayingPhase implements GamePhase {
    public ctx: GameContext | null;

    constructor() {
        this.ctx = null
    }

    setContext(ctx: GameContext): void {
        this.ctx = ctx
    }

    getName(): string {
        return "PlayingPhase"
    }

    public handlePlayerPlayability(): void { }

    public handlePlayedCard(cardValue: CardValue): void {
        if (!this.ctx) return;
        const ctx = this.ctx;

        const currentPlayer = ctx.turn.getCurrentPlayer()
        if (!(currentPlayer.getCard(cardValue, false) && ctx.cardIsPlayable(cardValue))) {
            ctx.penaltyPlayer(currentPlayer)
            ctx.turn.next()
            return ctx.transitionTo(new PlayerPlayabilityPhase())
        }

        return ctx.transitionTo(new CardEffectPhase())
    }

    public handleCardEffect(): void { }
}