import User  from "../models/user.js";

export const getAllUsersService = async () => {
  const users = await User.find()
    .select("name email _id")
    .sort({ name: 1 });
  return users;
};
