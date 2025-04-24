import { Player } from "@engine/models/player"
import { Card } from "@engine/models/card"
import type { CardValue } from "@engine/constants"

describe('Player', () => {
    
    test('Player should won if has no cards', () => {
        const playerWithoutCards = new Player("Kevin", [], [], [])
        expect(playerWithoutCards.won()).toBe(true)

        playerWithoutCards.hand = [new Card("3")]
        expect(playerWithoutCards.won()).toBe(false)

        playerWithoutCards.hand = []
        playerWithoutCards.faceUpCards = [new Card("3")]
        expect(playerWithoutCards.won()).toBe(false)

        playerWithoutCards.faceUpCards = []
        playerWithoutCards.faceDownCards = [new Card("3")]

        expect(playerWithoutCards.won()).toBe(false)
    })
    
    test('Player should add cards to hand', () => {
        const player = new Player("Kevin", [], [], [])

        expect(player.hand).toHaveLength(0)
        player.addCardsToHand(new Card("3"))
        expect(player.hand).toHaveLength(1)
        player.addCardsToHand(new Card("4"), new Card("5"))
        expect(player.hand).toHaveLength(3)
    })

    test('Finding a card in hand should return it without removing from stack', () => {
        const player = new Player("Kevin", [new Card("3"), new Card("4")], [new Card("5")], [])

        const card3 = player.findCardInHand("3")
        const card4 = player.findCardInHand("4")
        const card5 = player.findCardInHand("5")

        expect(card3).toBeInstanceOf(Card)
        expect(card3!.value).toBe("3")
        
        expect(card4).toBeInstanceOf(Card)
        expect(card4!.value).toBe("4")

        expect(card5).toBeUndefined()

        expect(player.hand).toHaveLength(2)
    })

    test('Finding a card in faceUpCards should return it without removing from faceUpCards', () => {
        const player = new Player("Kevin", [new Card("3"), new Card("4")], [new Card("5")], [])

        const card3 = player.findCardInFaceUp("3")
        const card5 = player.findCardInFaceUp("5")

        expect(card3).toBeUndefined()
        
        expect(card5).toBeInstanceOf(Card)
        expect(card5!.value).toBe("5")

        expect(player.faceUpCards).toHaveLength(1)
    })

    test('Checks card in hand should return boolean without removing card', () => {
        const player = new Player("Kevin", [new Card("3")], [], [])

        expect(player.hasCardInHand("3")).toBe(true)
        expect(player.hasCardInHand("4")).toBe(false)

        expect(player.hand).toHaveLength(1)
    })

    test('Checks card in faceUpCards should return boolean without removing card', () => {
        const player = new Player("Kevin", [], [new Card("3")], [])

        expect(player.hasCardInFaceUp("3")).toBe(true)
        expect(player.hasCardInFaceUp("4")).toBe(false)

        expect(player.faceUpCards).toHaveLength(1)
    })

    test('Removes card from hand', () => {
        const player = new Player("Kevin", [new Card("3"), new Card("4")], [new Card("5")], [])

        expect(player.hand).toHaveLength(2)
        expect(player.faceUpCards).toHaveLength(1)

        const card3 = player.removeCardFromHand("3")
        const card5 = player.removeCardFromHand("5")

        expect(card3).toBeInstanceOf(Card)
        expect(card3!.value).toBe("3")
        
        expect(card5).toBeUndefined()
        
        expect(player.hand).toHaveLength(1)
        expect(player.hand[0].value).toBe("4")
        expect(player.faceUpCards).toHaveLength(1)
    })

    test('Removes card from faceUp', () => {
        const player = new Player("Kevin", [new Card("3"), new Card("4")], [new Card("5")], [])

        expect(player.hand).toHaveLength(2)
        expect(player.faceUpCards).toHaveLength(1)

        const card3 = player.removeCardFromFaceUp("3")
        const card5 = player.removeCardFromFaceUp("5")

        expect(card3).toBeUndefined()

        expect(card5).toBeInstanceOf(Card)
        expect(card5!.value).toBe("5")
        
        
        expect(player.hand).toHaveLength(2)
        expect(player.faceUpCards).toHaveLength(0)
    })

    test('Removes card from faceDown using indexes', () => {
        const player = new Player("Kevin", [new Card("3")], [new Card("5")], [new Card("7"), new Card("Joker")])

        expect(player.hand).toHaveLength(1)
        expect(player.faceUpCards).toHaveLength(1)
        expect(player.faceDownCards).toHaveLength(2)

        const cardSecret = player.removeFaceDownCardByIndex(0)
        const undefinedCard = player.removeFaceDownCardByIndex(3)

        expect(undefinedCard).toBeUndefined()

        expect(cardSecret).toBeInstanceOf(Card)
        expect(cardSecret!.value).toBe("7")
        
        
        expect(player.hand).toHaveLength(1)
        expect(player.faceUpCards).toHaveLength(1)
        expect(player.faceDownCards).toHaveLength(1)
    })

})