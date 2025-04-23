import { Player } from "@/engine/models/player";
import { GamePhase } from "@/engine/phases/base";
import { Table } from "@/engine/models/table";
import { Turn } from "@/engine/models/turn";
import { GameRules } from "@/engine/models/rules";
import { CardValue } from "@/engine/constants";
import { Phases } from "@/engine/phases/registry";

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

    public transitionTo(phase: GamePhase): void {
        this.phase = phase;
    }

    public applyPenaltyAndCompleteTurn(player: Player): void {
        this.rules.applyPenalty(player, this.table);
    }

    public completeTurn(): void {
        this.turn.next();
        this.transitionTo(Phases.playerPlayability);
    }

    public handlePlayerPlayability(): void {
        this.phase.handlePlayerPlayability(this);
    }

    public handlePlayedCard(cardValue: CardValue): void {
        this.phase.handlePlayedCard(this, cardValue);
    }

    public handlePlayFaceDownCard(cardIndex: number): void {
        this.phase.handlePlayFaceDownCard(this, cardIndex);
    }

     public handleCardEffect(): void {
        this.phase.handleCardEffect(this);
    }
}