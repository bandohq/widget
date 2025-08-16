import { Web3 } from "web3";
import type { Log } from "web3-types";
import { RetryConfig, RetryPresets, retryWithBackoff } from "./retryUtils";

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
        console.warn(`Intento ${attempt}/${maxAttempts} falló:`, error.message);
        if (error.message.includes("network")) {
          console.log("Error de red detectado, continuando con reintentos...");
        }
      } else {
        console.log(
          `Intento ${attempt}/${maxAttempts}: No se encontró transacción, reintentando...`
        );
      }
    }
  );

  if (result.success) {
    return result.data;
  } else {
    console.warn(
      `couldn't find tx hash for reference: ${reference} after ${result.totalTime}ms`
    );
    if (result.lastError) {
      console.error("last error:", result.lastError);
    }
    return null;
  }
}
