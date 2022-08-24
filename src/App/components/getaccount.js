import React, { useState, useEffect } from "react";
import { GetAccBalance, setAccountInfo } from "../actions/getaccount";
export function SecretKeyForm({
  environment,
  accountData,
  stdlib,
  setAccountData,
  setAccountbal,
  setAccountAddr,
}) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState({ status: false, message: "" });

  async function getAccountFromSecret(secret) {
    try {
      let acc = await stdlib.newAccountFromMnemonic(secret);
      let bal = await GetAccBalance(stdlib, acc);
      let addr = stdlib.formatAddress(acc);
      setAccountInfo(
        "prod",
        acc,
        bal,
        addr,
        setAccountData,
        setAccountbal,
        setAccountAddr
      );
    } catch (err) {
      if (err) {
        setError({ status: true, message: "Incorrect Secret Key" });
      }
      console.log(err);
    }
  }
  async function getAccountFromPhrase(secret) {
    try {
      let acc = await stdlib.newAccountFromMnemonic(secret);
      let bal = await GetAccBalance(stdlib, acc);
      let addr = stdlib.formatAddress(acc);
      setAccountInfo(
        "prod",
        acc,
        bal,
        addr,
        setAccountData,
        setAccountbal,
        setAccountAddr
      );
    } catch (err) {
      if (err) {
        setError({ status: true, message: "Incorrect Mnemonic Phrase" });
      }
      console.log(err);
    }
  }
  function connectWallet(e) {
    e.preventDefault();
    setProcessing(true);
    let typeC = document.getElementById("secret-key-type").value;
    let secretorphrase = document.getElementById("secret-key").value;
    if (typeC == "") {
      setError({ status: true, message: "Please select method" });
      setProcessing(false);
      return false;
    } else if (typeC == "secret") {
      getAccountFromSecret(secretorphrase);
    } else if (typeC == "phrase") {
      getAccountFromPhrase(secretorphrase);
    }
    setProcessing(false);
  }
  return (
    <div
      className={
        environment == "production" && !accountData
          ? "screen center"
          : "screen center hidden"
      }
    >
      <h4>Enter Your Account Secret or Mnemonic Phrase!</h4>
      <select id="secret-key-type" className="secretSelect">
        <option value="">Select Method</option>
        <option value="secret">Secret Key</option>
        <option value="phrase">Mnemonic Phrase</option>
      </select>
      <input type="text" id="secret-key" className="secretInput"></input>
      <button
        type="button"
        id="connect-to-mainnet"
        onClick={(e) => connectWallet(e)}
      >
        {processing ? "connecting account" : "Connect Account"}
      </button>
      {error.status ? <p className="secret-error">{error.message}</p> : <></>}
    </div>
  );
}
