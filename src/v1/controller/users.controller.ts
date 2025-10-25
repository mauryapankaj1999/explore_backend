import { MESSAGE } from "common/message.common";
import { NextFunction, Request, Response } from "express";
import { User } from "models/user.model";
import { comparePassword } from "utils/bcrypt";
import { generateAccessJwt, generateRefreshJwt } from "utils/jwt";

export const webLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email) throw new Error("Please enter a valid email.");
    if (!password) throw new Error("Please enter a valid password.");

    const user = await User.findOne({ email }).lean().exec();

    if (!user) throw new Error("Email is not registered yet.");

    const validPassword = await comparePassword(user.password, password);

    if (!validPassword) throw new Error("Please check your credential.");

    let accessToken = await generateAccessJwt({ userId: String(user._id) });
    let refreshToken = await generateRefreshJwt({ userId: user._id, role: user.role });

    await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken }).lean().exec();

    res.status(200).json({
      message: MESSAGE.USER.LOGGED_IN,
      token: accessToken,
      id: user._id,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};
