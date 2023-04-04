import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import Box from "@mui/material/Box";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import EventForm from "../forms/EventForm";
import { useAppDispatch } from "../store";
import { getModule } from "../store/slices/module";
import { RootState } from "../store/types";
import { StepContent, StepLabel } from "@mui/material";
import TicketForm from "../forms/TicketForm";
import { useWalletKit } from "@mysten/wallet-kit";
import { getOwnedEvent } from "../store/slices/account";
import { useTheme } from "@emotion/react";

const Create = (): ReactElement => {
  const { currentAccount } = useWalletKit();
  const { entity: pkg } = useSelector((state: RootState) => state.package);
  const dispatch = useAppDispatch();
  const [activeStep, setActiveStep] = useState<number>(1);
  const theme = useTheme();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => Math.max(0, prevActiveStep + 1));
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = useMemo(
    () => [
      {
        label: "Create Event",
        component: <EventForm onNext={() => handleNext()} />,
      },
      {
        label: "Create tickets",
        component: <TicketForm onBack={() => handleBack()} />,
      },
    ],
    []
  );

  useEffect(() => {
    if (!!pkg.data) {
      dispatch(getModule("event"));
      dispatch(getModule("ticket"));
      if (currentAccount) {
        dispatch(getOwnedEvent(currentAccount.address));
      }
    }
  }, [currentAccount, dispatch, pkg]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingLeft: 2,
        paddingRight: 2,
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: "bold", alignSelf: "baseline", mt: 3, mb: 5 }}>
        My Event
      </Typography>
      <Box
        sx={{
          backgroundColor: (theme as any).palette.background.paper,
          width: "max-content",
          padding: [2, 3],
          borderRadius: 1,
          boxShadow: 1,
        }}
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={`${step.label}_${index}`}>
              <StepLabel
                sx={{ cursor: index <= activeStep ? "pointer" : "default", width: "max-content" }}
                onClick={() => index < activeStep && setActiveStep(index)}
              >
                {step.label}
              </StepLabel>
              <StepContent TransitionProps={{ unmountOnExit: false }}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>{step.component}</Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Box>
  );
};
export default Create;
