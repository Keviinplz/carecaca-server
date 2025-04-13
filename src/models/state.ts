import { CardUI } from "./card"
import { PlayerUI } from "./player"

export type GameState = {
    players: PlayerUI[],
    discardPile: CardUI[],
    drawDeck: CardUI[]
}
