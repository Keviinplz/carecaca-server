import type { GameState } from "./models/state"


export type GameAction = {
    type: 'default'
}

export default function gameStateReducer(gameState: GameState, action: GameAction) {
    switch (action.type) {
        case 'default': return gameState
        default: return gameState
    }
}