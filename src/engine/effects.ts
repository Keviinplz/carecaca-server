import { GameContext } from "@/engine/context";

export interface CardEffect {
    apply(ctx: GameContext): void;
}


export class BurnerEffect implements CardEffect {
    public apply(ctx: GameContext): void {
        ctx.table.burn()
    }
}

export class InvertEffect implements CardEffect {
    public apply(ctx: GameContext): void {
        ctx.turn.reverseDirection()
    }
}

export class SkipEffect implements CardEffect {
    public apply(ctx: GameContext): void {
        ctx.turn.next()
    }
}

export class TogglePileOrderEffect implements CardEffect {
    public apply(ctx: GameContext): void {
        ctx.table.invertPileOrder()
    }
}

export class PunishPlayerEffect implements CardEffect {
    public apply(ctx: GameContext): void {
        const nextPlayer = ctx.turn.getNextPlayer()
        ctx.applyPenalty(nextPlayer)
    }
}