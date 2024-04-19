import { useContext } from "react";
import { ResponsiveValuesContext } from "./ResponsiveValuesProvider";

const useResponsiveValues = () => useContext(ResponsiveValuesContext);

export { useResponsiveValues };