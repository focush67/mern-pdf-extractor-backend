import { config } from "dotenv";
import { db } from "../utilities/database";
import jwt from "jsonwebtoken";
import { registerSchema } from "../validations/register";
import bcrypt from "bcryptjs";

config();

export default async function registerUser(
  username: string,
  password: string,
  confirmPassword: string
) {
  const secret = process.env.JWT_SECRET!;
  try {
    registerSchema.parse({ username, password, confirmPassword });
    const status = await db.user.findMany({
      where: {
        username,
      },
    });
    if (status[0]) {
      console.log("User is already registered, login required");
      return null;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newSignedUser = await db.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
    const userId = newSignedUser.id;
    const token = jwt.sign(
      {
        id: userId,
        username: username,
      },
      secret,
      {
        expiresIn: "1d",
      }
    );

    const responseUser = {
      username: username,
      id: newSignedUser.id,
    };

    return {
      token: token,
      responseUser,
    };
  } catch (error: any) {
    console.log("Some error ", error.message);
    return null;
  }
}
