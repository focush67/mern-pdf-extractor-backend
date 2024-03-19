import Router from "express";
import registerUser from "../../../services/register-user";

const router = Router();

router.post("/", async (request, response) => {
  const data = request.body;
  const { username, password, confirmPassword } = data;
  const result = await registerUser(username, password, confirmPassword);
  if (!result) {
    console.log("Some error registering");
    return response.json({
      message: "Some error occured at registering",
      status: 302,
    });
  }

  const { token, responseUser } = result;

  return response.cookie("token", token, { secure: true }).json({
    message: "User registered successfully",
    status: 200,
    user: responseUser,
  });
});

export default router;
