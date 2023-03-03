import { sign } from "jsonwebtoken";

export const createTokens = (account_id: number) => {
  const access_token = sign({ account_id }, process.env.ACCESS_TOKEN_SCERET, {
    expiresIn: "15m",
    // expiresIn: "5s",
  });

  const refresh_token = sign({ account_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h",
  });

  return { access_token, refresh_token };
};
