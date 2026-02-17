import type { Request, Response, RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../lib/s3.js";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "../utils/ApiResponse.js";

export const getPresignedUrl: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      res.status(400).json({ error: "Missing file name or file type" });
    }

    const uniqueKey = `videos/${uuidv4()}-${fileName}`; // unique path in S3 --> /videos/uuid-filename.mp4

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hours
    });

    res.json(
      new ApiResponse(
        200,
        {
          presignedUrl,
          fileKey: uniqueKey,
        },
        "Presigned URL generated successfully",
      ),
    );
  },
);


export const confirmUpload: RequestHandler = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { fileKey, fileUrl, fileName, fileType, fileSize, userId } = req.body;

    console.log(`fileKey: ${fileKey}`);
    console.log(`fileUrl: ${fileUrl}`);
    console.log(`fileName: ${fileName}`);
    console.log(`fileType: ${fileType}`);
    console.log(`fileSize: ${fileSize}`);
    console.log(`userId: ${userId}`);

    res.json(
      new ApiResponse(
        200,
        {
          fileKey,
          fileUrl,
          fileName,
          fileType,
          fileSize,
          userId,
        },
        "File uploaded successfully",
      ),
    );
  },
);