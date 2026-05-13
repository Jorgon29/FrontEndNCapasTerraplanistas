import { Outlet } from "react-router";

function AuthLayout(){
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-r from-background to-primary">
      <Outlet />
    </main>
  );
}

export default AuthLayout;