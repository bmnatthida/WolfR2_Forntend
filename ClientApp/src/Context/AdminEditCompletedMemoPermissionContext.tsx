import React from "react";
import {
  FunctionComponent,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { CheckCanAdminEditCompletedMemo } from "../Services/AppSettingService";
import { CheckRolePermission } from "../Services/AuthorizedService";
import { useUserContext } from "./UserContext";

type AdminCanEditCompletedMemoType = {
  canEditMemo: boolean;
  setCanEditMemo: (can: boolean) => void;
};
const AdminEditCompletedMemoPermissionContext =
  createContext<AdminCanEditCompletedMemoType | null>(null);

interface AdminCanEditCompletedMemoProviderProps {
  children: ReactNode;
}

const AdminEditCompletedMemoProvider: FunctionComponent<
  AdminCanEditCompletedMemoProviderProps
> = (props) => {
  const [userData] = useUserContext();

  const [canEditMemo, setCanEditMemo] = useState<boolean>(false);
  useEffect(() => {
    getCanAdminEditCompletedMemo();
  }, []);
  const getCanAdminEditCompletedMemo = async () => {
    const canEdit = await CheckCanAdminEditCompletedMemo();
    const isAdmin = await CheckRolePermission(userData.EmployeeId);
    console.log({ isAdmin, userData });
    if (isAdmin && canEdit) {
      setCanEditMemo(canEdit);
    }
  };
  return (
    <AdminEditCompletedMemoPermissionContext.Provider
      value={{ canEditMemo, setCanEditMemo }}
    >
      {props.children}
    </AdminEditCompletedMemoPermissionContext.Provider>
  );
};

export {
  AdminEditCompletedMemoProvider,
  AdminEditCompletedMemoPermissionContext,
};
