import { Player } from "@engine/models/player";

export class Turn {
    private players: ReadonlyArray<Player>;
    private currentIndex: number;
    private isClockwise: boolean;

    constructor(
        players: ReadonlyArray<Player>,
        initialIndex: number = 0,
        initialDirection: boolean = true
    ) {
        if (players.length <= 1) {
            throw new Error("At least two players required.");
        }
        this.currentIndex = Math.max(0, Math.min(initialIndex, players.length - 1));
        this.isClockwise = initialDirection;
        this.players = players;
    }

    public next(): void {
        const playerCount = this.players.length;

        if (this.isClockwise) {
            this.currentIndex = (this.currentIndex + 1) % playerCount;
        } else {
            this.currentIndex = (this.currentIndex - 1 + playerCount) % playerCount;
        }
    }

    public getCurrentPlayer(): Player {
        return this.players[this.currentIndex];
    }

    public getNextPlayerIndex(): number {
        const playerCount = this.players.length;

        let nextIndex: number;
        if (this.isClockwise) {
            nextIndex = (this.currentIndex + 1) % playerCount;
        } else {
            nextIndex = (this.currentIndex - 1 + playerCount) % playerCount;
        }
        return nextIndex;
    }


    public getNextPlayer(): Player {
        const nextIndex = this.getNextPlayerIndex();
        return this.players[nextIndex];
    }

    public getCurrentIndex(): number {
        return this.currentIndex;
    }


    public reverseDirection(): void {
        this.isClockwise = !this.isClockwise;
    }

    public getDirection(): boolean {
        return this.isClockwise;
     }

}