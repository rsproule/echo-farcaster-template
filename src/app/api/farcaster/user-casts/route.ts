import { Configuration, NeynarAPIClient } from "@neynar/nodejs-sdk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiKey = process.env.NEYNAR_API_KEY;
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get("fid");

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Neynar API key is not configured. Please add NEYNAR_API_KEY to your environment variables.",
      },
      { status: 500 },
    );
  }

  if (!fid) {
    return NextResponse.json(
      { error: "FID parameter is required" },
      { status: 400 },
    );
  }

  try {
    const config = new Configuration({ apiKey });
    const client = new NeynarAPIClient(config);

    const allCasts: any[] = [];
    let cursor: string | undefined = undefined;
    let pageCount = 0;
    const maxPages = 50; // safety cap

    do {
      const resp = await client.fetchCastsForUser({
        fid: Number(fid),
        limit: 150,
        cursor,
        includeReplies: true,
      });
      const casts = (resp as any)?.casts ?? [];
      if (Array.isArray(casts)) {
        allCasts.push(...casts);
      }
      cursor = (resp as any)?.next?.cursor;
      pageCount += 1;
    } while (cursor && pageCount < maxPages);

    return NextResponse.json({
      casts: allCasts,
      fid: Number(fid),
      pageCount,
      truncated: Boolean(cursor),
    });
  } catch (error) {
    console.error("Failed to fetch user casts:", error);
    return NextResponse.json(
      { error: "Failed to fetch user casts." },
      { status: 500 },
    );
  }
}
