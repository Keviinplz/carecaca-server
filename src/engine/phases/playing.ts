import { type CardValue } from "@/engine/constants"
import { GamePhase } from "@/engine/phases/base"
import { PlayerPlayabilityPhase } from "@/engine/phases/playerPlayability"
import { CardEffectPhase } from "@/engine/phases/cardEffect"

export class PlayingPhase extends GamePhase {
    public name: string = "PlayingPhase";

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