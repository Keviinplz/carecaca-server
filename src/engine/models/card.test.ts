import { GameContext } from "@engine/context"
import { CardEffect } from "@engine/effects"
import { Card } from "@engine/models/card"
import { Phases } from "@engine/phases/registry"
import { Table } from "./table"
import { Turn } from "./turn"
import { Player } from "./player"
import { GameRules } from "./rules"

class TestEffect implements CardEffect {
    apply(ctx: GameContext): void {
        ctx.table.discardPile.push(new Card("A"))
    }
}

describe('Card', () => {
    const testEffect = new TestEffect()
    const cardWithoutEffects = new Card("2")
    const cardWithEffects = new Card("2", testEffect)

    const table = new Table([], [], true)
    const players = [new Player("a", [], [], []), new Player("b", [], [], [])]
    const turn = new Turn(players, 0, true)
    const rules = new GameRules([])
    const ctx = new GameContext(
        Phases.end,
        table,
        turn,
        players,
        rules
    )
    test('Card without effect should return instantly and not apply effect', () => {
        cardWithoutEffects.applyEffect(ctx)

        expect(ctx.table.discardPile).toHaveLength(0)
    })

    test('Card with effect should do something to context', () => {
        cardWithEffects.applyEffect(ctx)

        expect(ctx.table.discardPile).toHaveLength(1)
        expect(ctx.table.discardPile[0].value).toBe("A")
    })
})