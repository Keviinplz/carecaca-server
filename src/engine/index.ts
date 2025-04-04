import { Player } from "@/engine/models/player";
import { GameContext } from "@/engine/contexts/game";
import { Card } from "@/engine/models/card";
import { GameRuler } from "@/engine/rulers/gameRuler";

export class GameController {
    public ctx: GameContext;
    public ruler: GameRuler;


    constructor(ctx: GameContext, ruler: GameRuler) {
        this.ctx = ctx;
        this.ruler = ruler
    }

    public startTurn() {
        const player = this.ctx.turn.getCurrentPlayer()
        if (!this.ruler.playerCanPlay(this.ctx, player)) {
            this.punishPlayer(player)
            return;
        }
    }

    public punishPlayer(player: Player) {
        const discardPile = this.ctx.table.discardPile
        player.addCards(...discardPile)
        this.ctx.table.burn()
    }

    public refillHand(player: Player) {
        if (this.ctx.table.getDeckLength() == 0) return;

        while (player.hand.length < 3 && this.ctx.table.getDeckLength() > 0) {
            const card = this.ctx.table.draw();
            if (card) {
                player.hand.push(card);
            }
        }
    }

    public endTurn(player: Player, card: Card) {
        if (!this.ruler.cardIsPlayable(card, this.ctx)) {
            this.punishPlayer(player)
            this.refillHand(player)
            return
        }
        this.ctx.table.addToPile(card)
        this.ruler.applyCardAction(card, this.ctx);
        this.refillHand(player)
        
        if (this.ruler.playerWins(player)) {
            this.ctx.turn.removePlayer(player)
        }
    }
}