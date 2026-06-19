import { useState } from "react";
import BASE_URL from "@/config/config";

export type IdType = "DNI" | "PASSPORT";

export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  idNumber: string;
  idType: IdType;
  address: string;
  phones: string;
}

export function useCreateEmployee() {
  const [formData, setFormData] = useState<EmployeeRequest>({
    firstName: "",
    lastName: "",
    idNumber: "",
    idType: "DNI",
    address: "",
    phones: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${BASE_URL}/admin/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Error al crear el empleado.");
      }

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        idNumber: "",
        idType: "DNI",
        address: "",
        phones: "",
      });
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Ocurrió un error inesperado de red.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    error,
    success,
    handleChange,
    handleSubmit,
  };
}