import { ROLES } from "common/constant.common";
import { User } from "models/user.model";
import { encryptPassword } from "utils/bcrypt";

export const adminSeeder = async () => {
  try {
    const encryptedPassword = await encryptPassword("admin@1234");
    const adminExist = await User.findOne({ role: ROLES.ADMIN }).exec();
    if (adminExist) {
      return "Admin already exists";
    }

    await new User({
      name: "Admin",
      email: "admin@admin.com",
      password: encryptedPassword,
      role: ROLES.ADMIN,
      approved: true,
    }).save();
  } catch (error) {
    console.error(error);
  }
};
