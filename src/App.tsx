import "dayjs/locale/fr";
import { useMemo } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { WalletKitProvider } from "@mysten/wallet-kit";
import { ToastContainer } from "react-toastify";

import store from "./store";
import Root from "./routes/Root";
import Event from "./routes/Event";
import Create from "./routes/Create";
import MarketPlace from "./routes/MarketPlace";
import { theme } from "./styles/theme";
import Account from "./routes/Account";

import "./App.css";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "events",
        element: <Event />,
        children: [
          {
            path: ":idEvent",
          },
        ],
      },
      {
        path: "create",
        element: <Create />,
      },
      {
        path: "marketplace",
        element: <MarketPlace />,
        children: [
          {
            path: "buy",
            element: <></>,
          },
        ],
      },
    ],
  },
]);

function App() {
  const language = useMemo(() => window.navigator.language.split("-").at(0), []);
  return (
    <div className="App">
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={language}>
            <CssBaseline />
            <WalletKitProvider>
              <RouterProvider router={router} />
              <ToastContainer position="bottom-right" theme="colored" role="alert" />
            </WalletKitProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </Provider>
    </div>
  );
}

export default App;
