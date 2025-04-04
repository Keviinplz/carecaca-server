import { Player } from "@/engine/models/player";

export class TurnContext {
    private players: Player[];
    private currentIndex: number;
    private isClockwise: boolean;

    constructor(players: Player[]) {
        this.players = players;
        this.currentIndex = 0;
        this.isClockwise = true;
    }

    public getCurrentPlayer(): Player {
        return this.players[this.currentIndex];
    }

    public getNextPlayer(): Player {
        let step = this.isClockwise ? 1 : -1;
        const nextIndex = (this.currentIndex + step + this.players.length) % this.players.length;
        return this.players[nextIndex];
    }

    public nextTurn() {
        let step = this.isClockwise ? 1 : -1;
        this.currentIndex = (this.currentIndex + step + this.players.length) % this.players.length;
    }

    public reverseTurnOrder() {
        this.isClockwise = !this.isClockwise;
    }

    public skipNextPlayer() {
        let step = this.isClockwise ? 2 : -2;
        this.currentIndex = (this.currentIndex + step + this.players.length) % this.players.length;
    }

    public removePlayer(player: Player) {
        const index = this.players.indexOf(player);
        if (index !== -1) {
            this.players.splice(index, 1);
            if (this.currentIndex >= index) {
                this.currentIndex--;
            }
        }
    }
}