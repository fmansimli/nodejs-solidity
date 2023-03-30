import fs from "fs/promises";
import solc from "solc";

export const compile = async (url, name) => {
  const source = await fs.readFile(url, "utf8");
  const input = {
    language: "Solidity",
    sources: { [`${name}.sol`]: { content: source } },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const abi = output.contracts[`${name}.sol`][name].abi;
  const bytecode = output.contracts[`${name}.sol`][name].evm.bytecode.object;

  return { abi, bytecode };
};
