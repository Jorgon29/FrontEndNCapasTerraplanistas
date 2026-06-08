// features/auth/components/FormCard.tsx
import React, { useState } from "react";
import { useFormSubmit } from "../hooks/useFormSubmit";
import { FormContext } from "../context/FormContext";

interface FormCardProps {
  actionPath: string;                // e.g., "/api/auth/register"
  onSuccess?: (data: any) => void;   // What to do after successful submission
  children: React.ReactNode;
  className?: string;
}

function FormCard({ actionPath, onSuccess, children, className = "" }: FormCardProps) {
  const { submit, isLoading, error } = useFormSubmit<Record<string, any>>();
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);

    const formData = new FormData(e.currentTarget);
    
    const p1 = formData.get("password1");
    const p2 = formData.get("password2");
    if (p1 && p2 && p1 !== p2) {
      setLocalError("Las contraseñas no coinciden.");
      return;
    }

    const payload = Object.fromEntries(formData.entries());

    const response = await submit(actionPath, payload);
    if (response && onSuccess) {
      onSuccess(response);
    }
  };

  return (
    <FormContext.Provider value={{ isLoading, error: localError || error }}>
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-md rounded-2xl bg-background p-8 shadow-lg ${className}`}
      >
        <div className="space-y-5">
          {children}
          
          {(localError || error) && (
            <p className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
              {localError || error}
            </p>
          )}
        </div>
      </form>
    </FormContext.Provider>
  );
}

export default FormCard;