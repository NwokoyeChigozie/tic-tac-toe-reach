import React, { useState, useEffect } from "react";
import * as backend from "../../build/index.main.mjs";
export function Game({
  stdlib,
  environment,
  accountbal,
  accountAddr,
  setAccountData,
  setAccountbal,
  setAccountAddr,
  accountData,
}) {
  const [player, setPlayer] = useState("");
  const [contract, setContract] = useState();
  const [contractInfo, setContractInfo] = useState();

  async function _getContractinfo() {
    console.log("game acct data", accountData);
    accountData = await stdlib.connectAccount(accountData.networkAccount);
    // console.log(11);
    let ctc = accountData.contract(backend);
    // console.log("contract", ctc);
    // console.log(22);
    let info = await ctc.getInfo();
    // console.log(33);
    console.log("contract2", info);
    // console.log(44);
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
        ></GetContract>
      )}
    </>
  );
}

function GetContract({
  player,
  contract,
  setContract,
  stdlib,
  accountData,
  backend,
  contractInfo,
}) {
  const [error, setError] = useState({ status: false, message: "" });

  function joinContract(e) {
    e.preventDefault();
    let ctc = null;
    let ct = document.getElementById("contractInputInfo").value;
    if (ct == "") {
      setError({ status: true, message: "enter contract information" });
    }

    try {
      ctc = accountData.contract(backend, ct);
    } catch (er) {
      if (er) {
        console.log(er);
        setError({ status: true, message: "invalid contract info" });
      }
    }
    setContract(ctc);
  }

  return (
    <>
      {player == "Player1" && contract ? (
        <h4 className="contractInfo center">
          Contract Information: {JSON.stringify(contractInfo)}
        </h4>
      ) : (
        <></>
      )}
      {player == "Player2" && !contract ? (
        <div className="screen center">
          <h4>Enter Contract Information!</h4>
          <input
            type="text"
            id="contractInputInfo"
            className="contractInput"
          ></input>
          <button
            type="button"
            id="connect-to-mainnet"
            onClick={(e) => joinContract(e)}
          >
            Join Game
          </button>
          {error.status ? (
            <p className="secret-error">{error.message}</p>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function ChoosePlayer({ setPlayer }) {
  return (
    <div id="chooseStart" className="center">
      <button
        type="button"
        id="choose-x"
        className="choose"
        onClick={(e) => {
          console.log("chose Player 1");
          setPlayer("Player1");
        }}
      >
        Start New Game
      </button>
      <button
        type="button"
        id="choose-o"
        className="choose"
        onClick={(e) => {
          console.log("chose Player 2");
          setPlayer("Player2");
        }}
      >
        Join Existing Game
      </button>
    </div>
  );
}
