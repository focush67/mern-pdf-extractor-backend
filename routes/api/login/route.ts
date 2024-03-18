import { Router } from "express";
import { verifyToken } from "../../../utilities/token-verification";
import { config } from "dotenv";
import signToken from "../../../services/sign-token";
const router = Router();

config();

router.get("/", async (request, response) => {
  const token = request.cookies.token;
  try {
    const profile = await verifyToken(token);
    return response.json({
      user: profile,
      status: 200,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.json({
      message: "Error occured at JWT Authentication at /login",
      status: 405,
      error: error.message,
    });
  }
});

router.post("/", async (request, response) => {
  const data = await request.body;
  const { username, password } = data;

  const result = await signToken(username, password);
  if (!result) {
    return response.json({
      message: "Invalid Credentials encountered",
      status: 405,
    });
  }

  const { token, responseUser } = result;
  return response.cookie("token", token).json({
    message: "Returning the user",
    status: 200,
    user: responseUser,
  });
});

router.delete("/", (_, response) => {
  response.clearCookie("token");
  return response.json({
    message: "Logged Out",
    status: 200,
  });
});

export default router;
