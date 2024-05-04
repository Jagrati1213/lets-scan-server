import { Response, Request, NextFunction } from "express";

export const asyncHandler = (requestHandler: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => requestHandler(req, res, next))
      .catch((error) => next(error));
  };
};
