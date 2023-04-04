import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import rootReducer from "./rootReducer";
import type { AppDispatch } from "./types";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ["wallet/setWallet"],
        // Ignore these field paths in all actions
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["provider.entity"],
      },
    }),
});

export const useAppDispatch: () => AppDispatch = useDispatch; // Export a hook that can be reused to resolve types

export default store;
