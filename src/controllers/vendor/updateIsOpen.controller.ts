import { Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { CustomRequestT } from "../../types";
import { vendorCollection } from "../../models/vendor.model";
import { ApiErrors } from "../../utils/apiErrors";
import { ApiResponse } from "../../utils/apiResponse";

export const updateIsOpenController = asyncHandler(
  async (req: CustomRequestT, res: Response) => {
    try {
      // GET VALUE OF IS-OPEN
      const { isOpen } = req.body;

      //   UPDATE VENDOR SHOP
      const updatedUser = await vendorCollection
        .findByIdAndUpdate(
          req?.vendor?._id,
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
        return res.status(400).json(
          new ApiErrors({
            statusCode: 400,
            statusText: "SOMETHING WRONG IN SHOP OPENING!",
          })
        );
      }

      //  RETURN RESPONSE TO CLIENT
      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          statusText: `${updatedUser.isOpen ? "SHOP OPENED!" : "SHOP CLOSED!"}`,
          data: updatedUser,
        })
      );
    } catch (error) {
      return res.status(400).json(
        new ApiErrors({
          statusCode: 400,
          statusText: `ERROR IN SHOP OPEN, ${error}`,
        })
      );
    }
  }
);
