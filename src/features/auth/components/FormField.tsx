function FormField({ id, label, type = "text", placeholder, autoComplete, required, className = "" }: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
}) {
  const inputClass = `mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 
    py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 
    focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark 
    dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light 
    dark:focus:ring-accent-dark ${className}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text dark:text-text-muted">
        {label}
      </label>
      <input id={id} name={id} type={type} placeholder={placeholder}
        autoComplete={autoComplete} required={required} className={inputClass}
      />
    </div>
  );
}

export default FormField;