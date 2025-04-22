import { Card } from "@/engine/models/card";

export class Table {
    public discardPile: Card[];
    public drawDeck: Card[];
    public isPileAscending: boolean;
    
    constructor(discardPile: Card[], drawDeck: Card[], isPileAscending: boolean) {
        this.discardPile = discardPile;
        this.drawDeck = drawDeck;
        this.isPileAscending = isPileAscending
    }

    invertPileOrder() {
        this.isPileAscending = !this.isPileAscending
    }

    getTopCard() {
        return this.discardPile[this.discardPile.length - 1]
    }

    burn() {
        this.discardPile = []
    }
}