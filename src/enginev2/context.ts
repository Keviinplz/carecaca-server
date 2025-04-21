import { type CardValue } from "@/engine/constants";
import { Card } from "./models/card";
import { Player } from "./models/player";
import { GamePhase } from "./phases/base";

export type GameState = {
    table: {
        discardPile: Card[],
        drawDeck: Card[]
        isPileAscending: boolean
    }
    players: Player[],
    turn: {
        isClockwise: boolean,
        currentIndex: number
    }
}

export class GameContext {

    private phase: GamePhase;
    private wildCards: CardValue[];
    public state: GameState;

    constructor(initialState: GameState, initialPhase: GamePhase) {
        this.state = initialState
        this.phase = initialPhase
        this.wildCards = ["2", "10", "Joker"]
        this.phase.setContext(this);
    }

    public gameStillPlayable(): boolean {
        const { players } = this.state
        const playerWithCards = players.find((player) => player.hand || player.faceUpCards || player.faceDownCards)
        if (!playerWithCards) return false

        const others = players.filter((player) => player.name !== playerWithCards.name)
        if (others.some((other) => other.hand || other.faceUpCards || other.faceDownCards)) return true

        return false
    }

    public cardIsPlayable(cardValue: CardValue): boolean {
        const { table } = this.state
        const topPileCard = this.getTopCard()
        if (topPileCard == null || this.wildCards.includes(cardValue)) return true;

        return table.isPileAscending ? cardValue >= topPileCard.value : cardValue <= topPileCard.value

    }

    public invertPileOrder() {
        const { table } = this.state
        table.isPileAscending = !table.isPileAscending
    }

    public getTopCard(): Card | null {
        const { table } = this.state
        return table.discardPile[table.discardPile.length - 1]
    }

    public burn() {
        const { table } = this.state
        table.discardPile = [];
    }

    public getCurrentPlayer(): Player {
        const { turn } = this.state
        return this.state.players[turn.currentIndex];
    }

    public getNextPlayer(): Player {
        const { players, turn } = this.state
        let step = turn.isClockwise ? 1 : -1;
        const nextIndex = (turn.currentIndex + step + players.length) % players.length;
        return players[nextIndex];
    }

    public nextTurn() {
        const { players, turn } = this.state
        let step = turn.isClockwise ? 1 : -1;
        turn.currentIndex = (turn.currentIndex + step + players.length) % players.length;
    }

    public reverseTurnOrder() {
        const { turn } = this.state
        turn.isClockwise = !turn.isClockwise;
    }

    public skipNextPlayer() {
        const { players, turn } = this.state
        let step = turn.isClockwise ? 2 : -2;
        turn.currentIndex = (turn.currentIndex + step + players.length) % players.length;
    }

    public penaltyPlayer(player: Player): void {
        const { table } = this.state
        player.hand = [...player.hand, ...table.discardPile]
        this.burn()
    }

    public getCardFromStack(stack: Card[], targetCardValue: CardValue, removeFromStack: boolean = true): Card | null {
        let targetCardIndex = stack.findIndex((card) => card.value === targetCardValue)
        if (targetCardIndex === -1) return null

        if (!removeFromStack) {
            return stack[targetCardIndex]
        }

        return stack.splice(targetCardIndex, 1)[0]
    }

    public getPlayerCard(player: Player, cardValue: CardValue, removeFromPlayer: boolean = true): Card | null {
        let targetCard: Card | null;
        if (player.hand) {
            targetCard = this.getCardFromStack(player.hand, cardValue, removeFromPlayer)
            if (targetCard) return targetCard;
        }

        if (player.faceUpCards) {
            targetCard = this.getCardFromStack(player.faceUpCards, cardValue, removeFromPlayer)
            if (targetCard) return targetCard;
        }

        if (player.faceDownCards) {
            targetCard = this.getCardFromStack(player.faceDownCards, cardValue, removeFromPlayer)
            if (targetCard) return targetCard;
        }

        return null;

    }

    public playerHasCardValue(player: Player, cardValue: CardValue): boolean {
        return this.getPlayerCard(player, cardValue, false) !== null;
    }

    public playCardValue(player: Player, cardValue: CardValue): void {
        const card = this.getPlayerCard(player, cardValue, true)!
        const { table } = this.state
        table.discardPile.push(card)

        if (!table.drawDeck) return

        while (player.hand.length < 3 && table.drawDeck.length > 0) {
            const card = table.drawDeck.pop()
            if (card) {
                player.hand.push(card);
            }
        }

    }

    public transitionTo(phase: GamePhase): void {
        this.phase = phase;
        this.phase.setContext(this);
    }
}