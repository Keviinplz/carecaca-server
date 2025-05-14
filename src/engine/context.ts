import { Player } from "@engine/models/player";
import { GamePhase } from "@engine/phases/base";
import { Table } from "@engine/models/table";
import { Turn } from "@engine/models/turn";
import { GameRules } from "@engine/models/rules";
import { CardValue } from "@engine/constants";
import { Phases } from "@engine/phases/registry";

export class GameContext {
    public table: Table;
    public turn: Turn;
    public players: ReadonlyArray<Player>
    public rules: GameRules;
    private phase: GamePhase;

    constructor(initialPhase: GamePhase, table: Table, turn: Turn, players: ReadonlyArray<Player>, rules: GameRules) {
        this.table = table;
        this.turn = turn;
        this.players = players;
        this.phase = initialPhase
        this.rules = rules
        this.transitionTo(initialPhase)
    }

    private transitionTo(phase: GamePhase): void {
        this.phase = phase;
    }

    public applyPenalty(player: Player): void {
        player.addCardsToHand(...this.table.discardPile)
        this.table.burn();
    }

    public completeTurn(): void {
        this.turn.next();
        this.toPlayerPlayabilityPhase();
    }

    public handlePlayerPlayability(): void {
        this.phase.handlePlayerPlayability(this);
    }

    public handlePlayedCard(cardValue: CardValue): void {
        this.phase.handlePlayedCard(this, cardValue);
    }

    public handlePlayFaceDownCard(): void {
        this.phase.handlePlayFaceDownCard(this);
    }

     public handleCardEffect(): void {
        this.phase.handleCardEffect(this);
    }

    public toPlayerPlayabilityPhase(): void {
        this.transitionTo(Phases.playerPlayability);
    }

    public toPlayingPhase(): void {
        this.transitionTo(Phases.playing)
    }

    public toCardEffectPhase(): void {
        this.transitionTo(Phases.cardEffect)
    }

    public toEndPhase(): void {
        this.transitionTo(Phases.end)
    }
}