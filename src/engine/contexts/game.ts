import { TurnContext } from "./turn";
import { TableContext } from "./table";
import { Player } from "@/engine/models/player";

export class GameContext {
    public table: TableContext
    public turn: TurnContext;
    public players: Player[]

    constructor(table: TableContext, players: Player[]) {
        this.table = table;
        this.players = players;
        this.turn = new TurnContext(players);
    }
}