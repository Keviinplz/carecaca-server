import { CARD_VALUES, type CardValue } from "@/engine/constants";
import { GameContext } from "@/engine/contexts/game";
import { Card } from "@/engine/models/card";
import { Player } from "@/engine/models/player";

export class GameRuler {
    readonly ALWAYS_PLAYABLE: CardValue[] = ["2", "10", "Joker"]

    private existsPlayableCard(topCard: Card, cards: Card[], isPileAscending: boolean): boolean {
        if (cards.find((card) => this.ALWAYS_PLAYABLE.includes(card.value))) return true;
        

        const topCardIndex = CARD_VALUES.findIndex((el) => el === topCard.value);
        const cardIndexes = cards.map((card) => CARD_VALUES.findIndex((el) => el === card.value))

        const comparisonOp = (top: number, given: number) => isPileAscending ? top <= given : top >= given

        if (cardIndexes.map((index) => comparisonOp(topCardIndex, index)).every((value) => value === false)) return false;

        return true
    }

    public playerWins(player: Player): boolean {
        return (player.hand.length === player.faceUpCards.length) === (player.faceDownCards.length === 0);
    }

    public playerCanPlay(ctx: GameContext, player: Player): boolean {
        const card = ctx.table.viewTopCard()
        if (!card) return true;

        if (player.hand.length !== 0 && !this.existsPlayableCard(card, player.hand, ctx.table.isPileAscending)) return false;
        if (player.faceUpCards.length !== 0 && !this.existsPlayableCard(card, player.faceUpCards, ctx.table.isPileAscending)) return false;

        return true;
    }

    public applyCardAction(card: Card, ctx: GameContext): void {
        return card.action.apply(ctx)
    }

    public cardIsPlayable(card: Card, ctx: GameContext): boolean {
        if (this.ALWAYS_PLAYABLE.includes(card.value)) return true;

        const topCard = ctx.table.viewTopCard()
        if (!topCard) return true;

        const topCardIndex = CARD_VALUES.findIndex((el) => el === topCard.value);
        const cardIndex = CARD_VALUES.findIndex((el) => el === card.value)

        return ctx.table.isPileAscending ? topCardIndex <= cardIndex : topCardIndex >= cardIndex
    }
}