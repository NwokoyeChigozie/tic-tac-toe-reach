import React, { useState, useEffect } from "react";
import { Board } from "./board";
import { ChoosePlayer } from "./player";
import { GetContract } from "./contract";
import { GetAccBalance } from "../actions/getaccount";
export function Game({
  stdlib,
  environment,
  accountbal,
  accountAddr,
  setAccountData,
  setAccountbal,
  setAccountAddr,
  accountData,
  backend,
}) {
  const { standardUnit } = stdlib;
  const [player, setPlayer] = useState("");
  const [contract, setContract] = useState();
  const [game, setGame] = useState({
    status: 0,
    opponent: 0,
    turn: 0,
  });
  const [board, setBoard] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [contractInfo, setContractInfo] = useState();
  const [gameOutcome, setgameOutcome] = useState(1);
  const [resolvePromise, setResolvePromise] = useState({ resolve: () => null });
  const interact = {
    ...stdlib.hasRandom,
  };

  interact.acceptWager = async (amt) => {
    console.log(`You accepted a wager of ${parseInt(amt)} ${standardUnit}`);
  };

  async function getHand(playerNumber) {
    setGame({ ...game, status: 1, opponent: 1, turn: playerNumber });
    console.log("getting hand");
    return await new Promise((resolve) => {
      setResolvePromise({ resolve });
    });
  }

  interact.getHand = async () => {
    console.log("playing your turn");
    let playerNumber = player == "Player1" ? 1 : player == "Player2" ? 2 : 0;

    let hand = await getHand(playerNumber);
    console.log(`You played ${hand}`);
    return hand;
  };

  async function resolveSeeHand(player, bhand) {
    let opponentNumber = player == "Player1" ? 2 : player == "Player2" ? 1 : 0;
    setGame({ ...game, status: 1, opponent: 1, turn: opponentNumber });
    let b = board;
    b[bhand] = player;
    setBoard(b);
  }

  interact.seeHand = async (player, bhand) => {
    console.log(`Player ${player}, played ${bhand}`);
    await resolveSeeHand(player, bhand);
  };

  async function resolveSeeOutcome(outcome) {
    console.log(`see outcome 1 current outcome is ${outcome}`);
    setgameOutcome(outcome);
    console.log(`see outcome 2 current outcome is ${outcome}`);
  }

  interact.seeOutcome = async (outcome) => {
    console.log(`outcome is ${outcome}`);
    await resolveSeeOutcome(outcome);
  };

  async function resolveCompletion(typeC) {
    let Finalbal = await GetAccBalance(stdlib, accountData);
    setAccountbal(Finalbal);
    setGame({ ...game, status: typeC, opponent: 2, turn: 0 });
    console.log(`current outcome is ${gameOutcome}`);
  }

  interact.informCompletion = async () => {
    await resolveCompletion(2);
    console.log(`Game Over`);
  };

  interact.informTimeout = async () => {
    await resolveCompletion(3);
    console.log(`There was a timeout.`);
  };

  async function _getContractinfo() {
    console.log("attempting to get contract");
    interact.wager = 100000000;
    console.log("here1");
    interact.deadline = { ETH: 100, ALGO: 100, CFX: 1000 }[stdlib.connector];
    console.log("here2");
    let ctc = accountData.contract(backend);
    console.log("here3", ctc);
    backend.Player1(ctc, interact);
    console.log("here4", ctc);
    let info = await ctc.getInfo();
    console.log("here5");
    console.log("game acct data", accountData);
    setContractInfo(info);
    setContract(ctc);
  }

  useEffect(() => {
    if (player == "Player1" && !contract) {
      _getContractinfo();
    }
  }, [player]);

  return (
    <>
      {!player ? <ChoosePlayer setPlayer={setPlayer}></ChoosePlayer> : <></>}
      {!player ? (
        <></>
      ) : (
        <GetContract
          player={player}
          contract={contract}
          setContract={setContract}
          stdlib={stdlib}
          accountData={accountData}
          contractInfo={contractInfo}
          setContractInfo={setContractInfo}
          interact={interact}
          backend={backend}
        ></GetContract>
      )}

      {!contract ? (
        <></>
      ) : (
        <Board
          board={board}
          player={player}
          game={game}
          gameOutcome={gameOutcome}
          setGame={setGame}
          setBoard={setBoard}
          contract={contract}
          resolvePromise={resolvePromise.resolve}
        ></Board>
      )}
    </>
  );
}
