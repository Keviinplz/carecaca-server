import { type CardValue } from "@engine/constants"
import { GamePhase } from "@engine/phases/base"
import { GameContext } from "@engine/context";
import { Player } from "@engine/models/player";
import { Table } from "@engine/models/table";
import { Card } from "@engine/models/card";

export class PlayingPhase implements GamePhase {
    public handlePlayerPlayability(_ctx: GameContext): void { }

    public handlePlayedCard(ctx: GameContext, cardValue: CardValue): void {
        const currentPlayer = ctx.turn.getCurrentPlayer();
        const table = ctx.table;
        const rules = ctx.rules;

        const expectedSource = this.getExpectedPlaySource(currentPlayer)

        const { isHand } = expectedSource;

        const cardExists = isHand ? currentPlayer.hasCardInHand(cardValue) : currentPlayer.hasCardInFaceUp(cardValue);
        
        if (!cardExists) {
            ctx.applyPenalty(currentPlayer)
            ctx.completeTurn()
            return;
        }

        const isCardPlayable = rules.isCardPlayable(cardValue, table);

        if (!(isCardPlayable)) {
            ctx.applyPenalty(currentPlayer)
            ctx.completeTurn()
            return;
        }

        this.executePlay(ctx, currentPlayer, cardValue, isHand);
    }

    public handlePlayFaceDownCard(ctx: GameContext): void {
        const currentPlayer = ctx.turn.getCurrentPlayer();
        const table = ctx.table;
        const rules = ctx.rules;

        const playerHasCardsToPlay = currentPlayer.hand.length > 0 || currentPlayer.faceUpCards.length > 0;

        if (playerHasCardsToPlay) {
            ctx.applyPenalty(currentPlayer)
            return ctx.completeTurn()
        }

        const cardToPlay = currentPlayer.removeFaceDownCard();

        if (!cardToPlay) return ctx.completeTurn();

        if (!rules.isCardPlayable(cardToPlay.value, table)) {
            ctx.applyPenalty(currentPlayer);
            currentPlayer.addCardsToHand(cardToPlay);
            return ctx.completeTurn()
        }
        
        table.discardPile.push(cardToPlay);
        return ctx.toCardEffectPhase();
    }

    private getExpectedPlaySource(player: Player): { sourceStack: Card[], isHand: boolean } {
        if (player.hand.length > 0) {
            return { sourceStack: player.hand, isHand: true };
        }

        return { sourceStack: player.faceUpCards, isHand: false }; 
    }

    private executePlay(ctx: GameContext, player: Player, cardValue: CardValue, playedFromHand: boolean) {
        const cardToPlay = playedFromHand
            ? player.removeCardFromHand(cardValue)!
            : player.removeCardFromFaceUp(cardValue)!;

        ctx.table.discardPile.push(cardToPlay);

        if (playedFromHand) this.refillPlayerHand(player, ctx.table);

        ctx.toCardEffectPhase();
    }

    private refillPlayerHand(player: Player, table: Table): void {
        while (player.hand.length < 3 && table.drawDeck.length > 0) {
            player.addCardsToHand(table.draw()!);
        }
    }


    public handleCardEffect(_ctx: GameContext): void { }
}