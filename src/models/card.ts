import { CARD_SUITS, CARD_VALUES, CardSuit, CardValue } from "@/engine/constants";
import type { GameUIObject, Point } from "./base";
import cardSprite from '@/assets/cards.png';

type CardUIProps = {
    value: CardValue
    suit: CardSuit
    tablePosition: Point
}

const CARD_DISPLAY_WIDTH = 50;

export class CardUI implements GameUIObject {
    private value: CardValue
    private suit: CardSuit
    private tablePosition: Point
    private hidden: boolean

    constructor(props: CardUIProps) {
        this.value = props.value
        this.suit = props.suit
        this.tablePosition = props.tablePosition
        this.hidden = false
    }

    setPosition(tablePosition: Point): void {
        this.tablePosition = tablePosition
    }

    setHidden(value: boolean): void {
        this.hidden = value
    }

    draw(ctx: CanvasRenderingContext2D): void {
        const xIndex = CARD_VALUES.findIndex((value) => this.hidden ? value === "Down" : value === this.value)
        const yIndex = CARD_SUITS.findIndex((suit) => this.hidden ? suit === "♠️" : suit === this.suit)
        const cardImage = new Image()
        cardImage.onload = () => {
            const cardWidth = cardImage.width / CARD_VALUES.length;
            const cardHeight = cardImage.height / CARD_SUITS.length;
            const cardPixelXPos = xIndex * cardWidth;
            const cardPixelYPos = yIndex * cardHeight;
            const cardImageAspectRatio = cardWidth / cardHeight;
            const cardDisplayHeight = CARD_DISPLAY_WIDTH * (1 / cardImageAspectRatio);
            ctx.drawImage(
                cardImage, 
                cardPixelXPos, 
                cardPixelYPos, 
                cardWidth, 
                cardHeight, 
                this.tablePosition.x - (CARD_DISPLAY_WIDTH / 2), 
                this.tablePosition.y - (cardDisplayHeight / 2), 
                CARD_DISPLAY_WIDTH,
                cardDisplayHeight
            )
        }
        cardImage.src = cardSprite;
    }
}