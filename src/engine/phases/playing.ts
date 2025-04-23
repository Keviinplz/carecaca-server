import { type CardValue } from "@/engine/constants"
import { GamePhase } from "@/engine/phases/base"
import { GameContext } from "@/engine/context";
import { Phases } from "@/engine/phases/registry";
import { Player } from "@/engine/models/player";
import { Table } from "@/engine/models/table";
import { Card } from "@/engine/models/card";

export class PlayingPhase implements GamePhase {
    public handlePlayerPlayability(_ctx: GameContext): void { }

    public handlePlayedCard(ctx: GameContext, cardValue: CardValue): void {
        const currentPlayer = ctx.turn.getCurrentPlayer();
        const table = ctx.table;
        const rules = ctx.rules;

        const expectedSource = this.getExpectedPlaySource(currentPlayer)
        if (!expectedSource) {
            ctx.applyPenalty(currentPlayer)
            ctx.completeTurn()
            return;
        }

        const { isHand } = expectedSource;

        const cardExists = isHand ? currentPlayer.hasCardInHand(cardValue) : currentPlayer.hasCardInFaceUp(cardValue);
        const isCardPlayable = rules.isCardPlayable(cardValue, table);

        if (!(cardExists && isCardPlayable)) {
            ctx.applyPenalty(currentPlayer)
            ctx.completeTurn()
            return;
        }

        this.executePlay(ctx, currentPlayer, cardValue, isHand);
    }

    public handlePlayFaceDownCard(ctx: GameContext, cardIndex: number): void {
        const currentPlayer = ctx.turn.getCurrentPlayer();
        const table = ctx.table;
        const rules = ctx.rules;

        const playerHasCardsToPlay = currentPlayer.hand.length > 0 || currentPlayer.faceUpCards.length > 0;
        const cardIndexOutOfBound = cardIndex < 0 || cardIndex >= currentPlayer.faceDownCards.length;

        if (playerHasCardsToPlay || cardIndexOutOfBound) {
            ctx.applyPenalty(currentPlayer)
            ctx.completeTurn()
            return;
        }

        const cardToPlay = currentPlayer.removeFaceDownCardByIndex(cardIndex)!;

        if (rules.isCardPlayable(cardToPlay.value, table)) {
            table.discardPile.push(cardToPlay);
            return ctx.transitionTo(Phases.cardEffect);
        }

        rules.applyPenalty(currentPlayer, table);
        currentPlayer.addCardsToHand(cardToPlay);
        ctx.completeTurn()
    }

    private getExpectedPlaySource(player: Player): { sourceStack: Card[], isHand: boolean } | null {
        if (player.hand.length > 0) {
            return { sourceStack: player.hand, isHand: true };
        }
        if (player.faceUpCards.length > 0) {
            return { sourceStack: player.faceUpCards, isHand: false };
        }
        return null;
    }

    private executePlay(ctx: GameContext, player: Player, cardValue: CardValue, playedFromHand: boolean) {
        const cardToPlay = playedFromHand
            ? player.removeCardFromHand(cardValue)!
            : player.removeCardFromFaceUp(cardValue)!;

        ctx.table.discardPile.push(cardToPlay);

        if (playedFromHand) this.refillPlayerHand(player, ctx.table);

        ctx.transitionTo(Phases.cardEffect);
    }

    private refillPlayerHand(player: Player, table: Table): void {
        while (player.hand.length < 3 && table.drawDeck.length > 0) {
            player.addCardsToHand(table.drawDeck.pop()!);
        }
    }


    public handleCardEffect(_ctx: GameContext): void { }
}