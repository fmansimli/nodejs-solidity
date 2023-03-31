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

  it("should allow one account to enter", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await lottery.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.equal(accounts[0], players[0]);
    assert.equal(1, players.length);
  });

  it("should require a minimum amount to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: web3.utils.toWei("0.001", "ether"),
      });
      assert(false);
    } catch (error) {
      assert(error);
    }

    assert.equal(1, players.length);
  });

  it("should only allow the manager to call 'pickWinner'", async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }

    assert.equal(1, players.length);
  });

  it("should send money to the winner and reset thr players array", async () => {
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const difference = finalBalance - initialBalance;

    assert(difference > web3.utils.toWei("1.8", "ether"));
  });
});
