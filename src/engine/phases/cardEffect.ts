import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { PlayerPlayabilityPhase } from "@/engine/phases/playerPlayability";

export class CardEffectPhase extends GamePhase {
    public name: string = "CardEffect";

    public handlePlayerPlayability(): void { }
    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void {
        const card = this.ctx.getTopCard()
        if (card == null) return;

        // TODO: Transladar la responsabilidad de aplicar el efecto a la carta en sí
        switch (card.value) {
            case "7":
                this.ctx.invertPileOrder()
                return this.ctx.transitionTo(new PlayerPlayabilityPhase())
            case "8":
                this.ctx.skipNextPlayer()
                return this.ctx.transitionTo(new PlayerPlayabilityPhase())
            case "10":
                this.ctx.burn()
                return this.ctx.transitionTo(new PlayerPlayabilityPhase())
            case "J":
                this.ctx.reverseTurnOrder()
                return this.ctx.transitionTo(new PlayerPlayabilityPhase())
            case "Joker":
                const nextPlayer = this.ctx.getNextPlayer()
                this.ctx.penaltyPlayer(nextPlayer)
                return this.ctx.transitionTo(new PlayerPlayabilityPhase())
            default:
                return this.ctx.transitionTo(new PlayerPlayabilityPhase())
        }
    }
}