import { readContract } from "@wagmi/core";
import { ERC20AllowanceABI } from "../utils/abis";

export const checkAllowance = async (
  spenderAddress,
  tokenAddress,
  account,
  chain,
  config
) => {
  const allowance = await readContract(config,{
    address: tokenAddress,
    abi: ERC20AllowanceABI,
    functionName: "allowance",
    args: [account?.address, spenderAddress],
    chainId: chain?.id,
  });

  return BigInt(allowance.toString());
};