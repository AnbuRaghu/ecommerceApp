import React, { useEffect, useState } from "react";

import {
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
  CssBaseline,
} from "@material-ui/core";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import { Link, useHistory } from "react-router-dom";

const steps = ["Shipping address", "Payment details"];
export default function Checkout({ cart, onCaptureCheckout, order, error }) {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setcheckoutToken] = useState(null);
  const [shippingData, setshippingData] = useState({});
  const classes = useStyles();
  const history = useHistory();
  const [isFinished, setisFinished] = useState(false);

  useEffect(() => {
    //as soon as someone press checkout button we generate checkout token
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, {
          type: "cart",
        });

        setcheckoutToken(token);
      } catch (err) {
        history.push("/");
      }
    };
    generateToken();
  }, [cart, history]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setshippingData(data);
    nextStep();
  };
  const timeOut = () => {
    setTimeout(() => {
      setisFinished(true);
    }, 3000);
  };

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            Thank you for your purchase,{order.customer.firstname}
            {order.customer.lastname}
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            Order ref:{order.customer_reference}
          </Typography>
        </div>
        <br />
        <Button component={Link} to="/" type="button" variant="outlined">
          Back to Home
        </Button>
      </>
    ) : isFinished ? (
      <>
        <div>
          <Typography variant="h5">Thank you for your purchase </Typography>
          <Divider className={classes.divider} />
        </div>
        <br />
        <Button component={Link} to="/" type="button" variant="outlined">
          Back to Home
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );
  if (error) {
    <>
      <Typography variant="h5">Error:{error}</Typography>
      <br />
      <Button component={Link} to="/" type="button" variant="outlined">
        Back to hHome
      </Button>
    </>;
  }
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        onCaptureCheckout={onCaptureCheckout}
        nextStep={nextStep}
        timeOut={timeOut}
      />
    );

  return (
    <>
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* if we are at the last step */}
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
}
