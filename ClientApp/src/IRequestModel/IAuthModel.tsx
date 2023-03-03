import Cookies from "universal-cookie";
const cookies = new Cookies();
export type Auth = {
  isAuthenticated?: boolean;
  redirectPath: string;
};

export const initialSession: Auth = {
  redirectPath: "/login",
  isAuthenticated: cookies.get("GuidVerify") ? true : false,
};
