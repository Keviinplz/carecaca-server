import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { EndPhase } from "@/engine/phases/end";
import { PlayingPhase } from "@/engine/phases/playing";

export class PlayerPlayabilityPhase extends GamePhase {
    public name: string = "PlayerPlayability";

    public handlePlayerPlayability() {
        if (!this.ctx.gameStillPlayable()) {
            this.ctx.transitionTo(new EndPhase())
        }
        const currentPlayer = this.ctx.getCurrentPlayer();

        let playerWins = !currentPlayer.hand && !currentPlayer.faceUpCards && !currentPlayer.faceDownCards
        if (playerWins) {
            this.ctx.nextTurn()
            return this.ctx.transitionTo(new PlayerPlayabilityPhase())
        }

        if (currentPlayer.hand && currentPlayer.hand.some((handCard) => this.ctx.cardIsPlayable(handCard.value))) {
            return this.ctx.transitionTo(new PlayingPhase())
        }
        if (!currentPlayer.hand && currentPlayer.faceUpCards && currentPlayer.faceUpCards.some((upCard) => this.ctx.cardIsPlayable(upCard.value))) {
            return this.ctx.transitionTo(new PlayingPhase())
        }
        if (!currentPlayer.hand && !currentPlayer.faceUpCards && currentPlayer.faceDownCards) {
            return this.ctx.transitionTo(new PlayingPhase())
        }

        this.ctx.penaltyPlayer(currentPlayer)
        this.ctx.nextTurn()
        return this.ctx.transitionTo(new PlayerPlayabilityPhase())
    }

    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void { }
}