import { type CardValue } from "@/engine/constants"
import { GamePhase } from "./base"
import { PlayerPlayabilityPhase } from "./playerPlayability"
import { CardEffectPhase } from "./cardEffect"

export class PlayingPhase extends GamePhase {
    public handlePlayerPlayability(): void { }

    public handlePlayedCard(cardValue: CardValue): void {
        const currentPlayer = this.ctx.getCurrentPlayer()
        if (!(this.ctx.playerHasCardValue(currentPlayer, cardValue) && this.ctx.cardIsPlayable(cardValue))) {
            this.ctx.penaltyPlayer(currentPlayer)
            this.ctx.nextTurn()
            return this.ctx.transitionTo(new PlayerPlayabilityPhase())
        }

        return this.ctx.transitionTo(new CardEffectPhase())
    }

    public handleCardEffect(): void { }
}