import { NextResponse } from "next/server";

export async function POST() {
  // TODO: generate a real session/jwt tied to the Echo user
  const value = "session_token_placeholder";

  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    [
      `session=${value}`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=None",
      "Partitioned",
      "Max-Age=1800",
    ].join("; "),
  );
  return res;
}
