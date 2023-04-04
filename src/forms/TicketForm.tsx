import * as Yup from "yup";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Autocomplete from "@mui/material/Autocomplete";
import LoadingButton from "@mui/lab/LoadingButton";
import { useFormik } from "formik";
import { useWalletKit } from "@mysten/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js";
import { useSelector } from "react-redux";
import useId from "@mui/material/utils/useId";
import Alert from "@mui/material/Alert";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useMemo } from "react";
import { toast } from "react-toastify";
import { selectOwnedEvents } from "../store/selectors/account";
import { RootState } from "../store/types";
import { getTargetTransaction } from "../utils/transaction";

const mintTicketValidation = Yup.object().shape({
  event: Yup.object().shape({ id: Yup.string().required(), label: Yup.string().required() }).required(),
  title: Yup.string().required(),
  url: Yup.string(),
  supply: Yup.number().min(1).required(),
});

interface TicketFormProps {
  onBack: () => void;
}

const TicketForm = ({ onBack }: TicketFormProps) => {
  const { signAndExecuteTransactionBlock } = useWalletKit();
  const state = useSelector((state: RootState) => state);
  const { entity: pkg } = useSelector((state: RootState) => state.package);
  const { event: eventModule, ticket } = useSelector((state: RootState) => state.module);
  const { loading } = useSelector((state: RootState) => state.account);
  const ownedEvents = selectOwnedEvents(state);

  const listOwnerEvent = useMemo(
    () =>
      ownedEvents?.map((evt) => {
        console.log(evt);

        return (
          evt?.content?.dataType === "moveObject" && { label: evt.content.fields.title, id: evt.content.fields.id.id }
        );
      }),
    [ownedEvents]
  );

  const formik = useFormik({
    initialValues: {
      event: {} as { label: string; id: string },
      title: "",
      url: "https://ipfs.io/ipfs/bafkreibngqhl3gaa7daob4i2vccziay2jjlp435cf66vhono7nrvww53ty",
      supply: 1,
    },
    validationSchema: mintTicketValidation,
    onSubmit: async ({ title, url, supply, event }) => {
      if (!eventModule || !ticket || !event) {
        return;
      }

      const tx = new TransactionBlock();
      tx.moveCall({
        target: getTargetTransaction(pkg, ticket, "mint_to_sender"),
        arguments: [tx.pure(event.id), tx.pure(title), tx.pure(url), tx.pure(supply)],
      });

      await toast.promise(
        signAndExecuteTransactionBlock({
          transactionBlock: tx,
        }),
        {
          success: "Success",
          error: {
            render({ data }) {
              return (data as any).message;
            },
          },
        }
      );
    },
  });

  return (
    <form>
      <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
        <Alert severity="info">Please selected your event.</Alert>
        {listOwnerEvent?.length && (
          <Autocomplete
            disablePortal
            id="event"
            options={listOwnerEvent}
            fullWidth
            loading={loading === "pending"}
            onChange={(_, value) => formik.setFieldValue("event", value)}
            renderInput={(params) => (
              <TextField
                {...params}
                value={formik.values.event}
                error={formik.touched.event && Boolean(formik.errors.event)}
                helperText={formik.touched.event && formik.errors.event?.label}
                label="Event"
              />
            )}
          />
        )}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="standard"
            id="title"
            name="title"
            label="Title"
            fullWidth
            value={formik.values.title}
            onChange={formik.handleChange}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <FormControl fullWidth variant="standard">
            <InputLabel htmlFor="supply">Supply</InputLabel>
            <Input
              name="supply"
              id="supply"
              type="number"
              fullWidth
              value={formik.values.supply}
              onChange={formik.handleChange}
              error={formik.touched.supply && Boolean(formik.errors.supply)}
            />
            {formik.touched.supply && (
              <FormHelperText error={formik.touched.supply && Boolean(formik.errors.supply)}>
                {formik.errors.supply}
              </FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button component="label">
          <FileUploadOutlinedIcon sx={{ marginRight: 1 }} />
          Upload Image
          <input type="file" hidden />
        </Button>
        <ImageList sx={{ width: 500 }} cols={3} rowHeight={164}>
          {[
            <ImageListItem key={useId()}>
              <img
                style={{ borderRadius: "8px" }}
                src={`${formik.values.url}?w=164&h=164&fit=crop&auto=format`}
                srcSet={`${formik.values.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                alt=""
                loading="lazy"
              />
            </ImageListItem>,
          ]}
        </ImageList>
      </Box>
      <br />
      <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
        <Button disabled={formik.isSubmitting} fullWidth onClick={() => onBack()}>
          Back
        </Button>
        <LoadingButton
          variant="contained"
          color="primary"
          disabled={formik.isSubmitting}
          loading={formik.isSubmitting}
          loadingPosition="end"
          endIcon={<></>}
          fullWidth
          onClick={formik.submitForm}
        >
          Submit
        </LoadingButton>
      </Box>
    </form>
  );
};

export default TicketForm;
