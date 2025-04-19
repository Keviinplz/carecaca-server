import { CARD_SUITS, CARD_VALUES, CardSuit, CardValue } from "@/engine/constants";
import type { DrawingContext, GameUIObject, Point } from "./base";

type CardUIProps = {
    value: CardValue
    suit: CardSuit
    tablePosition: Point
}


export class CardUI implements GameUIObject {
    private value: CardValue
    private suit: CardSuit
    private hidden: boolean
    public tablePosition: Point
    public CARD_DISPLAY_WIDTH = 50 as const;
    
    constructor(props: CardUIProps) {
        this.value = props.value
        this.suit = props.suit
        this.tablePosition = props.tablePosition
        this.hidden = false
    }

    private getSpriteIndex(): {spriteX: number, spriteY: number} {
        const spriteX = CARD_VALUES.findIndex((value) => this.hidden ? value === "Down" : value === this.value)
        const spriteY = CARD_SUITS.findIndex((suit) => this.hidden ? suit === "♠️" : suit === this.suit)

        return {spriteX, spriteY}
    }

    setPosition(tablePosition: Point): void {
        this.tablePosition = tablePosition
    }

    setHidden(value: boolean): void {
        this.hidden = value
    }

    draw(drawingCtx: DrawingContext): void {
        const {ctx, assets} = drawingCtx;
        const cardImage = assets.find((el) => el.id === "card-sprite");
        if (!cardImage) return;
        const {spriteX, spriteY} = this.getSpriteIndex()
        const cardWidth = cardImage.width / CARD_VALUES.length;
        const cardHeight = cardImage.height / CARD_SUITS.length;
        const cardPixelXPos = spriteX * cardWidth;
        const cardPixelYPos = spriteY * cardHeight;
        const cardImageAspectRatio = cardWidth / cardHeight;
        const cardDisplayHeight = this.CARD_DISPLAY_WIDTH * (1 / cardImageAspectRatio);
        ctx.drawImage(
            cardImage, 
            cardPixelXPos, 
            cardPixelYPos, 
            cardWidth, 
            cardHeight, 
            this.tablePosition.x - (this.CARD_DISPLAY_WIDTH / 2), 
            this.tablePosition.y - (cardDisplayHeight / 2), 
            this.CARD_DISPLAY_WIDTH,
            cardDisplayHeight
        )
    }
}