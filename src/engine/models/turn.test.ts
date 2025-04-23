import { Player } from "@engine/models/player"
import { Turn } from "@engine/models/turn"

describe('Turn manager', () => {
    const players = [
        new Player("Kevin", [], [], []), 
        new Player("Valentina", [], [], []),
        new Player("Pepe", [], [], [])
    ]

    test('Should throw an error when is instanciated with less than 2 players', () => {
        expect(() => new Turn([])).toThrow("At least two players required.")
        expect(() => new Turn([players[0]])).toThrow("At least two players required.")
    })

    test('Should return first player if index is 0', () => {
        const turn = new Turn(players)
        const targetPlayer = players[0]
        expect(turn.getCurrentPlayer()).toBe(targetPlayer)
    })

    test('Should return current player and traverse player list when next() is called', () => {
        const turn = new Turn(players)
        const firstPlayer = players[0]
        const secondPlayer = players[1]
        const thirdPlayer = players[2]

        expect(turn.getCurrentIndex()).toBe(0)
        expect(turn.getCurrentPlayer()).toBe(firstPlayer)
        
        turn.next()
        
        expect(turn.getCurrentIndex()).toBe(1)
        expect(turn.getCurrentPlayer()).toBe(secondPlayer)

        turn.next()

        expect(turn.getCurrentIndex()).toBe(2)
        expect(turn.getCurrentPlayer()).toBe(thirdPlayer)

        turn.next()

        expect(turn.getCurrentIndex()).toBe(0)
        expect(turn.getCurrentPlayer()).toBe(firstPlayer)
    })
    
    test('Should traverse player list backwards when reverseDirection is called', () => {
        const turn = new Turn(players)

        const firstPlayer = players[0]
        const secondPlayer = players[1]
        const thirdPlayer = players[2]

        expect(turn.getCurrentPlayer()).toBe(firstPlayer)
        
        turn.reverseDirection()
        turn.next()
        expect(turn.getCurrentPlayer()).toBe(thirdPlayer)

        turn.next()
        expect(turn.getCurrentPlayer()).toBe(secondPlayer)

        turn.next()
        expect(turn.getCurrentPlayer()).toBe(firstPlayer)

        turn.reverseDirection()
        turn.next()
        expect(turn.getCurrentPlayer()).toBe(secondPlayer)

        turn.next()
        expect(turn.getCurrentPlayer()).toBe(thirdPlayer)
    })

    test('Should return next player index and match with next player', () => {
        const turn = new Turn(players)
        const firstPlayer = players[0]
        const secondPlayer = players[1]
        const thirdPlayer = players[2]

        expect(turn.getDirection()).toBe(true)
        // Current player is on index = 0
        expect(turn.getNextPlayerIndex()).toBe(1)
        expect(turn.getNextPlayer()).toBe(secondPlayer)
        turn.next()

        // Current player is on index = 1
        expect(turn.getNextPlayerIndex()).toBe(2)
        expect(turn.getNextPlayer()).toBe(thirdPlayer)
        turn.next()

        // Current player is on index = 2
        expect(turn.getNextPlayerIndex()).toBe(0)
        expect(turn.getNextPlayer()).toBe(firstPlayer)

        turn.reverseDirection()
        expect(turn.getDirection()).toBe(false)
        expect(turn.getNextPlayerIndex()).toBe(1)
        expect(turn.getNextPlayer()).toBe(secondPlayer)
        turn.next()

        // Current player is on index = 1
        expect(turn.getNextPlayerIndex()).toBe(0)
        expect(turn.getNextPlayer()).toBe(firstPlayer)
        turn.next()

        // Current player is on index = 0
        expect(turn.getNextPlayerIndex()).toBe(2)
        expect(turn.getNextPlayer()).toBe(thirdPlayer)
    })
})