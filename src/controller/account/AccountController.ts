import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { accountModal } from "../../model";
import { createTokens } from "../../utils/createTokens";
import { getAccessTokenFromAuth } from "../../utils/getAccessTokenFromAuth";
import { sendRefreshToken } from "../../utils/sendRefreshToken";
import AccountControllerInterface from "./AccountControllerInterface";

export default class AccountController implements AccountControllerInterface {
  private static instance: AccountController;

  constructor() {
    if (AccountController.instance !== undefined)
      return AccountController.instance;

    AccountController.instance = this;
    return AccountController.instance;
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ ok: false, errorMsg: "Invalid input" });

    // handle database
    try {
      const account = await accountModal.findUserByEmail({
        email: email + "",
      });
      if (!account)
        return res
          .status(400)
          .json({ ok: false, errorMsg: "Wrong email or password" });

      const valid = await bcrypt.compare(password + "", account.password!);
      if (!valid)
        return res
          .status(400)
          .json({ ok: false, errorMsg: "Wrong email or password" });

      const tokens = createTokens(account.id);
      sendRefreshToken(res, tokens.refresh_token);

      delete account.password;

      return res.json({
        account,
        accessToken: tokens.access_token,
      });
    } catch (error) {
      return res.status(500).json({ ok: false, errorMsg: error.message });
    }
  }

  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ ok: false, errorMsg: "Invalid input" });

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const account = await accountModal.addUser({
        name: name + "",
        password: hashedPassword,
        email: email + "",
      });

      const tokens = createTokens(account.id);
      sendRefreshToken(res, tokens.refresh_token);

      delete account.password;

      return res.json({
        account,
        accessToken: tokens.access_token,
      });
    } catch (error) {
      return res.status(500).json({ ok: false, errorMsg: error.message });
    }
  }

  logout(_: Request, res: Response) {
    res.clearCookie("todoapp_refresh_token");

    return res.json({ ok: true });
  }

  async me(req: Request, res: Response) {
    try {
      const { account_id, access_token } = getAccessTokenFromAuth(
        req.headers["authorization"]
      );

      if (account_id === undefined || access_token === undefined)
        return res.json({});

      const account = await accountModal.findUserById({
        id: account_id,
      });

      if (!account) return res.json({});

      return res.json({ account, access_token });
    } catch (error) {
      return {};
    }
  }
}
