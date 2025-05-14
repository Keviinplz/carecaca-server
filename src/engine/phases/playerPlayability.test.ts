import { GameContext } from "@engine/context";
import { Table } from "@engine/models/table";
import { Turn } from "@engine/models/turn";
import { PlayerPlayabilityPhase } from "@engine/phases/playerPlayability";
import { GameRules } from "@engine/models/rules";
import { Player } from "@engine/models/player";

const mockIsGameStillPlayable = jest.fn();
const mockCanPlayerPlayFromHand = jest.fn();
const mockCanPlayerPlayFromFaceUp = jest.fn();
const mockCanPlayerPlayFromFaceDown = jest.fn();

const mockGetCurrentPlayer = jest.fn();
const mockCompleteTurn = jest.fn();
const mockToPlayingPhase = jest.fn();
const mockToEndPhase = jest.fn()
const mockApplyPenalty = jest.fn();

const mockPlayerWon = jest.fn();
const createMockPlayer = (): Partial<Player> => ({
    won: mockPlayerWon,
    name: 'MockPlayer',
    hand: [],
    faceUpCards: [],
    faceDownCards: [],
});

const createMockContext = (): Partial<GameContext> => ({
    table: {} as Table,
    turn: {
        getCurrentPlayer: mockGetCurrentPlayer,
    } as Partial<Turn> as Turn,
    players: [],
    rules: {
        isGameStillPlayable: mockIsGameStillPlayable,
        canPlayerPlayFromHand: mockCanPlayerPlayFromHand,
        canPlayerPlayFromFaceUp: mockCanPlayerPlayFromFaceUp,
        canPlayerPlayFromFaceDown: mockCanPlayerPlayFromFaceDown,
    } as Partial<GameRules> as GameRules,
    completeTurn: mockCompleteTurn,
    toPlayingPhase: mockToPlayingPhase,
    toEndPhase: mockToEndPhase,
    applyPenalty: mockApplyPenalty,
});

describe('PlayerPlayabilityPhase', () => {
    let playerPlayabilityPhase: PlayerPlayabilityPhase;
    let mockCtx: Partial<GameContext>;
    let mockPlayer: Partial<Player>;

    beforeEach(() => {
        jest.clearAllMocks();

        playerPlayabilityPhase = new PlayerPlayabilityPhase();
        mockCtx = createMockContext();
        mockPlayer = createMockPlayer();

        mockIsGameStillPlayable.mockReturnValue(true);
        mockPlayerWon.mockReturnValue(false);
        mockGetCurrentPlayer.mockReturnValue(mockPlayer);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Should transition to EndPhase if game is not playable', () => {
        mockIsGameStillPlayable.mockReturnValue(false);

        playerPlayabilityPhase.handlePlayerPlayability(mockCtx as GameContext);

        expect(mockIsGameStillPlayable).toHaveBeenCalledTimes(1);
        expect(mockToEndPhase).toHaveBeenCalledTimes(1);

        expect(mockGetCurrentPlayer).not.toHaveBeenCalled();
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

    test('Should complete turn if current player has won', () => {
        mockPlayerWon.mockReturnValue(true);

        playerPlayabilityPhase.handlePlayerPlayability(mockCtx as GameContext);

        expect(mockIsGameStillPlayable).toHaveBeenCalledTimes(1);
        expect(mockGetCurrentPlayer).toHaveBeenCalledTimes(1);
        expect(mockPlayerWon).toHaveBeenCalledTimes(1);
        expect(mockCompleteTurn).toHaveBeenCalledTimes(1);

        expect(mockToEndPhase).not.toHaveBeenCalled();
        expect(mockToPlayingPhase).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

    test('Should transition to PlayingPhase if player can play from hand', () => {
        mockCanPlayerPlayFromHand.mockReturnValue(true);
        mockCanPlayerPlayFromFaceUp.mockReturnValue(false);
        mockCanPlayerPlayFromFaceDown.mockReturnValue(false);

        playerPlayabilityPhase.handlePlayerPlayability(mockCtx as GameContext);

        expect(mockIsGameStillPlayable).toHaveBeenCalledTimes(1);
        expect(mockGetCurrentPlayer).toHaveBeenCalledTimes(1);
        expect(mockPlayerWon).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromHand).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceUp).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceDown).toHaveBeenCalledTimes(1);
        expect(mockToPlayingPhase).toHaveBeenCalledTimes(1);
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

     test('Should transition to PlayingPhase if player can play from face up (but not hand)', () => {
        mockCanPlayerPlayFromHand.mockReturnValue(false);
        mockCanPlayerPlayFromFaceUp.mockReturnValue(true);
        mockCanPlayerPlayFromFaceDown.mockReturnValue(false);

        playerPlayabilityPhase.handlePlayerPlayability(mockCtx as GameContext);

        expect(mockIsGameStillPlayable).toHaveBeenCalledTimes(1);
        expect(mockGetCurrentPlayer).toHaveBeenCalledTimes(1);
        expect(mockPlayerWon).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromHand).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceUp).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceDown).toHaveBeenCalledTimes(1);
        expect(mockToPlayingPhase).toHaveBeenCalledTimes(1);
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

     test('Should transition to PlayingPhase if player can play from face down (but not hand or face up)', () => {
        mockCanPlayerPlayFromHand.mockReturnValue(false);
        mockCanPlayerPlayFromFaceUp.mockReturnValue(false);
        mockCanPlayerPlayFromFaceDown.mockReturnValue(true);

        playerPlayabilityPhase.handlePlayerPlayability(mockCtx as GameContext);

        expect(mockIsGameStillPlayable).toHaveBeenCalledTimes(1);
        expect(mockGetCurrentPlayer).toHaveBeenCalledTimes(1);
        expect(mockPlayerWon).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromHand).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceUp).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceDown).toHaveBeenCalledTimes(1);
        expect(mockToPlayingPhase).toHaveBeenCalledTimes(1);
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

    test('Should apply penalty and complete turn if player cannot play from any source', () => {
        mockCanPlayerPlayFromHand.mockReturnValue(false);
        mockCanPlayerPlayFromFaceUp.mockReturnValue(false);
        mockCanPlayerPlayFromFaceDown.mockReturnValue(false);

        playerPlayabilityPhase.handlePlayerPlayability(mockCtx as GameContext);

        expect(mockIsGameStillPlayable).toHaveBeenCalledTimes(1);
        expect(mockGetCurrentPlayer).toHaveBeenCalledTimes(1);
        expect(mockPlayerWon).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromHand).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceUp).toHaveBeenCalledTimes(1);
        expect(mockCanPlayerPlayFromFaceDown).toHaveBeenCalledTimes(1);
        expect(mockApplyPenalty).toHaveBeenCalledTimes(1);
        expect(mockApplyPenalty).toHaveBeenCalledWith(mockPlayer);
        expect(mockCompleteTurn).toHaveBeenCalledTimes(1);

        expect(mockToEndPhase).not.toHaveBeenCalled();
        expect(mockToPlayingPhase).not.toHaveBeenCalled();
    });


    test('handlePlayedCard should do nothing', () => {
        expect(() => playerPlayabilityPhase.handlePlayedCard(mockCtx as GameContext, "A")).not.toThrow();

        expect(mockToEndPhase).not.toHaveBeenCalled();
        expect(mockToPlayingPhase).not.toHaveBeenCalled();
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

    test('handlePlayFaceDownCard should do nothing', () => {
        expect(() => playerPlayabilityPhase.handlePlayFaceDownCard(mockCtx as GameContext)).not.toThrow();

        expect(mockToEndPhase).not.toHaveBeenCalled();
        expect(mockToPlayingPhase).not.toHaveBeenCalled();
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

    test('handleCardEffect should do nothing', () => {
        expect(() => playerPlayabilityPhase.handleCardEffect(mockCtx as GameContext)).not.toThrow();

        expect(mockToEndPhase).not.toHaveBeenCalled();
        expect(mockToPlayingPhase).not.toHaveBeenCalled();
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });
});
