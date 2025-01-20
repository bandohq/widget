import { readContract } from "@wagmi/core";
import FulfillableRegistry from "@bandohq/contract-abis/abis/FulfillableRegistryV1.json";

export const validateReference = async (chain, serviceID, referenceCode, config) => {
  const FulfillableRegistryABI = FulfillableRegistry.abi.find(
    (item) => item.name === "isRefValid"
  );

  const maxAttempts = 360;
  let attempt = 0;
  let isValid = false;

  while (attempt < maxAttempts) {
    try {
      attempt++;
      isValid = await readContract(config, {
        address: chain?.protocol_contracts?.FulfillableRegistryProxy,
        abi: [FulfillableRegistryABI],
        functionName: "isRefValid",
        args: [serviceID, referenceCode],
        chainId: chain?.id,
      }) as boolean;

      if (isValid) {
        break;
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000)); 
      }
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw new Error("Validation failed after maximum attempts.");
      }
      await new Promise((resolve) => setTimeout(resolve, 5000)); 
    }
  }

  return isValid;
};
