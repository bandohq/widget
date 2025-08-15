import { Web3 } from "web3";
import type { Log } from "web3-types";

export async function getTxHashByReference(
  reference: string,
  to: string,
  rpc: string,
  startBlock?: number
): Promise<string | null> {
  const web3 = new Web3(rpc);

  // window if no startBlock is passed
  const fromBlock =
    startBlock ?? Math.max(0, Number(await web3.eth.getBlockNumber()) - 2000);

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
