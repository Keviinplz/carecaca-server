import { type CardValue } from "@/engine/constants";
import { type GameContext } from "@/enginev2/context";


export abstract class GamePhase {
    protected ctx: GameContext;

    public setContext(ctx: GameContext) {
        this.ctx = ctx;
    }

    public abstract handlePlayerPlayability(): void;
    public abstract handlePlayedCard(cardValue: CardValue): void;
    public abstract handleCardEffect(): void;
}