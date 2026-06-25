import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { authStorage, AuthUser } from "../../lib/authStorage";
import BASE_URL from "../../config/config";

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash.substring(1);
      if (!hash) return null;
      const params = new URLSearchParams(hash);
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

    const handleCallback = async () => {
      const hashData = parseHashParams();

      if (hashData) {
        const { accessToken, refreshToken, user } = hashData;
        authStorage.setTokens(accessToken, refreshToken, user);
        window.history.replaceState(null, "", window.location.pathname);

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
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/me`, {
          credentials: "include"
        });

        if (!response.ok) {
          const googleUserId = searchParams.get("googleUserId");
          const email = searchParams.get("email");
          const name = searchParams.get("name");

          if (googleUserId && email) {
            navigate(`/patient/consent?googleUserId=${encodeURIComponent(googleUserId)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "")}`);
            return;
          }

          navigate("/auth/login?error=callback_failed");
          return;
        }

        const data = await response.json();

        const { access_token, refresh_token, user } = data;

        if (!access_token || !refresh_token || !user) {
          navigate("/auth/login?error=callback_failed");
          return;
        }

        authStorage.setTokens(access_token, refresh_token, user);

        window.history.replaceState(null, "", window.location.pathname);

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
      } catch (e) {
        const googleUserId = searchParams.get("googleUserId");
        const email = searchParams.get("email");
        const name = searchParams.get("name");

        if (googleUserId && email) {
          navigate(`/patient/consent?googleUserId=${encodeURIComponent(googleUserId)}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name || "")}`);
          return;
        }

        navigate("/auth/login?error=callback_failed");
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
