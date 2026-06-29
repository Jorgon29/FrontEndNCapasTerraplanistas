import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    let title = "Algo salió mal :(";
    let message = "Un error inesperado ocurrió.";

    if (isRouteErrorResponse(error)) {
        title = `${error.status} ${error.statusText}`;
        message =
            typeof error.data === "string"
                ? error.data
                : message;
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <h1 className="text-4xl font-bold text-danger">{title}</h1>
            <p className="mt-4 text-text-muted">{message}</p>
        </div>
    );
}