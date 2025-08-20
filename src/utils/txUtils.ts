import { Web3 } from "web3";
import type { Log } from "web3-types";
import { RetryConfig, RetryPresets, retryWithBackoff } from "./retryUtils";

type WaitForReceiptOpts = {
  rpc: string;
  txHash: string;
  confirmations?: number;
  retryConfig: RetryConfig;
};

export async function getTxHashByReference(
  reference: string,
  to: string,
  rpc: string,
  startBlock?: number,
  retryConfig?: RetryConfig
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
    try {
      const logs = (await web3.eth.getPastLogs({
        fromBlock,
        toBlock: "latest",
        topics: [sig, recipientTopic, refHash], // filter by recipient + reference
      })) as Log[];

      return logs[0]?.transactionHash?.toString() ?? null;
    } catch (error) {
      // throw error to be handled by the retry system
      throw error;
    }
  };

  const operation = async (): Promise<string | null> => {
    // try both signatures (string/bytes32 for reference)
    return (await query(sigString)) ?? (await query(sigBytes32));
  };

  // Usar configuración predefinida para blockchain con opción de override
  const finalConfig = { ...RetryPresets.blockchain, ...retryConfig };

  const result = await retryWithBackoff(
    operation,
    finalConfig,
    (attempt, maxAttempts, error) => {
      if (error) {
        if (error.message.includes("network")) {
          console.log("Error de red detectado, continuando con reintentos...");
        }
      }
    }
  );

  if (result.success) {
    return result.data;
  } else {
    if (result.lastError) {
      console.error("last error:", result.lastError);
    }
    return null;
  }
}

export async function waitForReceipt({
  rpc,
  txHash,
  confirmations = 1,
  retryConfig,
}: WaitForReceiptOpts): Promise<boolean> {
  const web3 = new Web3(rpc);

  const checkReceipt = async (): Promise<boolean | null> => {
    try {
      const receipt = await web3.eth.getTransactionReceipt(txHash);

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

      // Receipt not found or not enough confirmations yet
      return null;
    } catch (error) {
      // Some public RPCs may return 409/429 in bursts; throw to trigger retry
      throw error;
    }
  };

  const result = await retryWithBackoff(
    checkReceipt,
    retryConfig,
    (attempt, maxAttempts, error) => {
      if (error) {
        console.warn(
          `Receipt check attempt ${attempt}/${maxAttempts} failed:`,
          error.message
        );
      }
    }
  );

  if (result.success) {
    return result.data;
  } else {
    console.error(
      `Timeout waiting for transaction receipt after ${result.attempts} attempts in ${result.totalTime}ms`
    );
    throw new Error("Timeout waiting for transaction receipt");
  }
}
