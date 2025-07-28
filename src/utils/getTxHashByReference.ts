import Web3 from "web3";

const LOOKBACK_BLOCKS = 3000;
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000;
const MAX_DELAY = 10000;

/** Look for the first TransferReference with your reference and return the tx hash */
export async function getTxHashByReference(
  reference,
  rpc,
  retryCount = 0
): Promise<string | null> {
  const web3 = new Web3(rpc);
  const latest = await web3.eth.getBlockNumber();

  const eventSig = web3.utils.sha3(
    "TransferReference(address,address,uint256,address,string,bool)"
  );
  const refHash = web3.utils.keccak256(reference);

  try {
    const [log] = await web3.eth.getPastLogs({
      fromBlock: Math.max(0, Number(latest) - LOOKBACK_BLOCKS),
      toBlock: "latest",
      topics: [eventSig, null, refHash],
    });

    const txHash =
      typeof log === "object" ? log?.transactionHash ?? null : null;

    if (txHash) {
      return txHash;
    }

    if (retryCount < MAX_RETRIES) {
      const delay = Math.min(
        INITIAL_DELAY * Math.pow(2, retryCount),
        MAX_DELAY
      );

      console.log(
        `No se encontró la transacción para la referencia ${reference}. Reintentando en ${delay}ms... (intento ${
          retryCount + 1
        }/${MAX_RETRIES})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return getTxHashByReference(reference, rpc, retryCount + 1);
    }

    // If we have no more attempts, return null
    console.log(
      `No se pudo encontrar la transacción para la referencia ${reference} después de ${MAX_RETRIES} intentos.`
    );
    return null;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      const delay = Math.min(
        INITIAL_DELAY * Math.pow(2, retryCount),
        MAX_DELAY
      );

      console.log(
        `Error al buscar la transacción para la referencia ${reference}: ${
          error.message
        }. Reintentando en ${delay}ms... (intento ${
          retryCount + 1
        }/${MAX_RETRIES})`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
      return getTxHashByReference(reference, rpc, retryCount + 1);
    }

    console.error(
      `Error final al buscar la transacción para la referencia ${reference}:`,
      error
    );
    throw error;
  }
}
