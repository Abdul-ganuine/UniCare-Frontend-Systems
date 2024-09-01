import { createContext, useContext } from "react";

const RoleContext = createContext(null);

export const RoleProvider = ({ children, role }) => {
  return <RoleContext.Provider value={role}>{children}</RoleContext.Provider>;
};

export const useRole = () => {
  return useContext(RoleContext);
};
