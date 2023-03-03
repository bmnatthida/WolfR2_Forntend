import React, { useContext, createContext, useState } from "react";
interface AuthContextInterface {
  user: string;
  onSubmit: (data: any) => void;
  remarkValid: string;
}
export default function useAuth() {
  const authContext = createContext<AuthContextInterface | null>(null);
  return useContext(authContext);
}
