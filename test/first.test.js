import assert from "assert";
import path from "path";

import { it, describe, beforeEach } from "mocha";

import ganache from "ganache";
import Web3 from "web3";

import { compile } from "../src/compile";

const web3 = new Web3(ganache.provider());

let firstContract;
let accounts;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  const contractPath = path.join(process.cwd(), "contracts", "FirstContract.sol");
  const { abi, bytecode } = await compile(contractPath, "FirstContract");

  firstContract = await new web3.eth.Contract(abi)
    .deploy({ data: bytecode, arguments: [3] })
    .send({ from: accounts[0], gas: "1000000" });
});

describe("Web3 testing..", () => {
  it("should test basic values's equality", () => {
    assert.equal(1, 1);
  });

  it("should test another basic values's equality", () => {
    assert.equal(2, 2);
  });
});
