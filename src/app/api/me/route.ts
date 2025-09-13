import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUser } from "~/echo";

const ALLOW_ORIGIN = "https://warpcast.com";

export async function GET() {
  const session = (await cookies()).get("session")?.value;
  if (!session) {
    return NextResponse.json(
      { error: "unauthorized" },
      {
        status: 401,
        headers: {
          "Access-Control-Allow-Origin": ALLOW_ORIGIN,
          "Access-Control-Allow-Credentials": "true",
          Vary: "Origin",
        },
      },
    );
  }
  const user = await getUser();
  return NextResponse.json(
    { user },
    {
      headers: {
        "Access-Control-Allow-Origin": ALLOW_ORIGIN,
        "Access-Control-Allow-Credentials": "true",
        Vary: "Origin",
      },
    },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      Vary: "Origin",
    },
  });
}
