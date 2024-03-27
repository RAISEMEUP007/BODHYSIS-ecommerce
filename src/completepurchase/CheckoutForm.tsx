import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@mui/material";
import { useCustomStripe } from "../common/Providers/CustomStripeProvider/UseCustomStripe";
import { sendReservationConfirmationEmail } from "../api/Stripe";
import { useCustomerReservation } from "../common/Providers/CustomerReservationProvider/UseCustomerReservation";
import dayjs from "dayjs";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const { amount, clientSecret } = useCustomStripe();
  const [ message, setMessage ] = useState("");
  const [ isLoading, setIsLoading ] = useState(false);
  const { ReservationMain } = useCustomerReservation();
  
  const handleSubmit = async (e:any) => {
    console.log('ddd');
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    console.log(stripe);

    setIsLoading(true);

    if (!stripe) {
      return;
    }
    
    if (!clientSecret) {
      return;
    }

    await stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // console.log(paymentIntent);
      // if(!paymentIntent) return;
      // switch (paymentIntent.status) {
      //   case "succeeded":
      //     setMessage("Payment succeeded!");
      //     break;
      //   case "processing":
      //     setMessage("Your payment is processing.");
      //     break;
      //   case "requires_payment_method":
      //     setMessage("Your payment was not successful, please try again.");
      //     break;
      //   default:
      //     setMessage("Something went wrong.");
      //     break;
      // }
    });

    localStorage.setItem('pickup', dayjs(ReservationMain.pickup).format('MMMM DD, YYYY hh:mm A'));
    localStorage.setItem('dropoff', dayjs(ReservationMain.dropoff).format('MMMM DD, YYYY hh:mm A'));
    
    const mailParams = {
      name: ReservationMain.name,
      email: ReservationMain.email,
    }
    sendReservationConfirmationEmail(mailParams);

    const currentURL = window.location.href;
    const url = new URL(currentURL);
    const protocol = url.protocol;
    const host = url.host;
    const fullHost = protocol + "//" + host; 

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: fullHost + "/thankyou",
      },
    });


    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message as string);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element"/>
      <Button variant="contained"  disabled={isLoading || !stripe || !elements} sx={{ mt: '20px', float:'right'}} onClick={handleSubmit}>
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </Button>
      {message && <div style={{color: "rgb(105, 115, 134)", fontSize: "16px", lineHeight: "20px", paddingTop: "12px", textAlign: "center"}}>{message}</div>}
    </form>
  );
}