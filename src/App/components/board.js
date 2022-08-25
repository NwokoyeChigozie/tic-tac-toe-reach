import React, { useState, useEffect } from "react";

export function Board({
  board,
  player,
  game,
  gameOutcome,
  setGame,
  setBoard,
  contract,
  resolvePromise,
}) {
  const [play, setPlay] = useState(0);
  let playerNumber = player == "Player1" ? 1 : player == "Player2" ? 2 : 0;
  let opponentNumber = player == "Player1" ? 2 : player == "Player2" ? 1 : 0;

  function updateBoard(e, i) {
    e.preventDefault();
    console.log(game.turn, playerNumber);
    if (game.turn != playerNumber) {
      return false;
    }
    let b = board;
    b[i] = playerNumber;
    console.log(`${player} played ${i}, new board ${b}`);
    resolvePromise(i);
    setBoard(b);
    setPlay(play + 1);
    setGame({ ...game, turn: opponentNumber });
  }

  function getTurnMessage(turn) {
    let playerNumber = player == "Player1" ? 1 : player == "Player2" ? 2 : 0;
    let opponentNumber = player == "Player1" ? 2 : player == "Player2" ? 1 : 0;
    if (turn == playerNumber) {
      return "Your turn to play";
    } else if (turn == playerNumber) {
      return "Your opponent is playing";
    } else {
      return "";
    }
  }

  function getOutcomeMessage(outcome) {
    console.log("board outcome", outcome);
    let playerNumber = player == "Player1" ? 0 : player == "Player2" ? 2 : 1;
    let opponentNumber = player == "Player1" ? 2 : player == "Player2" ? 0 : 1;
    if (outcome == 1) {
      return "Game Outcome: Draw";
    } else if (outcome == playerNumber) {
      return "You Win";
    } else if (outcome == opponentNumber) {
      return "Your Opponent Wins";
    } else {
      return "";
    }
  }

  useEffect(() => {}, [game, board, gameOutcome]);
  return (
    <>
      {contract && player == "Player1" && game.opponent == 0 ? (
        <h4 className="Waiting2join">Waiting For opponent to join...</h4>
      ) : (
        <></>
      )}
      {game.turn != 0 ? (
        <h4 className="Waiting2join">{getTurnMessage(game.turn)}</h4>
      ) : (
        <></>
      )}
      {game.status == 1 ? (
        <h4 className="Waiting2join">{getOutcomeMessage(gameOutcome)}</h4>
      ) : game.status == 2 ? (
        <h4 className="Waiting2join">
          Game Over - {getOutcomeMessage(gameOutcome)}
        </h4>
      ) : game.status == 3 ? (
        <h4 className="Waiting2join">
          Timeout Occured - {getOutcomeMessage(gameOutcome)}
        </h4>
      ) : (
        ""
      )}
      <div id="game-screen" className="board center">
        <table className="center">
          <tbody>
            <tr>
              <td>
                <button
                  disabled={board[0] != 0}
                  type="button"
                  className="cell"
                  id="cell00"
                  onClick={(e) => {
                    updateBoard(e, 0);
                  }}
                >
                  {board[0] == 1 ? "X" : board[0] == 2 ? "O" : ""}
                </button>
              </td>
              <td>
                <button
                  disabled={board[1] != 0}
                  type="button"
                  className="cell"
                  id="cell01"
                  onClick={(e) => {
                    updateBoard(e, 1);
                  }}
                >
                  {board[1] == 1 ? "X" : board[1] == 2 ? "O" : ""}
                </button>
              </td>
              <td>
                <button
                  disabled={board[2] != 0}
                  type="button"
                  className="cell"
                  id="cell02"
                  onClick={(e) => {
                    updateBoard(e, 2);
                  }}
                >
                  {board[2] == 1 ? "X" : board[2] == 2 ? "O" : ""}
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  disabled={board[3] != 0}
                  type="button"
                  className="cell"
                  id="cell10"
                  onClick={(e) => {
                    updateBoard(e, 3);
                  }}
                >
                  {board[3] == 1 ? "X" : board[3] == 2 ? "O" : ""}
                </button>
              </td>
              <td>
                <button
                  disabled={board[4] != 0}
                  type="button"
                  className="cell"
                  id="cell11"
                  onClick={(e) => {
                    updateBoard(e, 4);
                  }}
                >
                  {board[4] == 1 ? "X" : board[4] == 2 ? "O" : ""}
                </button>
              </td>
              <td>
                <button
                  disabled={board[5] != 0}
                  type="button"
                  className="cell"
                  id="cell12"
                  onClick={(e) => {
                    updateBoard(e, 5);
                  }}
                >
                  {board[5] == 1 ? "X" : board[5] == 2 ? "O" : ""}
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <button
                  disabled={board[6] != 0}
                  type="button"
                  className="cell"
                  id="cell20"
                  onClick={(e) => {
                    updateBoard(e, 6);
                  }}
                >
                  {board[6] == 1 ? "X" : board[6] == 2 ? "O" : ""}
                </button>
              </td>
              <td>
                <button
                  disabled={board[7] != 0}
                  type="button"
                  className="cell"
                  id="cell21"
                  onClick={(e) => {
                    updateBoard(e, 7);
                  }}
                >
                  {board[7] == 1 ? "X" : board[7] == 2 ? "O" : ""}
                </button>
              </td>
              <td>
                <button
                  disabled={board[8] != 0}
                  type="button"
                  className="cell"
                  id="cell22"
                  onClick={(e) => {
                    updateBoard(e, 8);
                  }}
                >
                  {board[8] == 1 ? "X" : board[8] == 2 ? "O" : ""}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="button"
          id="restart"
          onClick={(e) => {
            location.reload(false);
          }}
        >
          Restart
        </button>
      </div>
    </>
  );
}
