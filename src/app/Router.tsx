import { createHashRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import AuthCallbackPage from "@/pages/auth/AuthCallbackPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import LandingPage from "@/pages/LandingPage";
import SearchDoctor from "@/pages/doctor/NoAuthDoctorSearch";
import DoctorSchedulePage from "@/pages/doctor/DoctoSchedulePage";
import PatientTopBar from "@/features/patient/PatientTopBar";
import PatientProfilePage from "@/pages/patient/PatientProfilePage";
import PatientSchedulePage from "@/pages/patient/PatientSchedulePage";
import PatientSearchPage from "@/pages/patient/PatientSearchPage";
import CheckoutPage from "@/pages/patient/CheckoutPage";
import CheckoutCallbackPage from "@/pages/patient/CheckoutCallbackPage";
import CheckoutSuccessPage from "@/pages/patient/CheckoutSuccessPage";
import CheckoutResultPage from "@/pages/CheckoutResultPage";
import CartPage from "@/pages/patient/CartPage";
import SimulatePaymentPage from "@/pages/patient/SimulatePaymentPage";
import MedicalRecordsPage from "@/pages/patient/MedicalRecordsPage";
import PrescriptionsPage from "@/pages/patient/PrescriptionsPage";
import ConsentPage from "@/pages/patient/ConsentPage";
import PatientCompleteProfilePage from "@/pages/patient/PatientCompleteProfilePage";
import PatientHomePage from "@/pages/patient/PatientHomePage";
import AdminTopBar from "@/features/admin/AdminTopBar";
import AdminSearchPage from "@/pages/admin/AdminSearchPage";
import AdminHomePage from "@/pages/admin/AdminHomePage";
import DoctorDetailPage from "@/pages/admin/DoctorDetailPage";
import ErrorPage from "@/pages/ErrorPage";
import CreateDoctorPage from "@/pages/admin/CreateDoctorPage";
import SpecialtiesPage from "@/pages/admin/SpecialtiesPage";
import LaboratoryManagementPage from "@/pages/admin/LaboratoryManagementPage";
import MedicineManagementPage from "@/pages/admin/MedicineManagementPage";
import DoctorTopBar from "@/features/doctor/DoctorTopBar";
import DoctorHomePage from "@/pages/doctor/DoctorHomePage";
import ProtectedRoute from "@/components/ProtectedRoute";

export const router = createHashRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/auth/login", element: <LoginPage />
          },
          {
            path: "/auth/register", element: <RegisterPage />
          },
          {
            path: "/auth/callback", element: <AuthCallbackPage />
          }
        ],
      },
      {
        element: <PrivacyPolicyPage />,
        children: [
{
        path: "/privacy", element: <PrivacyPolicyPage />
          },
        ],
      },
      {
        path: "/checkout-result",
        element: <CheckoutResultPage />
      },
      {
        path: "/",
        element: <LandingPage />
      },
      {
        path: "*",
        element: <h1>Not found</h1>,
      },
      {
        path: "/search",
        element: <SearchDoctor />
      },
      {
        path: "/patient/consent",
        element: <ConsentPage />
      },
      {
        path: "/patient/profile",
        element: <PatientCompleteProfilePage />
      },
      {
        path: "/doctor/schedule/:uuid",
        element: <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
          <DoctorSchedulePage />
        </ProtectedRoute>
      },
      {
        path: "/doctor",
        element: <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
          <DoctorTopBar />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <DoctorHomePage />
          },
          {
            path: "/doctor/consultations",
            element: <DoctorHomePage />
          }
        ]
      },
      {
        path: "/patient",
        element: <ProtectedRoute allowedRoles={["USER", "PATIENT"]}>
          <PatientTopBar />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <PatientHomePage />
          },
          {
            path: "/patient/calendar",
            element: <PatientSchedulePage />
          },
          {
            path: "/patient/profile",
            element: <PatientProfilePage />
          },
          {
            path: "/patient/search",
            element: <PatientSearchPage />
          },
          {
            path: "/patient/checkout/:appointmentId",
            element: <CheckoutPage />
          },
          {
            path: "/patient/checkout-success/:appointmentId",
            element: <CheckoutSuccessPage />
          },
          {
            path: "/patient/cart",
            element: <CartPage />
          },
          {
            path: "/patient/simulate-payment/:appointmentId",
            element: <SimulatePaymentPage />
          },
          {
            path: "/patient/medical-records",
            element: <MedicalRecordsPage />
          },
          {
            path: "/patient/prescriptions",
            element: <PrescriptionsPage />
          }
        ]
      }, {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["ADMIN"]}>
          <AdminTopBar />
        </ProtectedRoute>,
        children: [
          {
            index: true,
            element: <AdminHomePage />
          },
          {
            path: "/admin/doctor/:id",
            element: <DoctorDetailPage />
          },
          {
            path: "/admin/search",
            element: <AdminSearchPage />
          },
          {
            path: "/admin/employee",
            element: <CreateDoctorPage />
          }, {
            path: "/admin/specialties",
            element: <SpecialtiesPage />
          },
          {
            path: "/admin/laboratories",
            element: <LaboratoryManagementPage />
          },
          {
            path: "/admin/medicines",
            element: <MedicineManagementPage />
          }
        ]
      }
    ]
  }
]);
