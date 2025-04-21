import { type CardValue } from "@/engine/constants";
import { type GameContext } from "@/engine/context";


export abstract class GamePhase {
    protected ctx!: GameContext;
    public abstract name: string;

    public setContext(ctx: GameContext) {
        this.ctx = ctx;
    }

    public abstract handlePlayerPlayability(): void;
    public abstract handlePlayedCard(cardValue: CardValue): void;
    public abstract handleCardEffect(): void;
}