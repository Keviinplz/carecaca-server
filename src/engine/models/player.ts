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

    private chooseCard(card: Card, deck: Card[]): void {
        const playerCardIndex = deck.findIndex((playerCard) => playerCard.value === card.value && playerCard.suit === card.suit)
        if (playerCardIndex === -1) {
            throw new Error("Card choosed is not in player hand");
            
        }

        deck.splice(playerCardIndex, 1)
    }

    public chooseHandCard(card: Card): void {
        return this.chooseCard(card, this.hand)
    }

    public chooseFaceUpCard(card: Card): void {
       return this.chooseCard(card, this.faceUpCards)
    }

    public addCards(...cards: Card[]): void {
        this.hand = this.hand.concat(cards);
    }

}