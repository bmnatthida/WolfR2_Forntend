import React from "react";
import { createContext, useContext, useState } from "react";
import { initialSession, Auth } from "../IRequestModel/IAuthModel";

export const SessionContext = createContext<[Auth, (session: Auth) => void]>([
  initialSession,
  () => {},
]);
export const useSessionContext = () => useContext(SessionContext);

export const SessionContextProvider: React.FC = (props) => {
  const [sessionState, setSessionState] = useState(initialSession);
  const defaultSessionContext: [Auth, typeof setSessionState] = [
    sessionState,
    setSessionState,
  ];

  return (
    <SessionContext.Provider value={defaultSessionContext}>
      {props.children}
    </SessionContext.Provider>
  );
};
