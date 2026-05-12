function FormCard({ onSubmit, children, className = "" }: {
  onSubmit?: React.SubmitEventHandler;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`w-full max-w-md rounded-2xl bg-background p-8 shadow-lg ${className}`}
    >
      <div className="space-y-5">{children}</div>
    </form>
  );
}

export default FormCard;