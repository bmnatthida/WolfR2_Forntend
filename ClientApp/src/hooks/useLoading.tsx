import { useContext } from "react";
import { LoadContext } from "../Context/LoadContext";

const useLoading = () => {
  const context = useContext(LoadContext);
  if (!context)
    throw new Error("Load Context must be use inside Load Provider");
  return context;
};

export default useLoading;
