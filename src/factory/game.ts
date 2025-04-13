import { CARD_SUITS, CARD_VALUES, type CardSuit, type CardValue } from "@/engine/constants";
import { CardUI } from "@/models/card";
import { PlayerUI } from "@/models/player";
import { GameState } from "@/models/state";

type Player = {
    name: string
    isMyself: boolean
}

type Card = {
    value: CardValue
    suit: CardSuit
}

export function spawnDeck(): Card[] {
    let cards: Card[] = []
    for (const suit of CARD_SUITS) {
        for (const value of CARD_VALUES) {
            if (value === "Down") {
                continue
            }
            cards.push({ value, suit })
        }
    }

    return cards
}

export class GameStateFactory {
    private players: Player[];

    constructor() {
        this.players = []
    }

    addPlayer(player: Player) {
        this.players.push(player)
    }

    createGame(deck: Card[]): GameState {
        const players: PlayerUI[] = this.players.map((player) => {
            const hand = [deck.pop()!, deck.pop()!, deck.pop()!]
            const faceUpCards = [deck.pop()!, deck.pop()!, deck.pop()!]
            const faceDownCards = [deck.pop()!, deck.pop()!, deck.pop()!]

            return new PlayerUI({
                name: player.name,
                isMyself: player.isMyself,
                isCurrentPlaying: false,
                hand: hand.map((card) => new CardUI({ value: card.value, suit: card.suit, tablePosition: { x: 0, y: 0 } })),
                faceUpCards: faceUpCards.map((card) => new CardUI({ value: card.value, suit: card.suit, tablePosition: { x: 0, y: 0 } })),
                faceDownCards: faceDownCards.map((card) => new CardUI({ value: card.value, suit: card.suit, tablePosition: { x: 0, y: 0 } })),
                tablePosition: { x: 0, y: 0 }
            })
        })
        const upperCard = deck.pop()!

        return {
            players,
            discardPile: [new CardUI({ value: upperCard.value, suit: upperCard.suit, tablePosition: { x: 0, y: 0 } })],
            drawDeck: deck.map((card) => new CardUI({ value: card.value, suit: card.suit, tablePosition: { x: 0, y: 0 } }))
        }
    }
}