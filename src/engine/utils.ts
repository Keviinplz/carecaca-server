import { CardValue } from "@engine/constants"
import { Card } from "@engine/models/card"

export function findCardInStack(stack: Card[], targetCardValue: CardValue): Card | undefined {
    return stack.find((card) => card.value === targetCardValue);
}

export function removeCardFromStackByValue(stack: Card[], targetCardValue: CardValue): Card | undefined {
    const targetCardIndex = stack.findIndex((card) => card.value === targetCardValue);
    if (targetCardIndex === -1) {
        return undefined;
    }

    return stack.splice(targetCardIndex, 1)[0];
}

export function removeCardFromStackByIndex(stack: Card[], index: number): Card | undefined {
    if (index < 0 || index >= stack.length) {
        return undefined;
    }

    return stack.splice(index, 1)[0];
}


export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}