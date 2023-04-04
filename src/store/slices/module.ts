import { SuiMoveNormalizedModule, JsonRpcProvider, SuiObjectResponse } from "@mysten/sui.js";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AsyncThunkConfig } from "../types";

type ModuleState = {
  loading: "idle" | "pending" | "success" | "failed";
} & { [module: string]: SuiMoveNormalizedModule | undefined };

const initialState: ModuleState = {
  loading: "idle",
} as ModuleState;

export const getModule = createAsyncThunk<SuiMoveNormalizedModule, string, AsyncThunkConfig>(
  "module/getModule",
  async (moduleName, thunkAPI) => {
    const state = thunkAPI.getState();

    const provider: JsonRpcProvider = state.provider.entity;
    const pkg: SuiObjectResponse = state.package.entity;

    return await provider.getNormalizedMoveModule({ package: pkg.data?.objectId ?? "", module: moduleName });
  }
);

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getModule.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(getModule.fulfilled, (state, { payload }) => {
      state[payload.name] = payload;
      state.loading = "success";
    });
    builder.addCase(getModule.rejected, (state, { payload }) => {
      console.error(payload);
      state.loading = "failed";
    });
  },
});

export default moduleSlice.reducer;
