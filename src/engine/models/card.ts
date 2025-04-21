import { type CardValue } from "@/engine/constants";

export class Card {
    public value: CardValue;

    constructor(value: CardValue) {
        this.value = value;
    }
}