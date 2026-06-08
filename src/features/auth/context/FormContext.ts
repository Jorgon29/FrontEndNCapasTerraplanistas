import { createContext, useContext } from "react";

interface FormContextType {
  isLoading: boolean;
  error: string | null;
}

export const FormContext = createContext<FormContextType>({ isLoading: false, error: null });
export const useForm = () => useContext(FormContext);