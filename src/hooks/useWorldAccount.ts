import { useEffect, useState } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

type WorldAccount = {
  isWorld: boolean;
  address?: `0x${string}`;
  chainId?: 480; // defined by backend
};

/**
 * • Returns { isWorld:false } if we are not inside World App.
 * • Returns { isWorld:true, address, chainId:480 } when the mini-app is detected.
 */
export const useWorldAccount = (): WorldAccount => {
  const [world, setWorld] = useState<WorldAccount>({ isWorld: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const inside = MiniKit.isInstalled() && MiniKit.user;
      if (inside && mounted) {
        setWorld({
          isWorld: true,
          address: MiniKit.user!.walletAddress as `0x${string}`,
          chainId: 480,
        });
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return world;
};
