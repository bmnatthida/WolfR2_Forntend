import React, { useContext, createContext, useState } from "react";
import UseProvideAuth from "./UseProvideAuth";

interface Props {}
interface AuthContextInterface {
  user: string;
  onSubmit: (data: any) => void;
  remarkValid: string;
}
export const ProvideAuth = (children: JSX.Element) => {
  const authContext = createContext<AuthContextInterface | null>(null);
  const auth = UseProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
