import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";
import { GameContext } from "../context";

export class EndPhase implements GamePhase {
    public ctx: GameContext | null;

    constructor() {
        this.ctx = null
    }

    setContext(ctx: GameContext): void {
        this.ctx = ctx
    }

    getName(): string {
        return "EndPhase"
    }

    public handlePlayerPlayability(): void { }
    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void { }
}