import { useReducer } from "react";
import { CanvasBoard } from "@/CanvasBoard";
import gameStateReducer from "@/gameStateReducer";
import { GameStateFactory, spawnDeck } from "@/factory/game";
import { shuffle } from "@/utils"

const deck = shuffle(spawnDeck())
const factory = new GameStateFactory()
factory.addPlayer({name: "Kevin", isMyself: true})
factory.addPlayer({name: "CPU1", isMyself: false})
// factory.addPlayer({name: "CPU2", isMyself: false})
// factory.addPlayer({name: "CPU3", isMyself: false})
const initialGameState = factory.createGame(deck)

function App() {
  const [gameState, dispatch] = useReducer(gameStateReducer, initialGameState)

  return (
    <>
      <header>Header | Cara de caca</header>
      <main className="flex flex-row justify-center items-center gap-2">
        <div className="flex flex-col justify-between">
          <div>Players</div>
          <div className="grow">
            <ul>
              {gameState.players.map((player, index) => <li key={index}>{player.name}</li>)}
            </ul>
          </div>
        </div>
        <CanvasBoard gameState={gameState} />
        <div className="flex flex-col">
          <div>Chat</div>
          <div>Write a message...</div>
          <form className="flex flex-row gap-1">
            <input type="text" className="border-1" />
            <input type="submit" value="Send" className="border-1" />
          </form>
        </div>
      </main>
      <footer>With ❤️ by Keviinplz</footer>
    </>
  )
}

export default App
