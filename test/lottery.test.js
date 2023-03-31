import assert from "assert";
import path from "path";
import Web3 from "web3";
import Ganache from "ganache";

import { it, before, describe } from "mocha";

import { compile } from "@src/compile";

const web3 = new Web3(Ganache.provider());

let accounts;
let lottery;

before(async () => {
  accounts = await web3.eth.getAccounts();

  const pathToContract = path.join(process.cwd(), "contracts", "Lottery.sol");
  const { abi, bytecode } = await compile(pathToContract, "Lottery");

  lottery = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Lottery contract testing...", () => {
  it("should deploy the contract", () => {
    assert.ok(lottery.options.address);
  });

  it("should check the address of the manager", async () => {
    const manager = await lottery.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });
});
