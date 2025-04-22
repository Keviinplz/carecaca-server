import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { PlayerPlayabilityPhase } from "@/engine/phases/playerPlayability";
import { GameContext } from "../context";

export class CardEffectPhase implements GamePhase {
    public ctx: GameContext | null;
    
    constructor() {
        this.ctx = null
    }

    public setContext(ctx: GameContext): void {
        this.ctx = ctx
    }

    getName(): string {
        return "CardEffect"
    }

    public handlePlayerPlayability(): void { }
    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void {
        if (!this.ctx) return;
        const ctx = this.ctx

        const card = ctx.table.getTopCard()
        if (card == null) return;

        card.applyEffect(ctx);
        ctx.turn.next()
        return ctx.transitionTo(new PlayerPlayabilityPhase())
    }
}