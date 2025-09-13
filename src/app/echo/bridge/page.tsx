"use client";

import { useEffect } from "react";

export default function EchoBridgePage() {
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      let state = params.get("state");
      if (!state) {
        state = crypto.randomUUID();
      }

      // Persist state for the iframe to poll against
      sessionStorage.setItem("echo_handoff_state", state);

      // Redirect into the existing Echo signin handler with state
      const target = new URL("/api/echo/signin", window.location.origin);
      target.searchParams.set("state", state);
      window.location.replace(target.toString());
    };
    run();
  }, []);

  return null;
}
