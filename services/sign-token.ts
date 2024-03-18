import { db } from "../utilities/database";
import { loginSchema } from "../validations/login";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export default async function signToken(username: string, password: string) {
  const secret = process.env.JWT_SECRET!;

  try {
    loginSchema.parse({ username, password });

    const userProfile = await db.user.findMany({
      where: {
        username,
      },
    });

    if (!userProfile || userProfile.length === 0) {
      console.log("No User found");
      return null;
    }

    const existingHashedPassword = userProfile[0].password;
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingHashedPassword
    );

    if (isPasswordMatch) {
      const token = jwt.sign(
        {
          id: userProfile[0].id,
          username: userProfile[0].username,
        },
        secret,
        {
          expiresIn: "5h",
        }
      );

      const responseUser = {
        id: userProfile[0].id,
        username: userProfile[0].username,
      };

      return {
        token,
        responseUser,
      };
    } else {
      console.log("Passwords do not match");
      return null;
    }
  } catch (error: any) {
    console.log("Error:", error.message);
    return null;
  }
}
