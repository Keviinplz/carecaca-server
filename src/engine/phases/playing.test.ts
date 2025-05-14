import { GameContext } from "@engine/context";
import { Table } from "@engine/models/table";
import { Turn } from "@engine/models/turn";
import { GameRules } from "@engine/models/rules";
import { Player } from "@engine/models/player";
import { PlayingPhase } from "./playing";
import { Card } from "@engine/models/card";

const mockIsCardPlayable = jest.fn();
const mockGetCurrentPlayer = jest.fn();
const mockCompleteTurn = jest.fn();
const mockToCardEffectPhase = jest.fn();
const mockApplyPenalty = jest.fn();

const createMockContext = (): Partial<GameContext> => ({
    table: new Table([], [], true),
    turn: {
        getCurrentPlayer: mockGetCurrentPlayer,
    } as Partial<Turn> as Turn,
    players: [],
    rules: {
        isCardPlayable: mockIsCardPlayable,
    } as Partial<GameRules> as GameRules,
    completeTurn: mockCompleteTurn,
    toCardEffectPhase: mockToCardEffectPhase,
    applyPenalty: mockApplyPenalty,
});

describe('PlayingPhase', () => {
    let playingPhase: PlayingPhase;
    let mockCtx: Partial<GameContext>;
    let player: Player;

    beforeEach(() => {
        jest.clearAllMocks();

        playingPhase = new PlayingPhase();

        mockCtx = createMockContext();
        player = new Player("test", [], [], []);

        mockGetCurrentPlayer.mockReturnValue(player);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('handlePlayedCard', () => {
        test('Should penalty player if attempts to play a non having card', () => {
            // Hand Case
            player.hand = [new Card("3"), new Card("4")]
            player.faceUpCards = [new Card("J"), new Card("K")]

            playingPhase.handlePlayedCard(mockCtx as GameContext, "J")

            expect(mockApplyPenalty).toHaveBeenCalledTimes(1);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(1);

            // FaceUp Case

            player.hand = []
            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")
            expect(mockApplyPenalty).toHaveBeenCalledTimes(2);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(2);
        })

        test('Should penalty player if card is not playable', () => {
            // Hand Case
            player.hand = [new Card("3")]
            mockIsCardPlayable.mockReturnValue(false)

            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")

            expect(mockApplyPenalty).toHaveBeenCalledWith(player);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(1);
        })

        test('Should execute play if all conditions mets', () => {
            const mockExecutePlay = jest.spyOn(PlayingPhase.prototype as any, 'executePlay')
            mockExecutePlay.mockImplementation(() => { })
            mockIsCardPlayable.mockReturnValue(true)

            // Hand Case
            player.hand = [new Card("3"), new Card("4")]
            player.faceUpCards = [new Card("J"), new Card("K")]

            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")

            expect(mockExecutePlay).toHaveBeenCalledWith(mockCtx, player, "3", true)

            // FaceUp Case
            player.hand = []
            playingPhase.handlePlayedCard(mockCtx as GameContext, "K")
            expect(mockExecutePlay).toHaveBeenCalledWith(mockCtx, player, "K", false)
            mockExecutePlay.mockRestore()
        })

        test('Should add drawn card to pile and pass to card effect if played card was from face up cards', () => {
            const drawnCard = new Card("3")
            player.hand = []
            player.faceUpCards = [drawnCard]
            mockCtx.table!.discardPile = []

            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")
            expect(mockCtx.table?.discardPile).toHaveLength(1)
            expect(mockCtx.table?.discardPile).toStrictEqual([drawnCard])

            expect(player.hand).toHaveLength(0)
            expect(player.faceUpCards).toHaveLength(0)

            expect(mockToCardEffectPhase).toHaveBeenCalled()
        })

        test('Should refill player hand if table has draw cards when play was executed', () => {
            const drawnCard = new Card("3")
            const cardFromDeck1 = new Card("4")
            const cardFromDeck2 = new Card("5")
            const cardFromDeck3 = new Card("6")
            player.hand = [drawnCard]
            player.faceUpCards = []
            mockCtx.table!.discardPile = []
            mockCtx.table!.drawDeck = [cardFromDeck1, cardFromDeck2, cardFromDeck3]

            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")
            expect(mockCtx.table?.discardPile).toHaveLength(1)
            expect(mockCtx.table?.discardPile).toStrictEqual([drawnCard])

            expect(player.hand).toHaveLength(3)
            expect(player.hand).toStrictEqual([cardFromDeck3, cardFromDeck2, cardFromDeck1])

            expect(mockCtx.table?.drawDeck).toHaveLength(0)
            expect(mockCtx.table?.drawDeck).toStrictEqual([])

            expect(mockToCardEffectPhase).toHaveBeenCalled()
        })

        test('Should stop refilling player hand on play execution if table has no cards of player has more than 3 cards in hand', () => {
            const drawnCard = new Card("3")
            const cardFromDeck1 = new Card("4")
            const cardFromDeck2 = new Card("5")
            const cardFromDeck3 = new Card("6")
            const cardfromDeck4 = new Card("7")
            player.hand = [drawnCard]
            player.faceUpCards = []
            mockCtx.table!.discardPile = []
            mockCtx.table!.drawDeck = [cardFromDeck1]

            // Stops when table has no cards 
            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")
            expect(mockCtx.table?.discardPile).toHaveLength(1)
            expect(mockCtx.table?.discardPile).toStrictEqual([drawnCard])

            expect(player.hand).toHaveLength(1)
            expect(player.hand).toStrictEqual([cardFromDeck1])

            expect(mockCtx.table?.drawDeck).toHaveLength(0)
            expect(mockCtx.table?.drawDeck).toStrictEqual([])

            // Stops when player has three cards
            player.hand = [drawnCard, cardFromDeck1, cardFromDeck2]
            mockCtx.table!.discardPile = []
            mockCtx.table!.drawDeck = [cardFromDeck3, cardfromDeck4]

            playingPhase.handlePlayedCard(mockCtx as GameContext, "3")
            expect(mockCtx.table?.discardPile).toHaveLength(1)
            expect(mockCtx.table?.discardPile).toStrictEqual([drawnCard])

            expect(player.hand).toHaveLength(3)
            expect(player.hand).toStrictEqual([cardFromDeck1, cardFromDeck2, cardfromDeck4])

            expect(mockCtx.table?.drawDeck).toHaveLength(1)
            expect(mockCtx.table?.drawDeck).toStrictEqual([cardFromDeck3])

            expect(mockToCardEffectPhase).toHaveBeenCalled()
        })
    })

    describe('handlePlayFaceDownCard', () => {
        test('Should penalty player if attempts to play a face down card having hand or face up cards.', () => {
            // Hand Case
            player.hand = [new Card("3"), new Card("4")]
            player.faceUpCards = [new Card("J"), new Card("K")]

            playingPhase.handlePlayFaceDownCard(mockCtx as GameContext)

            expect(mockApplyPenalty).toHaveBeenCalledTimes(1);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(1);

            // FaceUp Case

            player.hand = []
            playingPhase.handlePlayFaceDownCard(mockCtx as GameContext)
            expect(mockApplyPenalty).toHaveBeenCalledTimes(2);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(2);
        })

        test('Should complete turn if player has no face down cards', () => {
            player.hand = []
            player.faceUpCards = []
            player.faceDownCards = []

            playingPhase.handlePlayFaceDownCard(mockCtx as GameContext)

            expect(mockApplyPenalty).toHaveBeenCalledTimes(0);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(1);
        })

        test('Should penalty player and adds drawn card if it is not playable', () => {
            mockIsCardPlayable.mockReturnValue(false);

            const drawnCard = new Card("3")
            player.hand = []
            player.faceUpCards = []
            player.faceDownCards = [drawnCard]

            playingPhase.handlePlayFaceDownCard(mockCtx as GameContext)

            expect(mockApplyPenalty).toHaveBeenCalledWith(player);
            expect(mockCompleteTurn).toHaveBeenCalledTimes(1);
            expect(player.faceDownCards).toHaveLength(0)
            expect(player.hand).toHaveLength(1)
            expect(player.hand).toStrictEqual([drawnCard])
        })

        test('Should push drawn card to discardPile if drawn card is playable', () => {
            mockIsCardPlayable.mockReturnValue(true);

            const drawnCard = new Card("3")
            player.hand = []
            player.faceUpCards = []
            player.faceDownCards = [drawnCard]
            playingPhase.handlePlayFaceDownCard(mockCtx as GameContext)

            expect(mockApplyPenalty).not.toHaveBeenCalled();
            expect(mockCompleteTurn).not.toHaveBeenCalled();
            expect(player.faceDownCards).toHaveLength(0)
            expect(player.hand).toHaveLength(0)
            expect(mockCtx.table?.discardPile).toHaveLength(1)
            expect(mockCtx.table?.discardPile).toStrictEqual([drawnCard])
        })
    })

    test('handleCardEffect should do nothing', () => {
        expect(() => playingPhase.handleCardEffect(mockCtx as GameContext)).not.toThrow();

        expect(mockToCardEffectPhase).not.toHaveBeenCalled();
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });

    test('handlePlayerPlayability should do nothing', () => {
        expect(() => playingPhase.handlePlayerPlayability(mockCtx as GameContext)).not.toThrow();

        expect(mockToCardEffectPhase).not.toHaveBeenCalled();
        expect(mockCompleteTurn).not.toHaveBeenCalled();
        expect(mockApplyPenalty).not.toHaveBeenCalled();
    });
});
