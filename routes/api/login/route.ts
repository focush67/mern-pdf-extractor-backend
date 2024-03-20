import { Router } from "express";
import { config } from "dotenv";
import signToken from "../../../services/sign-token";
import { extractToken } from "../../../utilities/extract";
import { verifyToken } from "../../../utilities/token-verification";
const router = Router();

config();

router.get("/:token", async (request, response) => {
  const token = request.params.token;
  const extracted = extractToken(token);
  try {
    const result = await verifyToken(extracted);
    return response.json({
      message: "Returning User",
      status: 200,
      user: result,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.json({
      message: "Error at /login",
      status: 200,
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
  return response.json({
    message: "Returning the user",
    status: 200,
    user: responseUser,
    token: token,
  });
});

export default router;
