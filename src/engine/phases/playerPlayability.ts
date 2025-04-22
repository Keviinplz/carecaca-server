import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { EndPhase } from "@/engine/phases/end";
import { PlayingPhase } from "@/engine/phases/playing";
import { GameContext } from "../context";

export class PlayerPlayabilityPhase implements GamePhase {
    public ctx: GameContext | null;

    constructor() {
        this.ctx = null
    }

    setContext(ctx: GameContext): void {
        this.ctx = ctx
    }

    getName(): string {
        return "PlayerPlayability"
    }

    public handlePlayerPlayability() {
        if (this.ctx === null) return;
        const ctx = this.ctx

        if (!ctx.gameStillPlayable()) {
            ctx.transitionTo(new EndPhase())
        }
        const currentPlayer = ctx.turn.getCurrentPlayer();

        let playerWins = !currentPlayer.hand && !currentPlayer.faceUpCards && !currentPlayer.faceDownCards
        if (playerWins) {
            ctx.turn.next()
            return ctx.transitionTo(new PlayerPlayabilityPhase())
        }

        if (currentPlayer.hand && currentPlayer.hand.some((handCard) => ctx.cardIsPlayable(handCard.value))) {
            return ctx.transitionTo(new PlayingPhase())
        }
        if (!currentPlayer.hand && currentPlayer.faceUpCards && currentPlayer.faceUpCards.some((upCard) => ctx.cardIsPlayable(upCard.value))) {
            return ctx.transitionTo(new PlayingPhase())
        }
        if (!currentPlayer.hand && !currentPlayer.faceUpCards && currentPlayer.faceDownCards) {
            return ctx.transitionTo(new PlayingPhase())
        }

        ctx.penaltyPlayer(currentPlayer)
        ctx.turn.next()
        return ctx.transitionTo(new PlayerPlayabilityPhase())
    }

    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void { }
}