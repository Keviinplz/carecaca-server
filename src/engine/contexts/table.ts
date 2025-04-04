import { Card } from "@/engine/models/card";

export class TableContext {
    private drawDeck: Card[];
    public discardPile: Card[];
    public isPileAscending: boolean;

    constructor(drawDeck: Card[], discardPile: Card[]) {
        this.drawDeck = drawDeck;
        this.discardPile = discardPile;
        this.isPileAscending = true
    }

    public getDeckLength(): number {
        return this.drawDeck.length;
    }

    public draw(): Card | null {
        return this.drawDeck.pop() || null;
    }

    public burn() {
        this.discardPile = [];
    }

    public addToPile(card: Card) {
        this.discardPile.push(card)
    }

    public viewTopCard(): Card | null {
        return this.discardPile[this.discardPile.length - 1] || null;
    }

    public getPileLength(): number {
        return this.discardPile.length;
    }

    public reversePileOrder() {
        this.isPileAscending = !this.isPileAscending
    }
}