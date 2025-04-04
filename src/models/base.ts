export type Point = {
    x: number
    y: number
}

export interface GameUIObject {
    draw(ctx: CanvasRenderingContext2D): void
}