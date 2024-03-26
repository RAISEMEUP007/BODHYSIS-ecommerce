import { useContext } from "react";
import { CustomStripeProviderContext } from "./CustomStripeProvider";

const useCustomStripe = () => useContext(CustomStripeProviderContext);

export { useCustomStripe };