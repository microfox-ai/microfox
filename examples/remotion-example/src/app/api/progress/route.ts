import { NextRequest, NextResponse } from "next/server";
import { getProgress } from "../../../../remotion-lambda/src";

export async function POST(req: NextRequest) {
  const { renderId, bucketName } = await req.json();

  if (!renderId || !bucketName) {
    return NextResponse.json(
      { error: "renderId and bucketName are required" },
      { status: 400 }
    );
  }

  try {
    const progress = await getProgress({
      renderId,
      bucketName,
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get render progress" },
      { status: 500 }
    );
  }
} 
