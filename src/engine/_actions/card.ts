import { GameContext } from "@/engine/contexts/game";

export interface CardAction {
    apply(ctx: GameContext): void;
}

export class NullAction implements CardAction {
    public apply(ctx: GameContext): void {
        return
    }
}

export class BurnerAction implements CardAction {
    public apply(ctx: GameContext): void {
        ctx.table.burn()
        ctx.turn.nextTurn()
    }
}

export class InvertAction implements CardAction {
    public apply(ctx: GameContext): void {
        ctx.turn.reverseTurnOrder()
    }
}

export class SkipAction implements CardAction {
    public apply(ctx: GameContext): void {
        ctx.turn.skipNextPlayer()
    }
}

export class TogglePileOrderAction implements CardAction {
    public apply(ctx: GameContext): void {
        ctx.table.reversePileOrder()
    }
}

export class PunishPlayerAction implements CardAction {
    public apply(ctx: GameContext): void {
        const nextPlayer = ctx.turn.getNextPlayer()
        const discardPile = ctx.table.discardPile;
        nextPlayer.addCards(...discardPile);
        ctx.table.burn();
    }
}