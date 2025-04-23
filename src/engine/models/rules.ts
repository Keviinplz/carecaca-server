import { CardValue } from "@engine/constants";
import { Player } from "@engine/models/player";
import { Table } from "@engine/models/table";

export class GameRules {
    private wildCards: CardValue[];

    constructor(wildCards: CardValue[]) {
        this.wildCards = wildCards
    }

    canPlayerPlayFromHand(player: Player, table: Table): boolean {
        return player.hand.some((card) => this.isCardPlayable(card.value, table));
    }

    canPlayerPlayFromFaceUp(player: Player, table: Table): boolean {
        return player.hand.length === 0 && player.faceUpCards.some((card) => this.isCardPlayable(card.value, table));
    }

    canPlayerPlayFromFaceDown(player: Player, table: Table): boolean {
        return (player.hand.length === 0 && 
            player.faceUpCards.length === 0 && 
            player.faceDownCards.some((card) => this.isCardPlayable(card.value, table))
        );
    }

    isGameStillPlayable(players: ReadonlyArray<Player>): boolean {
        const playerWithCards = players.find((player) =>
            player.hand.length > 0 || player.faceUpCards.length > 0 || player.faceDownCards.length > 0
        );
        if (!playerWithCards) return false;

        // Check if any *other* player also has cards
        return players.some((player) =>
            player.name !== playerWithCards.name &&
            (player.hand.length > 0 || player.faceUpCards.length > 0 || player.faceDownCards.length > 0)
        );
    }

    isCardPlayable(cardValue: CardValue, table: Table): boolean {
        const topPileCard = table.getTopCard();
        if (topPileCard == null || this.wildCards.includes(cardValue)) return true;

        const cardRank = this.getCardRank(cardValue);
        const topPileCardRank = this.getCardRank(topPileCard.value);

        return table.isPileAscending ? cardRank >= topPileCardRank : cardRank <= topPileCardRank;
    }

    private getCardRank(value: CardValue): number {
        const rankOrder = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "Joker"];
        return rankOrder.indexOf(value);
    }

    applyPenalty(player: Player, table: Table): void {
        player.addCardsToHand(...table.discardPile)
        table.burn();
    }
}
