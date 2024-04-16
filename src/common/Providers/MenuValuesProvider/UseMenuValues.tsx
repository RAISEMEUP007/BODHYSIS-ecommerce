import { useContext } from "react";
import { MenuValueProps, MenuValuesContext } from "./MenuValuesProvider";

const useMenuValues = () => useContext(MenuValuesContext);

export { useMenuValues };