import { Card } from "@/engine/models/card";
import { Player } from "@/engine/models/player";
import { CARD_SUITS, CARD_VALUES, type CardValue } from "@/engine/constants";
import * as action from "@/engine/_actions/card";
import { GameController } from "..";
import { GameContext } from "@/engine/contexts/game";
import { TableContext } from "@/engine/contexts/table";
import { GameRuler } from "@/engine/_rulers/gameRuler";

export class GameFactory {
    private players: Player[];
    private valueActionMapping: Record<CardValue, action.CardAction> 

    constructor() {
        this.players = []
        this.valueActionMapping = {
            "2": new action.NullAction(),
            "3": new action.NullAction(),
            "4": new action.NullAction(),
            "5": new action.NullAction(),
            "6": new action.NullAction(),
            "7": new action.TogglePileOrderAction(),
            "8": new action.SkipAction(),
            "9": new action.NullAction(),
            "10": new action.BurnerAction(),
            "J": new action.InvertAction(),
            "Q": new action.NullAction(),
            "K": new action.NullAction(),
            "Joker": new action.PunishPlayerAction(),
        }
    }

    private spawnDeck(): Card[] {
        let cards: Card[] = []
        for (const suit of CARD_SUITS) {
            cards.concat(CARD_VALUES.map((value) => new Card(value, suit, this.valueActionMapping[value])))
        }

        return cards
    }

    private shuffle<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    addPlayer(name: string) {
        this.players.push(new Player(name, [], [], []))
    }

    setCardAction(value: CardValue, action: action.CardAction): void {
        this.valueActionMapping[value] = action
    }

    createGame(): GameController {
        if (this.players.length < 2) {
            throw new Error("Can't create game with less than two players")
        }

        const quantityOfDecks = Math.ceil(this.players.length / 4)
        const drawDeck = Array.from({ length: quantityOfDecks }, () => this.spawnDeck()).flat();
        this.shuffle(drawDeck)
        for (const player of this.players) {
            player.hand = [drawDeck.pop()!, drawDeck.pop()!, drawDeck.pop()!]
            player.faceUpCards = [drawDeck.pop()!, drawDeck.pop()!, drawDeck.pop()!]
            player.faceDownCards = [drawDeck.pop()!, drawDeck.pop()!, drawDeck.pop()!]
        }

        const index = drawDeck.findIndex(card => !(card.action == new action.NullAction()));
        if (index === -1) throw new Error("Deck has no cards with null actions");

        const discardPile = drawDeck.splice(index, 1);
        const table = new TableContext(drawDeck, discardPile)
        const ctx = new GameContext(
            table,
            this.players
        )
        const ruler = new GameRuler()
        return new GameController(ctx, ruler)
    }
}