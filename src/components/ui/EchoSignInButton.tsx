"use client";

import { signIn } from "@merit-systems/echo-next-sdk/client";
import { Button } from "./Button";

export function EchoSignInButton() {
  return (
    <Button
      onClick={() => {
        console.log("signing in with echo");
        signIn();
      }}
      size="lg"
    >
      Sign in with Echo
    </Button>
  );
}
