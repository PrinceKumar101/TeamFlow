import { controllerType } from "../types/controller.types.js";
import { sendSuccessResponse } from "../utils/utilityFunctions.js";
import { HTTP_STATUS } from "../utils/httpStatusCode.js";
import { getAllUsersService } from "../services/user.services.js";

export const getAllUsersController: controllerType = async (_req, res) => {
  const users = await getAllUsersService();
  sendSuccessResponse(res, HTTP_STATUS.OK, "Users fetched", users);
};
