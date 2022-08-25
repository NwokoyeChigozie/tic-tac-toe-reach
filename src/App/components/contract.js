import React, { useState, useEffect } from "react";
export function GetContract({
  player,
  contract,
  setContract,
  stdlib,
  accountData,
  contractInfo,
  setContractInfo,
  interact,
  backend,
}) {
  const [error, setError] = useState({ status: false, message: "" });

  async function get2Contract(ct, interact) {
    let ctc = null;
    try {
      ctc = accountData.contract(backend, JSON.parse(ct));
    } catch (er) {
      if (er) {
        console.log("2 contract error", er);
        setError({ status: true, message: "invalid contract info" });
        return false;
      }
    }

    try {
      backend.Player2(ctc, interact);
      let info = await ctc.getInfo();
      console.log("game acct data", accountData);
      console.log("game contract data", info);
      setContractInfo(info);
      setContract(ctc);
    } catch (er) {
      if (er) {
        console.log("2 contract error 2", er);
        setError({ status: true, message: "contract error" });
        return false;
      }
    }
  }
  function joinContract(e) {
    e.preventDefault();
    let ctc = null;
    let ct = document.getElementById("contractInputInfo").value;
    if (ct == "") {
      setError({ status: true, message: "enter contract information" });
    }
    get2Contract(ct, interact);
  }

  return (
    <>
      {contract ? (
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
