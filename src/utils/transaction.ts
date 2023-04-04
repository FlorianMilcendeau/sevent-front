import { DryRunTransactionBlockResponse, SuiObjectResponse, SuiMoveNormalizedModule } from "@mysten/sui.js";

export const getCostEstimated = ({ effects: { gasUsed } }: DryRunTransactionBlockResponse): number => {
  const { computationCost, storageCost, storageRebate } = gasUsed;

  return Number(computationCost) + Number(storageCost) + Number(storageRebate);
};

export const getTargetTransaction = (pkg: SuiObjectResponse, module: SuiMoveNormalizedModule, nameFunction: string) =>
  `${pkg.data?.objectId}::${module.name}::${nameFunction}` as const;
