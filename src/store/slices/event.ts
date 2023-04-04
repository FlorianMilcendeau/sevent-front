import { SuiTransactionBlockResponse, JsonRpcProvider, SuiObjectResponse } from "@mysten/sui.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AsyncThunkConfig } from "../types";

type ModuleState = {
  loading: "idle" | "pending" | "success" | "failed";
} & { entity: SuiObjectResponse[] | undefined };

const initialState: ModuleState = {
  loading: "idle",
} as ModuleState;

export const getEvent = createAsyncThunk<SuiObjectResponse[], undefined, AsyncThunkConfig>(
  "event/getEvent",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();

    const provider: JsonRpcProvider = state.provider.entity;
    const pkg: SuiObjectResponse = state.package.entity;

    const tx = await provider.queryTransactionBlocks({
      filter: {
        MoveFunction: {
          package: pkg.data?.objectId as string,
          module: "event",
          function: "create_event",
        },
      },
    });

    const txsDetail = await Promise.all(
      tx.data.map(async ({ digest }) => await provider.getTransactionBlock({ digest, options: { showEffects: true } }))
    );
    const txsDetailSuccess = txsDetail.filter(
      ({ effects }) => effects?.status.status === "success" && effects.created?.length
    );

    return await Promise.all(
      txsDetailSuccess.map(
        async (tx) =>
          await provider.getObject({
            id: (tx.effects?.created as NonNullable<NonNullable<SuiTransactionBlockResponse["effects"]>["created"]>)[0]
              .reference.objectId,
            options: { showContent: true },
          })
      )
    );
  }
);

const moduleSlice = createSlice({
  name: "event",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getEvent.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getEvent.fulfilled, (state, { payload }) => {
      state.entity = payload;
      state.loading = "success";
    });
    builder.addCase(getEvent.rejected, (state, { payload }) => {
      console.error(payload);
      state.loading = "failed";
    });
  },
});

export default moduleSlice.reducer;
