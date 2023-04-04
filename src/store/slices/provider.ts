import { JsonRpcProvider, devnetConnection } from "@mysten/sui.js";
import { createSlice } from "@reduxjs/toolkit";

type ProviderState = {
  entity: JsonRpcProvider;
  loading: "idle" | "pending" | "success" | "failed";
};

const initialState: ProviderState = {
  entity: new JsonRpcProvider(devnetConnection),
  loading: "idle",
};

const providerSlice = createSlice({
  name: "provider",
  initialState,
  reducers: {},
});

export default providerSlice.reducer;
