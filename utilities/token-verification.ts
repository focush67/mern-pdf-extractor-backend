import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { db } from "./database";

config();

const secret = process.env.JWT_SECRET!;

export const verifyToken = async (token: string) => {
  try {
    const x = jwt.verify(token, secret) as { id: string };
    if (!x) {
      console.log("Verification failed ", x);
      return null;
    }
    const userProfile = await db.user.findUnique({
      where: {
        id: x.id,
      },
    });
    if (!userProfile) {
      console.log("No profile found");
      return null;
    }

    const user = {
      id: userProfile.id,
      username: userProfile.username,
    };

    return user;
  } catch (error: any) {
    console.log("Token: ", token);
    console.log("Error in verification token: ", token);
  }
};
