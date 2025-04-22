import { type CardValue } from "@/engine/constants";
import { GameContext } from "@/engine/context";
import { CardEffect } from "@/engine/effects";

export class Card {
    public value: CardValue;
    private effect: CardEffect | null;

    constructor(value: CardValue, effect: CardEffect | null = null) {
        this.value = value;
        this.effect = effect
    }

    applyEffect(ctx: GameContext): void {
        if (!this.effect) return;

        return this.effect.apply(ctx)
    }
}