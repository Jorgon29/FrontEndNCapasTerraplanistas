import axios from "axios";
import BASE_URL from "../config/config";
import { authStorage } from "./authStorage";

interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export const refreshTokens = async (): Promise<RefreshResponse | null> => {
  const refreshToken = authStorage.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await axios.post<RefreshResponse>(
      `${BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const { access_token, refresh_token } = response.data;
    const user = authStorage.getUser();

    if (user) {
      authStorage.setTokens(access_token, refresh_token, user);
    }

    return response.data;
  } catch (error) {
    return null;
  }
};
