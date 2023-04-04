import { JsonRpcProvider, SuiObjectResponse } from "@mysten/sui.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AsyncThunkConfig } from "../types";

export interface AccountState {
  loading: "idle" | "pending" | "success" | "failed";
  events: SuiObjectResponse[] | undefined;
}

const initialState: AccountState = {
  loading: "idle",
} as AccountState;

export const getOwnedEvent = createAsyncThunk<SuiObjectResponse[], string, AsyncThunkConfig>(
  "account/getOwnedEvent",
  async (address: string, thunkAPI) => {
    const state = thunkAPI.getState();

    const provider: JsonRpcProvider = state.provider.entity;

    const objects = await provider.getOwnedObjects({ owner: address, options: { showType: true } });

    const objectsId = objects.data
      .filter(({ data }) => data?.type === `${process.env.REACT_APP_CONTRACT_ID}::event::Event`)
      .map(({ data }) => data?.objectId);

    return await Promise.all(
      objectsId.map(
        async (id) => id && (await provider.getObject({ id, options: { showContent: true, showOwner: true } }))
      )
    );
  }
);

const moduleSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOwnedEvent.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getOwnedEvent.fulfilled, (state, { payload }) => {
      state.events = payload;
      state.loading = "success";
    });
    builder.addCase(getOwnedEvent.rejected, (state, { payload }) => {
      console.error(payload);
      state.loading = "failed";
    });
  },
});

export default moduleSlice.reducer;
