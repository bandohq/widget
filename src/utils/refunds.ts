import { writeContract } from "@wagmi/core";

export const executeRefund = async ({
  config,
  chain,
  contractAddress,
  abiName,
  abi,
  functionName,
  args,
  accountAddress,
}) => {
  try {
    const contractABI = abi.find((item) => item.name === abiName);

    if (!contractABI) {
      throw new Error(`ABI for function ${abiName} not found`);
    }

    await writeContract(config, {
      address: contractAddress,
      abi: [contractABI],
      functionName,
      args,
      chain,
      account: accountAddress,
    });
  } catch (error) {
    console.error(error);
  }
};

const REFUND_CODE = 2;
export const isRefundAvailable = (transactionId, refunds) => {
  return refunds.find(
    (refund) => refund.id === transactionId && refund.txStatus === REFUND_CODE
  );
};

