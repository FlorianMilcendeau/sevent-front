import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { ReactElement, useEffect } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import { RootState } from "../store/types";
import { getEvent } from "../store/slices/event";
import ActionAreaCard from "../component/ActionAreaCard";

const Event = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { entity: events, loading } = useSelector((state: RootState) => state.event);
  const { entity: pkg } = useSelector((state: RootState) => state.package);

  useEffect(() => {
    if (!events && pkg) {
      dispatch(getEvent());
    }
  }, [dispatch, events, pkg]);

  if (loading === "pending" || loading === "idle") {
    return <CircularProgress />;
  }
  if (!events?.length) {
    return <Typography>Events not found</Typography>;
  }
  return (
    <>
      <List>
        {events.map(({ data }) => (
          <ListItem key={data?.objectId}>
            <ActionAreaCard
              title={(data as any).content.fields.title}
              description={(data as any).content.fields.description}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Event;
