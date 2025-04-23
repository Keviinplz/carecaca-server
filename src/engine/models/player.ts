import { Card } from "@/engine/models/card";
import { CardValue } from "@/engine/constants";
import * as utils from "@/engine/utils";

export class Player {
    public name: string;
    public hand: Card[];
    public faceUpCards: Card[];
    public faceDownCards: Card[];

    constructor(name: string, hand: Card[], faceUpCards: Card[], faceDownCards: Card[]) {
        this.name = name;
        this.hand = hand;
        this.faceUpCards = faceUpCards;
        this.faceDownCards = faceDownCards;
    }

    public won(): boolean {
        return this.hand.length === 0 &&
            this.faceUpCards.length === 0 &&
            this.faceDownCards.length === 0;
    }

    public addCardsToHand(...cards: Card[]): void {
        this.hand.push(...cards);
    }

    public findCardInHand(value: CardValue): Card | undefined {
        return utils.findCardInStack(this.hand, value);
    }

    public findCardInFaceUp(value: CardValue): Card | undefined {
        return utils.findCardInStack(this.faceUpCards, value);
    }

    public hasCardInHand(value: CardValue): boolean {
        return this.hand.some(card => card.value === value);
    }

    public hasCardInFaceUp(value: CardValue): boolean {
        return this.faceUpCards.some(card => card.value === value);
    }

    public removeCardFromHand(value: CardValue): Card | undefined {
        return utils.removeCardFromStackByValue(this.hand, value);
    }

    public removeCardFromFaceUp(value: CardValue): Card | undefined {
        return utils.removeCardFromStackByValue(this.faceUpCards, value);
    }

    public removeFaceDownCardByIndex(index: number): Card | undefined {
        return utils.removeCardFromStackByIndex(this.faceDownCards, index);
    }
}