import { CardAction } from "@/engine/actions/card";
import { type CardSuit, type CardValue } from "@/engine/constants";

export class Card {
    public suit: CardSuit;
    public value: CardValue;
    public action: CardAction;

    constructor(value: CardValue, suit: CardSuit, action: CardAction) {
        this.suit = suit;
        this.value = value;
        this.action = action
    }

    public display() {
        return `[${this.suit}] ${this.value}`
    }
}