import { Web3 } from "web3";
import type { Log, TransactionReceipt } from "web3-types";

type WaitForReceiptOpts = {
  rpc: string;
  txHash: string;
  confirmations?: number;
  timeoutMs?: number;
  pollMs?: number;
};

export async function getTxHashByReference(
  reference: string,
  to: string,
  rpc: string,
  startBlock?: number
): Promise<string | null> {
  const web3 = new Web3(rpc);

  // window short if no startBlock is passed
  const fromBlock =
    startBlock ?? Math.max(0, Number(await web3.eth.getBlockNumber()) - 500);

  const sigString = web3.utils
    .sha3("TransferReference(address,address,uint256,address,string,bool)")!
    .toString();
  const sigBytes32 = web3.utils
    .sha3("TransferReference(address,address,uint256,address,bytes32,bool)")!
    .toString();
  const refHash = web3.utils.keccak256(reference)!.toString();

  // topic of the recipient: address padded to 32 bytes
  const recipientTopic =
    "0x" + "0".repeat(24) + to.toLowerCase().replace(/^0x/, "");

  const query = async (sig: string) => {
    const logs = (await web3.eth.getPastLogs({
      fromBlock,
      toBlock: "latest",
      topics: [sig, recipientTopic, refHash], // filter by recipient + reference
    })) as Log[];

    return logs[0]?.transactionHash?.toString() ?? null;
  };

  // try both signatures (string/bytes32 for reference)
  return (await query(sigString)) ?? (await query(sigBytes32));
}

export async function waitForReceipt({
  rpc,
  txHash,
  confirmations = 1,
  timeoutMs = 60_000,
  pollMs = 1_500,
}: WaitForReceiptOpts): Promise<boolean> {
  const web3 = new Web3(rpc);
  const start = Date.now();

  let receipt: TransactionReceipt | null = null;

  while (Date.now() - start < timeoutMs) {
    try {
      receipt = await web3.eth.getTransactionReceipt(txHash);
    } catch (e: any) {
      // Some public RPCs may return 409/429 in bursts; wait and retry
      await new Promise((r) => setTimeout(r, 1000));
    }

    if (receipt && receipt.blockNumber != null) {
      if (confirmations <= 1) {
        return Boolean(receipt.status);
      }
      // Wait for additional confirmations
      const current = Number(await web3.eth.getBlockNumber());
      if (current - Number(receipt.blockNumber) + 1 >= confirmations) {
        return Boolean(receipt.status);
      }
    }

    await new Promise((r) => setTimeout(r, pollMs));
  }

  throw new Error("Timeout waiting for transaction receipt");
}
