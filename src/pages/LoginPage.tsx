
function LoginPage(){
return (
  <form className="w-full max-w-md rounded-2xl bg-background p-8 shadow-lg">
    <div className="space-y-5">
      <div>
        <label htmlFor="femail" className="block text-sm font-medium text-text dark:text-text-muted">
          Email
        </label>
        <input
          id="femail"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label htmlFor="fpassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Contraseña
        </label>
        <input
          id="fpassword"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text"
      >
        Iniciar sesión
      </button>
    </div>
  </form>
);
}

export default LoginPage;