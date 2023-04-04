import { Typography } from "@mui/material";
import { ReactElement } from "react";
import { Outlet } from "react-router-dom";

const MarketPlace = (): ReactElement => {
  return (
    <>
      <Typography>Marketplace</Typography>
      <Outlet />
    </>
  );
};

export default MarketPlace;
