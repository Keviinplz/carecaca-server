import { Card } from "@engine/models/card"
import { Table } from "@engine/models/table"

describe('Table manager', () => {
    const cards = [new Card('3'), new Card('4')]

    test('Should toggle pile ascending order', () => {
        const table = new Table([], [], true)

        expect(table.isPileAscending).toBe(true)
        table.invertPileOrder()
        expect(table.isPileAscending).toBe(false)
    }) 

    test('Should return top card without remove it from discardPile', () => {
        const table = new Table(cards, [], true)

        expect(table.getTopCard()).toBe(cards[1])

        table.discardPile.pop()
        expect(table.getTopCard()).toBe(cards[0])
        
        table.discardPile.pop()

        expect(table.getTopCard()).toBeUndefined()
    })

    test('Should delete all cards from discardPile if burn is called', () => {
        const table = new Table(cards, [], true)

        expect(table.discardPile).toHaveLength(2)
        table.burn()
        expect(table.discardPile).toHaveLength(0)
    })

    test('Should return a card from drawDeck if any, otherwise returns undefined', () => {
        const table = new Table([], cards, true)

        expect(table.draw()).toBe(cards[1])
        expect(table.draw()).toBe(cards[0])
        expect(table.draw()).toBeUndefined()
    })
})