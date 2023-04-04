import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../types";

const accountState = (state: RootState) => state.account;

export const selectOwnedEvents = createSelector(accountState, (account) => {
  return account.events?.map((event) => {
    console.log(event);

    if (
      event.data &&
      event.data.content?.dataType === "moveObject" &&
      typeof event.data.owner === "object" &&
      "AddressOwner" in event.data.owner
    ) {
      return event.data;
    }
  });
});
