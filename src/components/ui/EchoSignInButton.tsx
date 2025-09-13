"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "./Button";

export function EchoSignInButton() {
  return (
    <Button
      onClick={async () => {
        console.log("signing in with echo");
        const state = crypto.randomUUID();
        sessionStorage.setItem("echo_handoff_state", state);
        const bridgeUrl = new URL("/echo/bridge", window.location.origin);
        bridgeUrl.searchParams.set("state", state);
        await sdk.actions.openUrl({ url: bridgeUrl.toString() });

        // Poll for handoff completion to mint a partitioned cookie inside the iframe
        const start = Date.now();
        const timeoutMs = 2 * 60 * 1000; // 2 minutes
        const poll = async () => {
          try {
            const res = await fetch(`/api/echo/handoff?state=${state}`, {
              credentials: "include",
            });
            if (res.status === 200) {
              return true;
            }
          } catch {}
          return false;
        };
        while (Date.now() - start < timeoutMs) {
          const ok = await poll();
          if (ok) break;
          await new Promise((r) => setTimeout(r, 1000));
        }
      }}
      size="lg"
    >
      Sign in with Echo
    </Button>
  );
}
