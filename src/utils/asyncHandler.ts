import { Response, Request, NextFunction } from "express";


type  RequestHandlerT = (req:Request, res:Response, next:NextFunction)=>void

export const asyncHandler = (requestHandler: RequestHandlerT) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve()
      .then(() => requestHandler(req, res, next))
      .catch((error) => next(error));
  };
};
