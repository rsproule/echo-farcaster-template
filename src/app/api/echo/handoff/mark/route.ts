import { NextResponse } from "next/server";
import { setHandoffReady } from "~/lib/kv";

export async function POST(request: Request) {
  try {
    const { state, data } = await request.json();
    if (!state) {
      return NextResponse.json({ error: "state is required" }, { status: 400 });
    }

    // Data can include minimal user info or just a success flag
    await setHandoffReady(state, data ?? { ok: true }, 120);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
}
