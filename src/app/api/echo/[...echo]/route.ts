import { NextResponse } from "next/server";
import { handlers } from "~/echo";
import { setHandoffReady } from "~/lib/kv";

// Wrap the GET to intercept a successful return that includes ?state=
export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const state = url.searchParams.get("state");

  // Delegate first so Echo can complete its flow and build a response
  const result = await (handlers as any).GET(request);

  try {
    // If Echo completed and a state param was provided, mark handoff ready
    if (state) {
      await setHandoffReady(state, { ok: true }, 120);
    }
  } catch {}

  return result as NextResponse;
};

export const POST = (handlers as any).POST as (
  request: Request,
) => Promise<Response>;
