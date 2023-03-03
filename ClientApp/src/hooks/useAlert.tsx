import { useContext } from "react";
import { AlertContext } from "../Context/AlertContext";

const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context)
    throw new Error("Load Context must be use inside Load Provider");
  return context;
};

export default useAlert;
