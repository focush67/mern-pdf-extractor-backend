import { Router } from "express";
import { db } from "../../../utilities/database";
import multer from "multer";
import { verifyToken } from "../../../utilities/token-verification";
import { User } from "@prisma/client";
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (request, response) => {
  const profile = (await verifyToken(request.cookies.auth_token)) as User;
  try {
    const pdfs = await db.pDF.findMany({
      where: {
        ownerId: profile.id,
      },
    });
    return response.json({
      message: "Returning all PDFs",
      status: 200,
      pdfs: pdfs,
    });
  } catch (error: any) {
    console.log(error.message);
    return response.json({
      message: "Some error occured",
      error: error.message,
      status: 405,
    });
  }
});

router.post("/", upload.single("file"), async (request, response) => {
  const fileName = request.file?.filename;
  const title = request.body.title;
  const ownerId = request.body.ownerId || "65faee7ba4b9d5e09e656dfd";
  const url = request.body.url;
  try {
    const newPdf = await db.pDF.create({
      data: {
        ownerId,
        url,
        title,
        fileName: fileName || "",
      },
    });
    return response.json({
      message: "PDF Saved",
      status: 200,
      pdf: newPdf,
    });
  } catch (error: any) {
    console.log("Error at backend: ", error.message);
    return response.json({
      message: "Some error occured in saving a pdf to database",
      status: 405,
    });
  }
});

export default router;
