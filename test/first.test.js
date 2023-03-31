import assert from "assert";
import path from "path";

import { it, describe, before } from "mocha";

import Ganache from "ganache";
import Web3 from "web3";

import { compile } from "../src/compile";

const web3 = new Web3(Ganache.provider());

const INITIAL_VALUE = 25;

let firstContract;
let accounts;

before(async () => {
  accounts = await web3.eth.getAccounts();

  const contractPath = path.join(process.cwd(), "contracts", "FirstContract.sol");
  const { abi, bytecode } = await compile(contractPath, "FirstContract");

  firstContract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [INITIAL_VALUE] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("FirstContract testing..", () => {
  it("should deploy the FirstContract", () => {
    assert.ok(firstContract.options.address);
  });

  it("should test another initial value equality", async () => {
    const value = await firstContract.methods.myValue().call();
    assert.equal(value, INITIAL_VALUE);
  });

  it("should change the value of myVariable", async () => {
    const _resp = await firstContract.methods.setVariable(45).send({ from: accounts[0] });
    const value = await firstContract.methods.myValue().call();
    assert.equal(value, 45);
  });
});
