import { GameContext } from "@engine/context"
import { CardEffect } from "@engine/effects";
import { Card } from "@engine/models/card"

const mockApplyFn = jest.fn();

class MockEffect implements CardEffect {
    apply = mockApplyFn
}

const createMockContext = (): Partial<GameContext> => ({});


describe('Card', () => {
    let mockCtx: Partial<GameContext>;
    let cardWithEffect: Card;
    let cardWithoutEffect: Card;
    let mockEffect: CardEffect;

    beforeEach(() => {
        mockApplyFn.mockClear();
        mockCtx = createMockContext();
        mockEffect = new MockEffect()

        cardWithoutEffect = new Card("3")
        cardWithEffect = new Card("7", mockEffect)
    });

    test('Card without effect should return instantly and not apply effect', () => {
        cardWithoutEffect.applyEffect(mockCtx as GameContext)

        expect(mockApplyFn).not.toHaveBeenCalled();
    })

    test('Card with effect should apply effect and passes ctx as reference', () => {
        cardWithEffect.applyEffect(mockCtx as GameContext)

        expect(mockApplyFn).toHaveBeenCalledTimes(1)
        expect(mockApplyFn).toHaveBeenCalledWith(mockCtx);
    })
})