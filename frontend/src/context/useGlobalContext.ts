// src/context/useGlobalContext.ts
import { useContext } from "react";
import { GlobalContext } from "./globalContext";
import { GlobalContextType } from "./types";

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext must be used within a GlobalProvider");
  return context;
};
