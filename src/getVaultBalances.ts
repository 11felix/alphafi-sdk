import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import {
  AlphaVaultBalance,
  DoubleAssetVaultBalance,
  PoolName,
  SingleAssetVaultBalance,
} from "./common/types";
import {
  getAlphaPortfolioAmount,
  getAlphaPortfolioAmountInUSD,
  getPortfolioAmount,
  getPortfolioAmountInUSD,
  getSingleAssetPortfolioAmount,
  getSingleAssetPortfolioAmountInUSD,
} from "./portfolioAmount";
import { poolInfo } from "./common/maps";

export async function getAlphaVaultBalance(
  address: string,
): Promise<AlphaVaultBalance | undefined> {
  const suiClient = new SuiClient({
    url: getFullnodeUrl("mainnet"),
  });
  if (address) {
    const lockedPortfolioAmount = await getAlphaPortfolioAmount("ALPHA", {
      suiClient,
      address,
      isLocked: true,
    });
    const lockedPortfolioAmountInUSD = await getAlphaPortfolioAmountInUSD(
      "ALPHA",
      { suiClient, address, isLocked: true },
    );
    const unlockedPortfolioAmount = await getAlphaPortfolioAmount("ALPHA", {
      suiClient,
      address,
      isLocked: false,
    });
    const unlockedPortfolioAmountInUSD = await getAlphaPortfolioAmountInUSD(
      "ALPHA",
      { suiClient, address, isLocked: false },
    );
    const portfolioAmount = await getAlphaPortfolioAmount("ALPHA", {
      suiClient,
      address,
    });
    const portfolioAmountInUSD = await getAlphaPortfolioAmountInUSD("ALPHA", {
      suiClient,
      address,
    });
    if (
      lockedPortfolioAmount !== undefined &&
      lockedPortfolioAmountInUSD !== undefined &&
      unlockedPortfolioAmount !== undefined &&
      unlockedPortfolioAmountInUSD !== undefined &&
      portfolioAmount !== undefined &&
      portfolioAmountInUSD !== undefined
    ) {
      const res: AlphaVaultBalance = {
        lockedAlphaCoins: lockedPortfolioAmount,
        lockedAlphaCoinsInUSD: lockedPortfolioAmountInUSD,
        unlockedAlphaCoins: unlockedPortfolioAmount,
        unlockedAlphaCoinsInUSD: unlockedPortfolioAmountInUSD,
        totalAlphaCoins: portfolioAmount,
        totalAlphaCoinsInUSD: portfolioAmountInUSD,
      };
      return res;
    }
  }
  return undefined;
}

export async function getDoubleAssetVaultBalance(
  address: string,
  poolName: PoolName,
): Promise<DoubleAssetVaultBalance | undefined> {
  const suiClient = new SuiClient({
    url: getFullnodeUrl("mainnet"),
  });
  if (address && poolName) {
    if (poolInfo[poolName].parentProtocolName === "CETUS") {
      const portfolioAmount = await getPortfolioAmount(poolName, {
        suiClient,
        address,
      });
      const portfolioAmountInUSD = await getPortfolioAmountInUSD(poolName, {
        suiClient,
        address,
      });
      if (portfolioAmount !== undefined && portfolioAmountInUSD !== undefined) {
        const res: DoubleAssetVaultBalance = {
          coinA: portfolioAmount[0].toString(),
          coinB: portfolioAmount[1].toString(),
          valueInUSD: portfolioAmountInUSD,
        };
        return res;
      }
    }
  }
}

export async function getSingleAssetVaultBalance(
  address: string,
  poolName: PoolName,
): Promise<SingleAssetVaultBalance | undefined> {
  const suiClient = new SuiClient({
    url: getFullnodeUrl("mainnet"),
  });

  if (address && poolName) {
    if (
      poolInfo[poolName].parentProtocolName === "ALPHAFI" ||
      poolInfo[poolName].parentProtocolName === "NAVI"
    ) {
      const portfolioAmount = await getSingleAssetPortfolioAmount(poolName, {
        suiClient,
        address,
      });
      const portfolioAmountInUSD = await getSingleAssetPortfolioAmountInUSD(
        poolName,
        {
          suiClient,
          address,
        },
      );
      if (portfolioAmount !== undefined && portfolioAmountInUSD !== undefined) {
        const res: SingleAssetVaultBalance = {
          coin: portfolioAmount.toString(),
          valueInUSD: portfolioAmountInUSD,
        };
        return res;
      }
    }
  }
}