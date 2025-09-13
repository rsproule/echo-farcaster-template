"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { Button } from "./Button";
import { signIn } from "@merit-systems/echo-next-sdk/client";

export function EchoSignInButton() {
  return (
    <Button
      onClick={async () => {
        console.log("signing in with echo");
        // await sdk.actions.openUrl({
        //   url: "https://echo-farcaster-template.vercel.app/api/echo/signin",
        // });
        signIn();
      }}
      size="lg"
    >
      Sign in with Echo
    </Button>
  );
}
