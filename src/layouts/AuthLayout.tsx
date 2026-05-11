import { Outlet } from "react-router";

function AuthLayout(){
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <Outlet />
    </main>
  );
}

export default AuthLayout;