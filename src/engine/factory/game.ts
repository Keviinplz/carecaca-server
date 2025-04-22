import { Card } from "@/engine/models/card";
import { Player } from "@/engine/models/player";
import { CARD_VALUES, type CardValue } from "@/engine/constants";
import * as effect from "@/engine/effects";
import * as utils from "@/engine/utils";
import { GameContext } from "@/engine/context";
import { Table } from "../models/table";
import { PlayerPlayabilityPhase } from "../phases/playerPlayability";
import { Turn } from "../models/turn";

export class GameFactory {
    private players: Player[];
    private valueEffectMapping: Partial<Record<CardValue, effect.CardEffect>>

    constructor() {
        this.players = []
        this.valueEffectMapping = {
            "7": new effect.TogglePileOrderEffect(),
            "8": new effect.SkipEffect(),
            "10": new effect.BurnerEffect(),
            "J": new effect.InvertEffect(),
            "Joker": new effect.PunishPlayerEffect(),
        }
    }

    private spawnDeck(): Card[] {
        return CARD_VALUES.map(
            (value) => {
                const effect = this.valueEffectMapping[value]
                if (!effect)
                    return new Card(value, null)

                return new Card(value, effect)
            }
        )
    }

    addPlayer(name: string) {
        this.players.push(new Player(name, [], [], []))
    }

    setCardEffect(value: CardValue, effect: effect.CardEffect): void {
        this.valueEffectMapping[value] = effect
    }

    createGame(): GameContext {
        if (this.players.length < 2) {
            throw new Error("Can't create game with less than two players")
        }

        const quantityOfDecks = Math.ceil(this.players.length / 4)
        const drawDeck = Array.from({ length: quantityOfDecks }, () => this.spawnDeck()).flat();
        utils.shuffle(drawDeck)
        for (const player of this.players) {
            player.hand = [drawDeck.pop()!, drawDeck.pop()!, drawDeck.pop()!]
            player.faceUpCards = [drawDeck.pop()!, drawDeck.pop()!, drawDeck.pop()!]
            player.faceDownCards = [drawDeck.pop()!, drawDeck.pop()!, drawDeck.pop()!]
        }

        const index = drawDeck.findIndex(card => !Object.keys(this.valueEffectMapping).includes(card.value));
        if (index === -1) throw new Error("Deck has no cards with null actions");

        const discardPile = drawDeck.splice(index, 1);
        
        const table = new Table(discardPile, drawDeck, true)
        const turn = new Turn(this.players, 0, true) 
        return new GameContext(new PlayerPlayabilityPhase(), table, turn, this.players)
    }
}