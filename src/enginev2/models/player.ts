import { Card } from "./card";

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
}