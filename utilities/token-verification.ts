import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { db } from "./database";

config();

const secret = process.env.JWT_SECRET!;

export const verifyToken = async (token: string) => {
  try {
    const { id } = jwt.verify(token, secret) as { id: string };
    if (!id) {
      console.log("Verification failed ", id);
      return null;
    }
    const userProfile = await db.user.findUnique({
      where: {
        id,
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
    console.log("Error in verification token: ", error.message);
  }
};
