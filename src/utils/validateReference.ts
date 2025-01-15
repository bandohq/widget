import { readContract } from "@wagmi/core";
import FulfillableRegistry from "@bandohq/contract-abis/abis/FulfillableRegistryV1.json";

export const validateReference = async (chain, serviceID, referenceCode, config) => {
  const FulfillableRegistryABI = FulfillableRegistry.abi.find(
    (item) => item.name === "isRefValid"
  );

  const isValid = await readContract(config, {
    address: chain?.protocol_contracts?.FulfillableRegistryProxy,
    abi: [FulfillableRegistryABI],
    functionName: "isRefValid",
    args: [serviceID, referenceCode ],
    chainId: chain?.chain_id,
  }) as boolean;

  return isValid;
};