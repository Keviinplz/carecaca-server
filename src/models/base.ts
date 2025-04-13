import { GameState } from "./state"

export type Point = {
    x: number
    y: number
}

export type DrawingContext = {
    ctx: CanvasRenderingContext2D,
    gameState: GameState
    assets: HTMLImageElement[]
}

export interface GameUIObject {
    draw(ctx: DrawingContext): void
}