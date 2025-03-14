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
    throw new Error(`Contract write failed: ${error.message}`);
  }
};

const REFOUND_CODE = 3;
export const isRefundAvailable = (transactionId, refunds) => {
  return refunds.some(
    (refund) => refund.id === transactionId && refund.txStatus === REFOUND_CODE
  );
};
