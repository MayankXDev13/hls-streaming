import express from "express";
import cors from "cors";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "./lib/s3.js";

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json({ limit: "50kb" }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log(req.body);
  next();
});

// Generate presigned URL
app.post("/api/get-presigned-url", async (req, res) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing file name or file type" });
  }

  try {
    const uniqueKey = `videos/${uuidv4()}-${fileName}`; // unique path in S3

    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, // 1 hours
    });

    res.json({
      presignedUrl,
      fileKey: uniqueKey,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

// save video info to your DB after upload
app.post("/api/confirm-upload", async (req, res) => {
  const { fileKey, fileUrl, fileName, fileType, fileSize, userId } = req.body;

  console.log(`fileKey: ${fileKey}`);
  console.log(`fileUrl: ${fileUrl}`);
  console.log(`fileName: ${fileName}`);
  console.log(`fileType: ${fileType}`);
  console.log(`fileSize: ${fileSize}`);
  console.log(`userId: ${userId}`);

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
