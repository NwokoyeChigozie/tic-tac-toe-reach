export async function GetAlgoTestNetAccount(stdlib) {
  let acc = await stdlib.newTestAccount(stdlib.parseCurrency(1000));
  return acc;
}
export async function GetAccBalance(stdlib, acc) {
  let bal = await stdlib.balanceOf(acc);
  bal = stdlib.formatCurrency(bal, 4);
  return `${bal}`;
}

export function setAccountInfo(
  env,
  acctData,
  acctBal,
  acctAddr,
  setAccountData,
  setAccountbal,
  setAccountAddr
) {
  setAccountData(acctData);
  setAccountbal(acctBal);
  setAccountAddr(acctAddr);
  localStorage.setItem("acc", JSON.stringify(acctData));
  localStorage.setItem("env", JSON.stringify(env));
}
