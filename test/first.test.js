import assert from "assert";

import { it, describe, beforeEach } from "mocha";

import ganache from "ganache";
import Web3 from "web3";

const web3 = new Web3(ganache.provider());

describe("Web3 testing..", () => {
  it("should test basic values's equality", () => {
    assert.equal(1, 1);
  });

  it("should test another basic values's equality", () => {
    assert.equal(2, 2);
  });
});
