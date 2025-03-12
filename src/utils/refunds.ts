import { readContract, writeContract } from "@wagmi/core";
import BandoERC20FulfillableV1 from "@bandohq/contract-abis/abis/BandoERC20FulfillableV1.json";

export const fetchRefunds = async (transactions, config, chain, address) => {
  const possibleRefunds = transactions.filter(
    (transaction) => transaction.status === "FAILED"
  );

  const refundPromises = possibleRefunds.map(async (transaction) => {
    const FulfillableRegistryABI = BandoERC20FulfillableV1.abi.find(
      (item) => item.name === "getERC20RefundsFor"
    );

    const refundAmount = await readContract(config, {
      address: chain?.protocolContracts?.BandoERC20FulfillableProxy,
      abi: [FulfillableRegistryABI],
      functionName: "getERC20RefundsFor",
      args: [transaction.tokenUsed, address, transaction.serviceId],
      chainId: chain?.chainId,
    });

    return { id: transaction.id, amount: refundAmount as BigInt };
  });

  const refundsArray = await Promise.all(refundPromises);

  return refundsArray;
};

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

export const isRefundAvailable = (transactionId, refunds) => {
  return refunds.some(
    (refund) => refund.id === transactionId && refund.amount > 0
  );
};
