import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { authStorage, AuthUser } from "../../lib/authStorage";
import BASE_URL from "../../config/config";

let callbackProcessed = false;

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash.substring(1);
      const queryString = hash.includes('?') ? hash.split('?')[1] : hash;
      if (!queryString) return null;
      const params = new URLSearchParams(queryString);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const userJson = params.get("user");
      if (accessToken && refreshToken && userJson) {
        return {
          accessToken,
          refreshToken,
          user: JSON.parse(decodeURIComponent(userJson))
        };
      }
      return null;
    };

    const navigateBasedOnUser = (user: any) => {
      if (user.requires_action === "give_consent") {
        navigate(`/patient/consent?googleUserId=${encodeURIComponent(user.google_user_id)}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || "")}`);
      } else if (user.account_status === "profile_incomplete") {
        navigate("/patient/profile");
      } else if (user.roles?.includes("ADMIN")) {
        navigate("/admin");
      } else if (user.roles?.includes("EMPLOYEE")) {
        navigate("/doctor");
      } else {
        navigate("/patient");
      }
    };

    const navigateToConsentOrError = () => {
      const googleUserId = searchParams.get("googleUserId");
      const email = searchParams.get("email");
      const name = searchParams.get("name");

      if (googleUserId && email) {
        navigate(`/patient/consent?googleUserId=${encodeURIComponent(googleUserId)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "")}`);
        return;
      }
      navigate("/auth/login?error=callback_failed");
    };

    const handleCallback = async () => {
      if (callbackProcessed) {
        return;
      }
      callbackProcessed = true;

      // Step 1: Call /auth/me first to establish OAuth session
      // This triggers Spring Security to load OAuth2AuthorizedClient into session
      try {
        const meResponse = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include"
        });
        if (meResponse.ok) {
          const data = await meResponse.json();
          if (data.access_token && data.refresh_token && data.user) {
            authStorage.setTokens(data.access_token, data.refresh_token, data.user);
            window.history.replaceState(null, "", window.location.pathname);
            navigateBasedOnUser(data.user);
            return;
          }
        }
      } catch (e) {
        // Continue to hash parsing if /auth/me fails
      }

      // Step 2: Parse hash params (tokens delivered via URL hash from backend)
      const hashData = parseHashParams();

      if (hashData) {
        const { accessToken, refreshToken, user } = hashData;
        authStorage.setTokens(accessToken, refreshToken, user);
        window.history.replaceState(null, "", window.location.pathname);
        navigateBasedOnUser(user);
        return;
      }

      // Step 3: Fallback - try /auth/me again (e.g., for existing sessions)
      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include"
        });

        if (!response.ok) {
          navigateToConsentOrError();
          return;
        }

        const data = await response.json();

        if (!data.access_token || !data.refresh_token || !data.user) {
          navigateToConsentOrError();
          return;
        }

        authStorage.setTokens(data.access_token, data.refresh_token, data.user);
        window.history.replaceState(null, "", window.location.pathname);
        navigateBasedOnUser(data.user);
      } catch (e) {
        navigateToConsentOrError();
      }
    };

    handleCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="text-text-muted">Cargando...</div>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
