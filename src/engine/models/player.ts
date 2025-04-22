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

    public getCard(value: CardValue, removeFromPlayer: boolean): Card | null {
        let targetCard: Card | null;
        if (this.hand) {
            targetCard = utils.getCardFromStack(this.hand, value, removeFromPlayer)
            if (targetCard) return targetCard;
        }

        if (this.faceUpCards) {
            targetCard = utils.getCardFromStack(this.faceUpCards, value, removeFromPlayer)
            if (targetCard) return targetCard;
        }

        if (this.faceDownCards) {
            targetCard = utils.getCardFromStack(this.faceDownCards, value, removeFromPlayer)
            if (targetCard) return targetCard;
        }

        return null;
    }
}