import { GameContext } from "@engine/context";
import { Card } from "@engine/models/card";
import { Table } from "@engine/models/table";
import { Turn } from "@engine/models/turn";
import { CardEffectPhase } from "@engine/phases/cardEffect";

const mockCardApplyEffectWithEffect = jest.fn();
const mockCardApplyEffectWithoutEffect = jest.fn();

const createMockCard = ({ hasEffect }: { hasEffect: boolean }): Partial<Card> => ({
    applyEffect: hasEffect ? mockCardApplyEffectWithEffect : mockCardApplyEffectWithoutEffect,
    value: hasEffect ? "A" : "2",
});


const mockCompleteTurn = jest.fn();
const mockGetTopCard = jest.fn();

const createMockContext = (): Partial<GameContext> => ({
    table: {
        getTopCard: mockGetTopCard,
    } as Partial<Table> as Table,
    turn: {} as Partial<Turn> as Turn,
    completeTurn: mockCompleteTurn,
});


describe('CardEffectPhase', () => {
    let cardEffectPhase: CardEffectPhase;
    let mockCtx: Partial<GameContext>;
    let mockCardWithEffect: Partial<Card>;
    let mockCardWithoutEffect: Partial<Card>;


    beforeEach(() => {
        mockCardApplyEffectWithEffect.mockClear();
        mockCardApplyEffectWithoutEffect.mockClear();
        mockCompleteTurn.mockClear();
        mockGetTopCard.mockClear();

        cardEffectPhase = new CardEffectPhase();
        mockCtx = createMockContext();
        mockCardWithEffect = createMockCard({ hasEffect: true });
        mockCardWithoutEffect = createMockCard({ hasEffect: false });
    });

    test('should get top card, call its applyEffect, and complete turn if card exists (with effect)', () => {
        mockGetTopCard.mockReturnValue(mockCardWithEffect);

        cardEffectPhase.handleCardEffect(mockCtx as GameContext);

        expect(mockGetTopCard).toHaveBeenCalledTimes(1);
        expect(mockCardApplyEffectWithEffect).toHaveBeenCalledTimes(1);
        expect(mockCardApplyEffectWithEffect).toHaveBeenCalledWith(mockCtx);
        expect(mockCompleteTurn).toHaveBeenCalledTimes(1);
    });

    test('should get top card, call its applyEffect, and complete turn if card exists (without effect)', () => {
        mockGetTopCard.mockReturnValue(mockCardWithoutEffect);

        cardEffectPhase.handleCardEffect(mockCtx as GameContext);

        expect(mockGetTopCard).toHaveBeenCalledTimes(1);
        expect(mockCardApplyEffectWithoutEffect).toHaveBeenCalledTimes(1);
        expect(mockCardApplyEffectWithoutEffect).toHaveBeenCalledWith(mockCtx);
        expect(mockCompleteTurn).toHaveBeenCalledTimes(1);
    });


    test('should get top card, NOT call applyEffect, and complete turn if discard pile is empty', () => {
        mockGetTopCard.mockReturnValue(null);

        cardEffectPhase.handleCardEffect(mockCtx as GameContext);

        expect(mockGetTopCard).toHaveBeenCalledTimes(1);
        expect(mockCardApplyEffectWithEffect).not.toHaveBeenCalled();
        expect(mockCardApplyEffectWithoutEffect).not.toHaveBeenCalled();
        expect(mockCompleteTurn).toHaveBeenCalledTimes(1);
    });

     test('handlePlayerPlayability should do nothing', () => {
         cardEffectPhase.handlePlayerPlayability(mockCtx as GameContext);
         expect(mockCompleteTurn).not.toHaveBeenCalled();
    });

    test('handlePlayedCard should do nothing', () => {
         cardEffectPhase.handlePlayedCard(mockCtx as GameContext, "A");
         expect(mockCompleteTurn).not.toHaveBeenCalled();
    });

     test('handlePlayFaceDownCard should do nothing', () => {
         cardEffectPhase.handlePlayFaceDownCard(mockCtx as GameContext, 0);
         expect(mockCompleteTurn).not.toHaveBeenCalled();
    });
});
