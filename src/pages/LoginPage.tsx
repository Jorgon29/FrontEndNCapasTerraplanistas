
function LoginPage(){
return (
  <form className="w-full max-w-md rounded-2xl bg-background p-8 shadow-lg">
    <div className="space-y-5">
      <div>
        <label htmlFor="femail" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
        </label>
        <input
          id="femail"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
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
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 dark:focus:ring-offset-gray-900"
      >
        Iniciar sesión
      </button>
    </div>
  </form>
);
}

export default LoginPage;