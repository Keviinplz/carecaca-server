import { Card } from '@engine/models/card'
import * as utils from "@engine/utils"

describe('findCardInStack', () => {
    const stack = [new Card('3'), new Card('4')]
    
    test('Should return Card if cardValue is in stack', () => {
        const choosedCard = stack[0] 
        expect(utils.findCardInStack(stack, choosedCard.value)).toStrictEqual(choosedCard)
    })

    test('Should return undefined if a card cannot be found on stack', () => {
        expect(utils.findCardInStack(stack, '5')).toBeUndefined()
    })
})

describe('removeCardFromStackByValue', () => {
    const stack = [new Card('3'), new Card('4')]

    test('Should remove card from stack if exists', () => {
        const choosedCard = stack[0]
        expect(utils.removeCardFromStackByValue(stack, choosedCard.value)).toStrictEqual(choosedCard)
        expect(stack).not.toContain(choosedCard)
    })

    test('Should return undefined if card is not in stack', () => {
        expect(utils.removeCardFromStackByValue(stack, '5')).toBeUndefined()
    })
})

describe('removeCardFromStackByIndex', () => {
    const stack = [new Card('3'), new Card('4')]

    test('Should remove card from stack if exists using index', () => {
        const choosedCard = stack[0]
        const chooseCardIndex = stack.indexOf(choosedCard)
        expect(utils.removeCardFromStackByIndex(stack, chooseCardIndex)).toStrictEqual(choosedCard)
        expect(stack).not.toContain(choosedCard)
    })

    test('Should return undefined if index is outbound', () => {
        expect(utils.removeCardFromStackByIndex(stack, 2)).toBeUndefined()
    })
})

describe('shuffle', () => {
    beforeEach(() => {
        jest.spyOn(global.Math, 'random').mockReturnValue(0.1);
    });
    
    afterEach(() => {
        jest.spyOn(global.Math, 'random').mockRestore();
    })

    const stack = [new Card('3'), new Card('4'), new Card('5')]
    test ('Should shuffle stack returning a new array, without altering the original', () => {
        const stackCopy = [...stack]
        const shuffledStack = utils.shuffle(stack)
        expect(stack).toEqual(stackCopy)
        expect(shuffledStack).not.toEqual(stack)
    })
})