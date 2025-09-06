import { NextRequest, NextResponse } from "next/server";
import { renderDynamicVideo } from "../../../../remotion-lambda/src";

export async function POST(req: NextRequest) {
  const { videoUrl } = await req.json();

  if (!videoUrl) {
    return NextResponse.json(
      { error: "videoUrl is required" },
      { status: 400 }
    );
  }

  try {
    const originalFileName = videoUrl.split("/").pop();
    const outputName = `${originalFileName?.split(".")[0]}-renderedAt-${Date.now()}.mp4`;

    const { renderId, bucketName } = await renderDynamicVideo({
      videoUrl,
      serveUrl: process.env.REMOTION_SERVE_URL as string,
      outputName,
    });

    return NextResponse.json({ renderId, bucketName });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to start render" },
      { status: 500 }
    );
  }
} 
