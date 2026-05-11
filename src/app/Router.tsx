import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import AuthLayout from "@/layouts/AuthLayout";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<></>}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
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
    element: <></>,
    children: [
      {
        path: "/login"
      },
    ],
  },
  {
    path: "*",
    element: <h1>Not found</h1>,
  },
]);