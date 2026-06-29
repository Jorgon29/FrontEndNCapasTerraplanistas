import { useForm } from "../context/FormContext";

function SubmitButton({ label }: { label: string }) {
  const { isLoading } = useForm();

  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background 
        transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 
        focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text 
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Enviando..." : label}
    </button>
  );
}

export default SubmitButton;