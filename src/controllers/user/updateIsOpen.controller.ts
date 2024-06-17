import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequest } from "../../types";
import { userCollection } from "../../models/user.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

export const updateIsOpenController = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    try {
      // GET VALUE OF IS-OPEN
      const { isOpen } = req.body;

      // GET CURRENT USER
      const currentUser = await userCollection.findById(req?.user?._id);

      if (!currentUser) {
        return res.json(
          new ApiErrors({ statusCode: 404, statusText: "USER NOT FOUNDED!" })
        );
      }

      //   UPDATE USER SHOP
      const updatedUser = await userCollection
        .findByIdAndUpdate(
          currentUser._id,
          {
            $set: {
              isOpen: isOpen,
            },
          },
          {
            new: true,
          }
        )
        .select(
          "-password -refreshToken -createdAt -updatedAt -__v -menuItems -orders"
        );
      if (!updatedUser) {
        return res.json(
          new ApiErrors({
            statusCode: 400,
            statusText: "SOMETHING WRONG IN SHOP OPEN!",
          })
        );
      }

      //  RETURN RESPONSE TO CLIENT
      return res.json(
        new ApiResponse({
          statusCode: 200,
          statusText: `${updatedUser.isOpen ? "SHOP OPENED!" : "SHOP CLOSED!"}`,
          data: updatedUser,
        })
      );
    } catch (error) {
      return res.json(
        new ApiErrors({
          statusCode: 500,
          statusText: "ERROR IN SHOP OPEN",
        })
      );
    }
  }
);
