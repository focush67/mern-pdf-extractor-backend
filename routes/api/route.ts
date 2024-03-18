import Router from "express";
import LoginRouter from "./login/route";
import RegisterRouter from "./register/route";
import PDFUploadRouter from "./pdf/route";
const router = Router();

router.use("/login", LoginRouter);
router.use("/register", RegisterRouter);
router.use("/pdf", PDFUploadRouter);

export default router;
