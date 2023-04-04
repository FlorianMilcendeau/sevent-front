import { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

import AppBar from "../component/AppBar";
import { useAppDispatch } from "../store";
import { getPackageById } from "../store/slices/package";
import { RootState } from "../store/types";

const Root = (): ReactElement => {
  const { REACT_APP_CONTRACT_ID = "" } = process.env;
  const dispatch = useAppDispatch();
  const { entity: pkg } = useSelector((state: RootState) => state.package);

  useEffect(() => {
    if (!pkg.data) {
      dispatch(getPackageById(REACT_APP_CONTRACT_ID));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [REACT_APP_CONTRACT_ID, dispatch]);

  return (
    <>
      <AppBar />
      <Outlet />
    </>
  );
};

export default Root;
