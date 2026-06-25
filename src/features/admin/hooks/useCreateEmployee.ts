import { useState } from "react";
import apiClient from "@/lib/apiClient";

export type IdType = "DNI" | "PASSPORT";
export type RoleType = "EMPLOYEE" | "ADMIN";

export interface EmployeeRequest {
  email: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  idType: IdType;
  address: string;
  phones: string;
  role: RoleType;
}

export function useCreateEmployee() {
  const [formData, setFormData] = useState<EmployeeRequest>({
    email: "",
    firstName: "",
    lastName: "",
    idNumber: "",
    idType: "DNI",
    address: "",
    phones: "",
    role: "EMPLOYEE",
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
      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        idNumber: formData.idNumber,
        idType: formData.idType,
        address: formData.address,
        phones: formData.phones,
        role: formData.role,
      };

      const response = await apiClient.post("/admin/employees", payload);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data?.message || "Error al crear el empleado.");
      }

      setSuccess(true);
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        idNumber: "",
        idType: "DNI",
        address: "",
        phones: "",
        role: "EMPLOYEE",
      });

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Ocurrió un error inesperado de red.");
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