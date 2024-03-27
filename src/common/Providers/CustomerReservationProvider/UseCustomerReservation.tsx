import { useContext } from "react";
import { CustomerReservationContext } from "./CustomerReservationProvider";

const useCustomerReservation = () => useContext(CustomerReservationContext);

export { useCustomerReservation };