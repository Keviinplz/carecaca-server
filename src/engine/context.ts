import { type CardValue } from "@/engine/constants";
import { Player } from "@/engine/models/player";
import { GamePhase } from "@/engine/phases/base";
import { Table } from "@/engine/models/table";
import { Turn } from "@/engine/models/turn";

export class GameContext {
    public table: Table;
    public turn: Turn;
    public players: ReadonlyArray<Player>
    private phase: GamePhase;
    private wildCards: CardValue[];

    constructor(initialPhase: GamePhase, table: Table, turn: Turn, players: ReadonlyArray<Player>) {
        this.table = table;
        this.turn = turn;
        this.players = players;
        this.phase = initialPhase
        this.wildCards = ["2", "10", "Joker"]
        this.transitionTo(initialPhase)
    }

    public gameStillPlayable(): boolean {
        const playerWithCards = this.players.find((player) => player.hand || player.faceUpCards || player.faceDownCards)
        if (!playerWithCards) return false

        const others = this.players.filter((player) => player.name !== playerWithCards.name)
        if (others.some((other) => other.hand || other.faceUpCards || other.faceDownCards)) return true

        return false
    }

    public cardIsPlayable(cardValue: CardValue): boolean {
        const topPileCard = this.table.getTopCard()
        if (topPileCard == null || this.wildCards.includes(cardValue)) return true;

        return this.table.isPileAscending ? cardValue >= topPileCard.value : cardValue <= topPileCard.value

    }

    public penaltyPlayer(player: Player): void {
        player.hand = [...player.hand, ...this.table.discardPile]
        this.table.burn()
    }

    public playCardValue(player: Player, cardValue: CardValue): void {
        const card = player.getCard(cardValue, true)!
        this.table.discardPile.push(card)

        if (!this.table.drawDeck) return

        while (player.hand.length < 3 && this.table.drawDeck.length > 0) {
            const card = this.table.drawDeck.pop()
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