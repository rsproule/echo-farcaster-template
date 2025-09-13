import { NextResponse } from "next/server";
import { deleteHandoffState, getHandoffValue } from "~/lib/kv";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state");
  if (!state) {
    return NextResponse.json({ error: "state is required" }, { status: 400 });
  }

  const value = await getHandoffValue(state);
  if (!value) {
    return new Response(null, { status: 204 });
  }

  // Here you could validate the value (e.g., user info) before issuing a session
  const res = NextResponse.json({ ok: true });
  res.headers.append(
    "Set-Cookie",
    [
      `session=session_token_placeholder`,
      "Path=/",
      "HttpOnly",
      "Secure",
      "SameSite=None",
      "Partitioned",
      "Max-Age=1800",
    ].join("; "),
  );

  await deleteHandoffState(state);
  return res;
}
