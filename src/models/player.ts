import type { DrawingContext, GameUIObject, Point } from "@/models/base";
import { CardUI } from "./card";
import { radiansToDegrees } from "@/utils";
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

    private drawName(drawingCtx: DrawingContext): void {
        const {ctx} = drawingCtx;
        ctx.fillText(this.name, this.tablePosition.x - 12, this.tablePosition.y - 40);
    }

    private drawHandCards(drawingCtx: DrawingContext): void {
        const {ctx} = drawingCtx;
        const origin = {x: ctx.canvas.width / 2, y: ctx.canvas.height / 2}
        const rotationAngle = (Math.PI / 2) - Math.atan(((this.tablePosition.y - origin.y) / (origin.x - this.tablePosition.x)))
        
        ctx.save()
        ctx.translate(origin.x, origin.y)
        for (const [index, card] of this.hand.entries()) {
            let cardPosition: Point;
            const k = index + ((1 - this.hand.length) / 2);
            cardPosition = {
                x: this.tablePosition.x + (k* this.handCardMargin), 
                y: this.tablePosition.y
            }
            cardPosition.x = origin.x - cardPosition.x;
            cardPosition.y = cardPosition.y - origin.y;
            card.setPosition(cardPosition)
            ctx.save()
            ctx.translate(cardPosition.x, cardPosition.y)
            ctx.rotate(rotationAngle)
            ctx.translate(-cardPosition.x, -cardPosition.y)
            card.draw(drawingCtx)
            ctx.restore()
        }
        ctx.restore()
    }

    private drawFaceUpCards(drawingCtx: DrawingContext): void {
        const {ctx} = drawingCtx;
        for (const [index, card] of this.faceUpCards.entries()) {
            let cardPosition: Point;
            const k = index + ((1 - this.faceUpCards.length) / 2);
            cardPosition = {x: this.tablePosition.x + (k* this.handCardMargin), y: this.tablePosition.y + 80}
            card.setPosition(cardPosition)
            card.draw(drawingCtx)
        }
    }

    private drawFaceDownCards(drawingCtx: DrawingContext): void {
        const {ctx} = drawingCtx;
        for (const [index, card] of this.faceDownCards.entries()) {
            let cardPosition: Point;
            const k = index + ((1 - this.faceDownCards.length) / 2);
            cardPosition = {x: this.tablePosition.x + (k* this.handCardMargin), y: this.tablePosition.y + 100}
            card.setPosition(cardPosition)
            card.setHidden(true)
            card.draw(drawingCtx)
        }
    }

    draw(drawingCtx: DrawingContext): void {
        this.drawName(drawingCtx)
        this.drawHandCards(drawingCtx)
        // this.drawFaceUpCards(drawingCtx)
        // this.drawFaceDownCards(drawingCtx)
    }
}