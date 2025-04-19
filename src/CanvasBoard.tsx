import React, { useEffect, useRef, useState } from "react";
import { GameState } from "@/models/state";
import cardSprite from "@/assets/cards.png"
import { DrawingContext, Point } from "@/models/base";
import { CardUI } from "@/models/card";
import { CARD_SUITS, CARD_VALUES } from "@/engine/constants";

type CanvasBoardProps = {
    gameState: GameState
}

const MAX_CARD_STACK_TO_DRAW = 3



const drawStack = ({
    stack,
    drawingCtx,
    origin,
    showable
}: {
    stack: CardUI[],
    drawingCtx: DrawingContext,
    origin: Point
    showable: boolean
}) => {
    if (stack.length === 0) return

    const quantity = Math.min(MAX_CARD_STACK_TO_DRAW, stack.length)
    for (const [index, _] of Array(quantity).entries()) {
        const card = stack[index]
        const cardPos = { x: origin.x, y: origin.y - index * 10 }
        card.setPosition(cardPos)
        card.setHidden(!showable)
        card.draw(drawingCtx)
    }
}

const drawTable = (drawingCtx: DrawingContext) => {
    const { ctx, gameState } = drawingCtx
    const xCanvasMiddle = (ctx.canvas.width / 2)
    const yCanvasMiddle = (ctx.canvas.height / 2)
    const radius = (ctx.canvas.width / 2) * 0.4;

    // Split circle table into {gameState.players.length} arcs of equal length with angle deltaTheta
    const deltaTheta = (2 * Math.PI) / gameState.players.length;
    for (let [index, player] of gameState.players.entries()) {
        const playerAngle = (deltaTheta * index) + (Math.PI / 2);
        const x = Math.round(radius * Math.cos(playerAngle) + xCanvasMiddle);
        const y = Math.round(radius * Math.sin(playerAngle) + yCanvasMiddle);
        player.setPosition({ x, y })
        player.draw(drawingCtx)
    }

    // Draw discardPile and drawDeck
    drawStack({
        stack: gameState.drawDeck,
        drawingCtx,
        origin: { x: xCanvasMiddle - 30, y: yCanvasMiddle },
        showable: false
    })

    drawStack({
        stack: gameState.discardPile,
        drawingCtx,
        origin: { x: xCanvasMiddle + 30, y: yCanvasMiddle },
        showable: true
    })
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ gameState }) => {
    const [assetsLoaded, setAssetsLoaded] = useState<Record<string, boolean>>({});
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const cardSpriteRef = useRef<HTMLImageElement | null>(null);

    const handleLoadAsset = (assetId: string) => {
        setAssetsLoaded(prev => ({ ...prev, [assetId]: true }));
    }

    const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>, state: GameState) => {
        const ctx = e.currentTarget.getContext("2d")
        const cardImage = cardSpriteRef.current
        const myself = state.players.find(player => player.isMyself)
        if (!myself || !ctx || !cardImage) {
            console.error("Myself is not setted or context not found")
            return;
        }
        const cardImageWidth = cardImage.width / CARD_VALUES.length;
        const cardImageHeight = cardImage.height / CARD_SUITS.length;
        const cardImageAspectRatio = cardImageWidth / cardImageHeight;
        const origin = {x: ctx.canvas.width / 2, y: ctx.canvas.height / 2}
        ctx.save()
        ctx.translate(origin.x, origin.y)
        for (const card of myself.hand) {
            const mouseX = e.clientX - ctx.canvas.offsetLeft - origin.x;
            const mouseY = e.clientY - ctx.canvas.offsetTop - origin.y;
            const cardWidth = card.CARD_DISPLAY_WIDTH;
            const cardHeight = card.CARD_DISPLAY_WIDTH * (1 / cardImageAspectRatio)
            const x0 = card.tablePosition.x - (cardWidth / 2);
            const x1 = card.tablePosition.x + (cardWidth / 2);
            const y0 = card.tablePosition.y - (cardHeight / 2)
            const y1 = card.tablePosition.y + (cardHeight / 2);
            const insideCard = (x0 <= mouseX && mouseX <= x1) && (y0 <= mouseY && mouseY <= y1);
            if (insideCard) {
                ctx.fillStyle = "red"
                ctx.fillRect(card.tablePosition.x, card.tablePosition.y + (cardHeight / 2), 4, 4)
            } else {
                ctx.fillStyle = "white"
                ctx.fillRect(card.tablePosition.x, card.tablePosition.y + (cardHeight / 2), 4, 4)
            }
        }
        ctx.restore()
    }

    useEffect(() => {
        if (!canvasRef.current || !cardSpriteRef.current || !Object.values(assetsLoaded).every(Boolean)) return;
        const ctx = canvasRef.current.getContext("2d");

        if (!ctx) return;
        drawTable({
            ctx,
            gameState,
            assets: [cardSpriteRef.current]
        })
    }, [gameState, assetsLoaded])

    return (
        <div>
            <canvas 
                className="border-2 border-black" 
                width="800" 
                height="600" 
                ref={canvasRef}
                onMouseMove={(e) => handleCanvasMouseMove(e, gameState)} 
            />
            <div id="assets" className="hidden">
                <img
                    className="hidden"
                    src={cardSprite}
                    ref={cardSpriteRef}
                    id="card-sprite"
                    onLoad={(e) => handleLoadAsset(e.currentTarget.id)}
                />
            </div>
        </div>
    )
}