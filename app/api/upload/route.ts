import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadToS3, deleteFromS3 } from "@/lib/s3";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const oldUrl = formData.get("oldUrl") as string;
    const folder = formData.get("folder") as string || "uploads";

    if (!file) return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    // Safe extension extraction
    const filenameParts = file.name.split('.');
    const extension = filenameParts.length > 1 ? filenameParts.pop() : 'bin';
    const timestamp = Date.now();
    const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`;

    if (oldUrl && oldUrl.includes("amazonaws.com")) {
      await deleteFromS3(oldUrl);
    }

    const newUrl = await uploadToS3(buffer, fileName, file.type);
    
    return NextResponse.json({ url: newUrl });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    return NextResponse.json({ error: "Error subiendo archivo a AWS S3" }, { status: 500 });
  }
}
