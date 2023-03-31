import path from "path";
import Web3 from "web3";

import HDWalletProvider from "@truffle/hdwallet-provider";

import { compile } from "./compile";

const contractPath = path.join(process.cwd(), "contracts", "FirstContract.sol");
const { abi, bytecode } = await compile(contractPath, "FirstContract");

const provider = new HDWalletProvider("mnumanic", "url from infura");
const web3 = new Web3(provider);

export const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  const resp = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [100] })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(resp.options.address);
  provider.engine.stop();
};
