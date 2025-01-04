import { Contract } from "ethers";

export async function multicall(
  contract: Contract,
  method: string,
  calls: any[][]
) {
  const promises = calls.map((args) => contract[method](...args));
  return Promise.all(promises);
}

export async function batchedMulticall(
  contract: Contract,
  method: string,
  calls: any[][],
  batchSize = 100
) {
  const results = [];
  for (let i = 0; i < calls.length; i += batchSize) {
    const batch = calls.slice(i, i + batchSize);
    const batchResults = await multicall(contract, method, batch);
    results.push(...batchResults);
  }
  return results;
}
