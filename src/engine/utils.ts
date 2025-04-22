import { CardValue } from "@/engine/constants"
import { Card } from "@/engine/models/card"

export function getCardFromStack(stack: Card[], targetCardValue: CardValue, removeFromStack: boolean = true): Card | null {
    let targetCardIndex = stack.findIndex((card) => card.value === targetCardValue)
    if (targetCardIndex === -1) return null

    if (!removeFromStack) {
        return stack[targetCardIndex]
    }

    return stack.splice(targetCardIndex, 1)[0]
}

export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}