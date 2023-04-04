import { SuiObjectResponse } from "@mysten/sui.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AsyncThunkConfig } from "../types";

type PackageState = {
  entity: SuiObjectResponse;
  loading: "idle" | "pending" | "success" | "failed";
};

const initialState: PackageState = {
  entity: {} as SuiObjectResponse,
  loading: "idle",
};

export const getPackageById = createAsyncThunk<SuiObjectResponse, string, AsyncThunkConfig>(
  "package/getPackageById",
  async (id, thunkAPI) => {
    const state = thunkAPI.getState();

    const provider = state.provider.entity;

    return await provider.getObject({ id });
  }
);

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPackageById.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getPackageById.fulfilled, (state, { payload }) => {
      state.entity = payload;
      state.loading = "success";
    });
    builder.addCase(getPackageById.rejected, (state, { payload }) => {
      console.error(payload);
      state.loading = "failed";
    });
  },
});

export default packageSlice.reducer;
