import { Response, Request } from "express";

export default interface AccountControllerInterface {
  login: (req: Request, res: Response) => any;
  register: (req: Request, res: Response) => any;
  logout: (req: Request, res: Response) => any;
  me: (req: Request, res: Response) => any;
}