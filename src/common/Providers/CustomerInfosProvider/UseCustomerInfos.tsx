import { useContext } from "react";
import { CustomerInfoProps, CustomerInfosContext } from "./CustomerInfosProvider";

const useCustomerInfos = () => useContext(CustomerInfosContext);

export { useCustomerInfos };