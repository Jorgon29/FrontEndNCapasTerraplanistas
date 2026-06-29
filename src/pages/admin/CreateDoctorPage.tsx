import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserMd, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useCreateEmployee } from "@/features/admin/hooks/useCreateEmployee";

export default function CreateDoctorPage() {
  const { formData, isSubmitting, error, success, handleChange, handleSubmit } = useCreateEmployee();

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-surface border border-surface-alt rounded-2xl shadow-sm overflow-hidden">
        
        <div className="px-8 py-6 border-b border-surface-alt bg-background/50">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">
              <FontAwesomeIcon icon={faUserMd} className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-text">Registrar Nuevo Profesional</h1>
              <p className="text-sm text-text-muted mt-1">
                Complete la información personal para dar de alta a un nuevo profesional.
              </p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-600">
            <FontAwesomeIcon icon={faExclamationCircle} className="mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mx-8 mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-600">
            <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5" />
            <p className="text-sm font-medium">¡Profesional registrado exitosamente!</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Ej. usuario@clinic.com"
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Rol
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="EMPLOYEE">Médico</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            <div>
              <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Nombres
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Ej. Juan Carlos"
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Apellidos
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Ej. Pérez Gómez"
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="idType" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Tipo de Documento
              </label>
              <select
                id="idType"
                name="idType"
                required
                value={formData.idType}
                onChange={handleChange}
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="DNI">DNI</option>
                <option value="PASSPORT">Pasaporte</option>
              </select>
            </div>

            <div>
              <label htmlFor="idNumber" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Número de Documento
              </label>
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                required
                value={formData.idNumber}
                onChange={handleChange}
                placeholder="Ej. 123456789"
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phones" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Teléfono
              </label>
              <input
                id="phones"
                name="phones"
                type="tel"
                required
                value={formData.phones}
                onChange={handleChange}
                placeholder="Ej. +54 9 11 1234-5678"
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Dirección
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Ej. Av. Corrientes 1234, CABA"
                className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors"
              />
            </div>

          </div>

          <div className="mt-4 pt-6 border-t border-surface-alt flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary text-white rounded-xl px-8 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-40"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Guardando...
                </span>
              ) : (
                "Registrar Profesional"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}