import { Router } from "express";
import {
  getPresignedUrl,
} from "../controllers/video.controller.js";

export const videoRouter: Router = Router();

videoRouter.post("/upload/presign", getPresignedUrl);

