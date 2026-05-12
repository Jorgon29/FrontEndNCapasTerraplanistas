function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background 
        transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 
        focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text"
    >
      {label}
    </button>
  );
}

export default SubmitButton;