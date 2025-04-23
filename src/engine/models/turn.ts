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
        if (players.length === 0) {
            throw new Error("At least one player required.");
        }
        this.currentIndex = Math.max(0, Math.min(initialIndex, players.length - 1));
        this.isClockwise = initialDirection;
        this.players = players;
    }

    public next(): void {
        const playerCount = this.players.length;
        if (playerCount <= 1) {
            return;
        }

        if (this.isClockwise) {
            this.currentIndex = (this.currentIndex + 1) % playerCount;
        } else {
            this.currentIndex = (this.currentIndex - 1 + playerCount) % playerCount;
        }
    }

    public getCurrentPlayer(): Player {
         if (!this.players[this.currentIndex]) {
             throw new Error(
                `currentIndex overflow, currentIndex=${this.currentIndex} playersLength=${this.players.length}`
            );
         }
        return this.players[this.currentIndex];
    }

    public getNextPlayerIndex(): number {
        const playerCount = this.players.length;

        if (playerCount <= 1) {
            return this.currentIndex;
        }

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
        const nextPlayer = this.players[nextIndex];

        if (!nextPlayer) {
            throw new Error(
                `nextIndex overflow, nextIndex=${nextIndex} playersLength=${this.players.length}`
            );
         }
        return nextPlayer;
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