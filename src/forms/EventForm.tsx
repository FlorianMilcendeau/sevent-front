import * as Yup from "yup";
import Box from "@mui/material/Box";
import { DateTimePicker } from "@mui/x-date-pickers";
import LoadingButton from "@mui/lab/LoadingButton";
import { TransactionBlock } from "@mysten/sui.js";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import { useWalletKit } from "@mysten/wallet-kit";
import { toast } from "react-toastify";
import { getTargetTransaction } from "../utils/transaction";
import type { RootState } from "../store/types";

const createEventValidation = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().min(2, "Too Short!").required("Required"),
  startDate: Yup.date().min(dayjs(), "Start date must be later than now").required(),
  endDate: Yup.date().required(),
});

interface EventFormProps {
  onNext: () => void;
}

const EventForm = ({ onNext }: EventFormProps) => {
  const { signAndExecuteTransactionBlock, currentAccount } = useWalletKit();
  const { entity: pkg } = useSelector((state: RootState) => state.package);
  const { event } = useSelector((state: RootState) => state.module);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      startDate: dayjs(),
      endDate: dayjs(),
    },
    validationSchema: createEventValidation,
    onSubmit: async ({ title, description, startDate, endDate }) => {
      if (!event || !currentAccount) {
        return;
      }

      const tx = new TransactionBlock();
      tx.moveCall({
        target: getTargetTransaction(pkg, event, "create_event"),
        arguments: [
          tx.pure(title),
          tx.pure(description),
          tx.pure("Coming"),
          tx.pure(dayjs(startDate).unix().toString()),
          tx.pure(dayjs(endDate).unix().toString()),
        ],
      });

      await toast.promise(signAndExecuteTransactionBlock({ transactionBlock: tx }), {
        success: "Success",
        error: {
          render({ data }) {
            return (data as any).message;
          },
        },
      });

      onNext();
    },
  });

  return (
    <form>
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          variant="standard"
          fullWidth
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          variant="standard"
          fullWidth
          name="description"
          label="Description"
          multiline
          maxRows={4}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <DateTimePicker
          label="Start date"
          renderInput={(props) => (
            <TextField
              id="startDate"
              name="startDate"
              {...props}
              error={formik.touched.startDate && Boolean(formik.errors.startDate)}
              helperText={<>{formik.touched.startDate && formik.errors.startDate}</>}
            />
          )}
          value={formik.values.startDate}
          onChange={async (value) => {
            formik.setFieldValue("startDate", value?.toDate());
            formik.setErrors({ startDate: "Error" });
          }}
        />
        <DateTimePicker
          label="End date"
          renderInput={(props) => (
            <TextField
              id="endDate"
              name="endDate"
              {...props}
              error={formik.touched.endDate && Boolean(formik.errors.endDate)}
              helperText={<>{formik.touched.endDate && formik.errors.endDate}</>}
            />
          )}
          value={formik.values.endDate}
          onChange={(value) => formik.setFieldValue("endDate", value?.toDate())}
        />
      </Box>
      <br />
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
    </form>
  );
};

export default EventForm;
