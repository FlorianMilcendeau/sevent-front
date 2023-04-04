import { useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import CalendarIcon from "@mui/icons-material/CalendarMonthOutlined";
import HistoryIcon from "@mui/icons-material/HistoryOutlined";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { ListItemButton } from "@mui/material";
import { RootState } from "../store/types";
import { useSelector } from "react-redux";
import { selectOwnedEvents } from "../store/selectors/account";
import { useWalletKit } from "@mysten/wallet-kit";
import { useAppDispatch } from "../store";
import { getEvent } from "../store/slices/event";
import { getOwnedEvent } from "../store/slices/account";

interface FixedBottomNavigationProps {
  created: ReturnType<typeof selectOwnedEvents>;
  myEvents: ReturnType<typeof selectOwnedEvents>;
  history: ReturnType<typeof selectOwnedEvents>;
}

function FixedBottomNavigation({ created }: FixedBottomNavigationProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <List>
        {created?.map(
          (event) =>
            event?.content?.dataType === "moveObject" && (
              <ListItemButton key={event.content.fields.id.id}>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src="/static/images/avatar/5.jpg" />
                </ListItemAvatar>
                <ListItemText primary={event.content.fields.title} secondary={event.content.fields.description} />
              </ListItemButton>
            )
        )}
      </List>
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction label="Created" icon={<AddBoxOutlinedIcon />} />
          <BottomNavigationAction label="My events" icon={<CalendarIcon />} />
          <BottomNavigationAction label="History" icon={<HistoryIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}

const Account = () => {
  const { currentAccount } = useWalletKit();
  const dispatch = useAppDispatch();
  const state = useSelector((state: RootState) => state);
  const { entity: pkg } = useSelector((state: RootState) => state.package);
  const ownedEvents = useMemo(() => selectOwnedEvents(state), [state]);

  useEffect(() => {
    if (currentAccount && pkg.data) {
      dispatch(getOwnedEvent(currentAccount.address));
    }
  }, [dispatch, pkg]);

  const eventsCreated = useMemo(
    () => ownedEvents?.filter((event) => !!event?.owner && event.owner.AddressOwner === currentAccount?.address),
    [currentAccount, ownedEvents]
  );

  return (
    <div>
      <FixedBottomNavigation created={eventsCreated} myEvents={ownedEvents} history={ownedEvents} />
    </div>
  );
};

export default Account;
