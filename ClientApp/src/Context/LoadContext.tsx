import { createContext, ReactNode, useEffect, useState } from "react";
import React from "react";
import { useLocation } from "react-router";

interface LoadProviderProps {
  children: ReactNode;
}

interface ILoadContextType {
  isLoad: boolean;
  setLoad: (is: boolean) => void;
}

const LoadContext = createContext<ILoadContextType | null>(null);

const LoadProvider: React.FC<LoadProviderProps> = (props) => {
  const [isLoad, setLoad] = useState<boolean>(false);

  return (
    <LoadContext.Provider value={{ isLoad, setLoad }}>
      {props.children}
    </LoadContext.Provider>
  );
};

export { LoadProvider, LoadContext };
