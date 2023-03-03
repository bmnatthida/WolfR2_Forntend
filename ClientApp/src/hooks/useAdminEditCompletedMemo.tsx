import { useContext } from "react";
import { AdminEditCompletedMemoPermissionContext } from "../Context/AdminEditCompletedMemoPermissionContext";

const useAdminEditCompletedMemoPermissionContext = () => {
  const context = useContext(AdminEditCompletedMemoPermissionContext);
  if (!context)
    throw new Error(
      "useAdminEditCompletedMemoPermission Context must be use inside useAdminEditCompletedMemoPermissionContext Provider"
    );
  return context;
};

export default useAdminEditCompletedMemoPermissionContext;
