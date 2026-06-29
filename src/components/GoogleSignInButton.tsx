import BASE_URL from "../config/config";

interface GoogleSignInButtonProps {
  rememberMe?: boolean;
}

export const GoogleSignInButton = ({ rememberMe = true }: GoogleSignInButtonProps) => {
  const handleGoogleLogin = () => {
    sessionStorage.setItem("remember_me", rememberMe ? "true" : "false");
    window.location.href = `${BASE_URL}/oauth2/authorization/google`;
  };

  return (
    <button onClick={handleGoogleLogin} type="button">
      Sign in with Google
    </button>
  );
};

export default GoogleSignInButton;
