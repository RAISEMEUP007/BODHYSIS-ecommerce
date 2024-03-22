import { useContext } from "react";
import { StoreDetailProps, StoreDetailsContext } from "./StoreDetailsProvider";

const useStoreDetails = () => useContext(StoreDetailsContext);

export { useStoreDetails };