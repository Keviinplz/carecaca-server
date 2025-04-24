import { Player } from "@engine/models/player"
import { Card } from "@engine/models/card"
import { Table } from "@engine/models/table"
import { GameRules } from "@engine/models/rules"
import { CardValue } from "@engine/constants"

describe('GameRules', () => {
    const wildCards: CardValue[] = ["2", "10", "Joker"]
    const firstPlayer = new Player(
        "Kevin",
        [new Card("8"), new Card("9"), new Card('J')],
        [new Card("10"), new Card("10"), new Card('10')],
        [new Card("3"), new Card("3"), new Card('3')],
    )
    const secondPlayer = new Player(
        "CPU1",
        [new Card("2"), new Card("5"), new Card('7')],
        [new Card("10"), new Card("10"), new Card('10')],
        [new Card("3"), new Card("3"), new Card('3')],
    )
    const thirdPlayer = new Player(
        "CPU2",
        [],
        [],
        [],
    )
    const fourthPlayer = new Player(
        "CPU3",
        [new Card("6")],
        [],
        [],
    )

    const table = new Table(
        [new Card("4")],
        [new Card("3"), new Card("3"), new Card("3")],
        true
    )
    const rules = new GameRules(wildCards)

    test('Player can play from hand if pile is ascending and top card is lower than hand cards', () => {
        expect(rules.canPlayerPlayFromHand(firstPlayer, table)).toBeTruthy()
    })

    test('Player can play from hand if pile is descending and top card is higher than hand cards', () => {
        const tableWithSeven = new Table([new Card("7")], [], false)
        expect(rules.canPlayerPlayFromHand(fourthPlayer, tableWithSeven)).toBeTruthy()
    })

    test('Player cant play from hand if pile is ascending and top card is higher than hand cards', () => {
        const tableBigger = new Table([new Card("K")], [], true)
        expect(rules.canPlayerPlayFromHand(firstPlayer, tableBigger)).toBeFalsy()
    })

    test('Player cant play from hand if pile is descending and top card is lower than hand cards', () => {
        const tableWithSeven = new Table([new Card("7")], [], false)
        expect(rules.canPlayerPlayFromHand(firstPlayer, tableWithSeven)).toBeFalsy()
    })

    test('Player can play from hand if pile is empty', () => {
        const tableEmpty = new Table([], [], true)
        expect(rules.canPlayerPlayFromHand(firstPlayer, tableEmpty)).toBeTruthy()

        tableEmpty.invertPileOrder()
        expect(rules.canPlayerPlayFromHand(firstPlayer, tableEmpty)).toBeTruthy()
    })

    test('Player always can play from hand if has a wildcard', () => {
        expect(rules.canPlayerPlayFromHand(secondPlayer, table)).toBeTruthy()

        table.invertPileOrder()
        expect(rules.canPlayerPlayFromHand(secondPlayer, table)).toBeTruthy()

        const tableEmpty = new Table([], [], true)
        expect(rules.canPlayerPlayFromHand(secondPlayer, tableEmpty)).toBeTruthy()
    })

    test('Player should only be able to play from faceUpCards if has no hand cards and card conditions mets', () => {
        expect(rules.canPlayerPlayFromFaceUp(firstPlayer, table)).toBeFalsy()

        const newPlayer = new Player(
            firstPlayer.name,
            [],
            firstPlayer.faceUpCards,
            firstPlayer.faceDownCards
        )

        expect(rules.canPlayerPlayFromFaceUp(newPlayer, table)).toBeTruthy()
    })

    test('Player should only be able to play from faceDown cards if has no hand or faceUp cards', () => {
        expect(rules.canPlayerPlayFromFaceDown(firstPlayer)).toBeFalsy()
        const newPlayerFaceUpCards = new Player(
            firstPlayer.name,
            [],
            firstPlayer.faceUpCards,
            firstPlayer.faceDownCards
        )

        expect(rules.canPlayerPlayFromFaceDown(newPlayerFaceUpCards)).toBeFalsy()

        const expectedPlayer = new Player(
            firstPlayer.name,
            [],
            [],
            firstPlayer.faceDownCards
        )
        expect(rules.canPlayerPlayFromFaceDown(expectedPlayer)).toBeTruthy()
    })

    test('Expects game is still playable if there is at least two players with cards', () => {
        const players = [firstPlayer, secondPlayer, thirdPlayer]
        expect(rules.isGameStillPlayable(players)).toBeTruthy()
    })

    test('Expects game is not playable if there one or less player with cards', () => {
        const players = [firstPlayer, thirdPlayer]
        expect(rules.isGameStillPlayable(players)).toBeFalsy()

        const playersMany = [firstPlayer, new Player("a", [], [], []), thirdPlayer]
        expect(rules.isGameStillPlayable(playersMany)).toBeFalsy()

        const playersEmpty = [new Player("a", [], [], []), new Player("b", [], [], []), new Player("c", [], [], [])]
        expect(rules.isGameStillPlayable(playersEmpty)).toBeFalsy()
    })
})