import { type CardValue } from "@/engine/constants";
import { GamePhase } from "@/engine/phases/base";

export class EndPhase extends GamePhase {
    public name: string = "EndPhase";

    public handlePlayerPlayability(): void { }
    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void { }
}