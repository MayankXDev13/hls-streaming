import { Router } from "express";
import {
  confirmUpload,
  getPresignedUrl,
} from "../controllers/video.controller.js";

export const videoRouter: Router = Router();

videoRouter.post("/get-presigned-url", getPresignedUrl);
videoRouter.post("/confirm-upload", confirmUpload);
