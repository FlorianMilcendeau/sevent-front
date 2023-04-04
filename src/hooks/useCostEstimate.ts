import { useCallback } from "react";
import { TransactionBlock } from "@mysten/sui.js";
import { getCostEstimated } from "../utils/transaction";
import { useSelector } from "react-redux";
import { RootState } from "../store/types";

const useCostEstimate = () => {
  const { entity: provider } = useSelector((state: RootState) => state.provider);

  const getCostEstimate = useCallback(
    async (tx: TransactionBlock) => {
      const txSimulate = await provider.dryRunTransactionBlock({ transactionBlock: tx.serialize() });
      console.log(txSimulate);

      return getCostEstimated(txSimulate);
    },
    [provider]
  );

  return getCostEstimate;
};

export default useCostEstimate;
