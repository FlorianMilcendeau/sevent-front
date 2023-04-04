import { combineReducers } from "@reduxjs/toolkit";
import accountReducer from "./slices/account";
import providerReducer from "./slices/provider";
import packageReducer from "./slices/package";
import moduleReducer from "./slices/module";
import eventReducer from "./slices/event";

const rootReducer = combineReducers({
  account: accountReducer,
  event: eventReducer,
  module: moduleReducer,
  package: packageReducer,
  provider: providerReducer,
});

export default rootReducer;
