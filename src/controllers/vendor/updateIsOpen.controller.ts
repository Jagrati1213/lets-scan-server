import { Request, Response } from "express";
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

      // GET CURRENT VENDOR
      const currentVender = await vendorCollection.findById(req?.vendor?._id);

      if (!currentVender) {
        return res.json(
          new ApiErrors({ statusCode: 404, statusText: "VENDOR NOT FOUNDED!" })
        );
      }

      //   UPDATE VENDOR SHOP
      const updatedUser = await vendorCollection
        .findByIdAndUpdate(
          currentVender._id,
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
            statusText: "SOMETHING WRONG IN SHOP OPENING!",
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
          statusText: `ERROR IN SHOP OPEN, ${error}`,
        })
      );
    }
  }
);
