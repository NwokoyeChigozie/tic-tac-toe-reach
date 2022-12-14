import "./App.css";
import React, { useState, useEffect } from "react";
import { ENVIRONMENT } from "../env";
import { loadStdlib, ask } from "@reach-sh/stdlib";
import * as backend from "../build/index.main.mjs";
import { GetAlgoTestNetAccount, GetAccBalance } from "./actions/getaccount";
import { SecretKeyForm } from "./components/getaccount";
import { Top } from "./components/top";
import { Game } from "./components/game";
const stdlib = loadStdlib(process.env);

function App() {
  const environment = ENVIRONMENT;
  const [accountData, setAccountData] = useState();
  const [accountbal, setAccountbal] = useState("");
  const [accountAddr, setAccountAddr] = useState("");
  const envD = JSON.parse(localStorage.getItem("env"));

  async function _devAccountInfo(stdlib) {
    let acc = await GetAlgoTestNetAccount(stdlib);
    console.log("here1", acc);
    let bal = await GetAccBalance(stdlib, acc);
    let addr = stdlib.formatAddress(acc);

    console.log("here2", bal);
    localStorage.setItem("acc", JSON.stringify(acc));
    localStorage.setItem("env", JSON.stringify("dev"));
    setAccountData(acc);
    setAccountbal(bal);
    setAccountAddr(addr);
  }

  async function _getFBalanceInfo(stdlib, acc) {
    console.log("bal here");
    let bal = await GetAccBalance(stdlib, acc);
    let addr = stdlib.formatAddress(acc);
    let accItems = await stdlib.connectAccount(acc.networkAccount);
    setAccountData(accItems);
    setAccountbal(bal);
    setAccountAddr(addr);
  }
  async function _clearStorageRef() {
    localStorage.removeItem("acc");
    localStorage.removeItem("env");
  }
  async function setActualAccount() {
    accountData = await stdlib.connectAccount(accountData.networkAccount);
  }

  useEffect(() => {
    if (
      (envD == "dev" && environment == "production") ||
      (envD == "prod" && environment != "production")
    ) {
      _clearStorageRef();
    }
    let accItems = JSON.parse(localStorage.getItem("acc"));
    console.log("stored", accItems);
    if (accItems) {
      _getFBalanceInfo(stdlib, accItems);
    }

    if (environment != "production" && !accountData && !accItems) {
      _devAccountInfo(stdlib);
    }
  }, []);

  return (
    <>
      <Top
        environment={environment}
        accountbal={accountbal}
        accountAddr={accountAddr}
        setAccountData={setAccountData}
        setAccountbal={setAccountbal}
        setAccountAddr={setAccountAddr}
      ></Top>
      <SecretKeyForm
        environment={environment}
        accountData={accountData}
        stdlib={stdlib}
        setAccountData={setAccountData}
        setAccountbal={setAccountbal}
        setAccountAddr={setAccountAddr}
      ></SecretKeyForm>
      {!accountAddr ? (
        <></>
      ) : (
        <Game
          stdlib={stdlib}
          environment={environment}
          accountbal={accountbal}
          accountAddr={accountAddr}
          setAccountData={setAccountData}
          setAccountbal={setAccountbal}
          setAccountAddr={setAccountAddr}
          accountData={accountData}
          backend={backend}
        ></Game>
      )}
    </>
  );
}

export default App;
