import React, { useEffect, useRef } from "react";
import { GameState } from "@/models/state";


type CanvasBoardProps = {
    gameState: GameState
}
const drawTable = (ctx: CanvasRenderingContext2D, gameState: GameState) => {
    const xCanvasMiddle = (ctx.canvas.width / 2)
    const yCanvasMiddle = (ctx.canvas.height / 2)
    const radius = (ctx.canvas.width / 2) * 0.4;

    // Split circle table into {gameState.players.length} arcs of equal length with angle deltaTheta
    const deltaTheta = (2 * Math.PI) / gameState.players.length;
    for (let [index, player] of gameState.players.entries()) {
        const playerAngle = (deltaTheta * index) + (Math.PI /2);
        const x = radius * Math.cos(playerAngle) + xCanvasMiddle;
        const y = radius * Math.sin(playerAngle) + yCanvasMiddle;
        player.setPosition({x, y})
        player.draw(ctx)
    }
}

export const CanvasBoard: React.FC<CanvasBoardProps> = ({ gameState }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        drawTable(ctx, gameState)

    }, [gameState])

    return <canvas className="border-2 border-black" width="800" height="600" ref={canvasRef} />
}