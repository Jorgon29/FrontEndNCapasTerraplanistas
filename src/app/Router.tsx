import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
  return (
    <Suspense fallback={<></>}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <></>,
    children: [
      {
        path: "/"
      },
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