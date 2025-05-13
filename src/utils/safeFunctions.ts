import SafeAppsSDK from "@safe-global/safe-apps-sdk";
import { encodeFunctionData } from "viem";

export const sdk = new SafeAppsSDK();

export const detectMultisig = async (): Promise<boolean> => {
  try {
    const info = await Promise.race([
      sdk.safe.getInfo(),
      new Promise<undefined>((res) => setTimeout(res, 300)),
    ]);
    return !!info?.safeAddress;
  } catch {
    return false;
  }
};

export const sendViaSafe = async ({
  to,
  abi,
  functionName,
  args,
  value = "0",
}) => {
  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  const response = await sdk.txs.send({
    txs: [{ to, value, data }],
  });

  return response;
};

export const sendBatchViaSafe = async (transactions) => {
  const txs = transactions.map(
    ({ to, abi, functionName, args, value = "0" }) => {
      const data = encodeFunctionData({
        abi,
        functionName,
        args,
      });

      return { to, value, data };
    }
  );

  const response = await sdk.txs.send({ txs });

  return response;
};
