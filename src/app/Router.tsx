import { createBrowserRouter, Navigate } from "react-router-dom";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import LandingPage from "@/pages/LandingPage";
import SearchDoctor from "@/pages/doctor/NoAuthDoctorSearch";
import DoctorSchedulePage from "@/pages/doctor/DoctoSchedulePage";
import PatientTopBar from "@/features/patient/PatientTopBar";
import PatientProfilePage from "@/pages/patient/PatientProfilePage";
import PatientSchedulePage from "@/pages/patient/PatientSchedulePage";
import PatientSearchPage from "@/pages/patient/PatientSearchPage";
import AdminTopBar from "@/features/admin/AdminTopBar";
import AdminSearchPage from "@/pages/admin/AdminSearchPage";
import ErrorPage from "@/pages/ErrorPage";
import CreateDoctorPage from "@/pages/admin/CreateDoctorPage";
import SpecialtiesPage from "@/pages/admin/SpecialtiesPage";

export const router = createBrowserRouter([
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
        path: "/doctor/schedule/:uuid",
        element: <DoctorSchedulePage />
      }, {
        path: "/patient",
        element: <PatientTopBar />,
        children: [
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
          }
        ]
      }, {
        path: "/admin",
        element: <AdminTopBar />,
        children: [
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
          }
        ]
      }
    ]
  }
]);