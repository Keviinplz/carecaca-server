import { type CardValue } from "@/engine/constants";
import { GamePhase } from "./base";

export class EndPhase extends GamePhase {
    public handlePlayerPlayability(): void { }
    public handlePlayedCard(cardValue: CardValue): void { }
    public handleCardEffect(): void { }
}