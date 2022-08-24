export function Top({
  environment,
  accountbal,
  accountAddr,
  setAccountData,
  setAccountbal,
  setAccountAddr,
}) {
  function removeAccount(e) {
    e.preventDefault();
    console.log("logging out");
    localStorage.removeItem("acc");
    localStorage.removeItem("env");
    setAccountData();
    setAccountbal("");
    setAccountAddr("");
  }
  return (
    <>
      <h1 className="hss">Welcome To Budget Tic Tac Toe</h1>
      <div id="intro-screen" className="brief center">
        <h4>
          BlockChain: Algo {environment == "production" ? "Mainnet" : "Devnet"}
        </h4>
        <h4>Your Balance: {accountbal ? accountbal : 0} Algo</h4>
      </div>
      {!accountAddr ? (
        <></>
      ) : (
        <div className="hss center">
          <div className="briefAddr center">
            <h5>Connected Address:</h5>
            <a id="newAddr" href="#" onClick={(e) => removeAccount(e)}>
              {environment == "production" ? "disconnect" : "new account"}
            </a>
          </div>
          <h5>{accountAddr}</h5>
        </div>
      )}
    </>
  );
}
