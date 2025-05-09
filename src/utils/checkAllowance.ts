import { readContract } from "@wagmi/core";
import { ERC20AllowanceABI } from "../utils/abis";
import { detectMultisig, sdk } from "./safeFunctions";

export const checkAllowance = async (
  spenderAddress,
  tokenAddress,
  account,
  chain,
  config,
  amount
) => {
  const maxAttempts = 10;
  const delay = 5000;
  let attempt = 0;
  let allowance = BigInt(0);
  const isMultisig = await detectMultisig();

  while (attempt < maxAttempts) {
    try {
      attempt++;

      if (isMultisig) {
        const safeInfo = await sdk.safe.getInfo();
        allowance = (await readContract(config, {
          address: tokenAddress,
          abi: ERC20AllowanceABI,
          functionName: "allowance",
          args: [safeInfo.safeAddress, spenderAddress],
          chainId: chain?.chainId,
        })) as bigint;
      } else {
        allowance = (await readContract(config, {
          address: tokenAddress,
          abi: ERC20AllowanceABI,
          functionName: "allowance",
          args: [account?.address, spenderAddress],
          chainId: chain?.chainId,
        })) as bigint;
      }

      console.log(
        `Allowance check attempt ${attempt}:`,
        `Allowance: ${allowance.toString()}, Amount: ${amount.toString()}`
      );

      if (allowance >= amount) {
        break;
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`Error on attempt ${attempt}:`, error);
      if (attempt >= maxAttempts) {
        throw new Error("Allowance check failed after maximum attempts.");
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return BigInt(allowance.toString());
};
