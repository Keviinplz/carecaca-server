import type { GameUIObject, Point } from "@/models/base";
import { CardUI } from "./card";

type PlayerUIProps = {
    name: string;
    isMyself: boolean
    isCurrentPlaying: boolean
    hand: CardUI[];
    faceUpCards: CardUI[];
    faceDownCards: CardUI[];
    tablePosition: Point
}

export class PlayerUI implements GameUIObject {
    public name: string;
    public tablePosition: Point
    public isMyself: boolean
    public isCurrentPlaying: boolean
    public hand: CardUI[]
    public faceUpCards: CardUI[]
    public faceDownCards: CardUI[]
    private handCardMargin = 50;

    constructor(props: PlayerUIProps) {
        this.name = props.name
        this.tablePosition = props.tablePosition
        this.isMyself = props.isMyself
        this.isCurrentPlaying = props.isCurrentPlaying
        this.hand = props.hand
        this.faceUpCards = props.faceUpCards
        this.faceDownCards = props.faceDownCards
        this.handCardMargin = 50;
    }

    setPosition(tablePosition: Point): void {
        this.tablePosition = tablePosition
    }

    private drawName(ctx: CanvasRenderingContext2D): void {
        ctx.fillText(this.name, this.tablePosition.x - 12, this.tablePosition.y - 40);
    }

    private drawHandCards(ctx: CanvasRenderingContext2D): void {
        for (const [index, card] of this.hand.entries()) {
            let cardPosition: Point;
            const k = index + ((1 - this.hand.length) / 2);
            cardPosition = {x: this.tablePosition.x + (k* this.handCardMargin), y: this.tablePosition.y}
            card.setPosition(cardPosition)
            card.draw(ctx)
        }
    }

    private drawFaceUpCards(ctx: CanvasRenderingContext2D): void {
        for (const [index, card] of this.faceUpCards.entries()) {
            let cardPosition: Point;
            const k = index + ((1 - this.faceUpCards.length) / 2);
            cardPosition = {x: this.tablePosition.x + (k* this.handCardMargin), y: this.tablePosition.y + 80}
            card.setPosition(cardPosition)
            card.draw(ctx)
        }
    }

    private drawFaceDownCards(ctx: CanvasRenderingContext2D): void {
        for (const [index, card] of this.faceDownCards.entries()) {
            let cardPosition: Point;
            const k = index + ((1 - this.faceDownCards.length) / 2);
            cardPosition = {x: this.tablePosition.x + (k* this.handCardMargin), y: this.tablePosition.y + 100}
            card.setPosition(cardPosition)
            card.setHidden(true)
            card.draw(ctx)
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.drawName(ctx)
        this.drawHandCards(ctx)
        this.drawFaceDownCards(ctx)
        this.drawFaceUpCards(ctx)
    }
}