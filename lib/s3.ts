import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(fileBuffer: Buffer, fileName: string, mimeType: string) {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME || "bcasrepo",
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
  });
  await s3Client.send(command);
  return `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}

export async function deleteFromS3(fileUrl: string) {
  if (!fileUrl) return;
  try {
    const url = new URL(fileUrl);
    const key = url.pathname.substring(1); // removes leading slash
    const command = new DeleteObjectCommand({
      Bucket: process.env.BUCKET_NAME || "bcasrepo",
      Key: key,
    });
    await s3Client.send(command);
  } catch (err) {
    console.error("Error deleting from S3:", err);
  }
}
