"use client";

import { signIn } from "@merit-systems/echo-next-sdk/client";
import { Button } from "../Button";

/**
 * HomeTab component displays the main landing content for the mini app.
 *
 * This is the default tab that users see when they first open the mini app.
 * It provides a simple welcome message and placeholder content that can be
 * customized for specific use cases.
 *
 * @example
 * ```tsx
 * <HomeTab />
 * ```
 */
export function HomeTab() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
      <div className="text-center w-full max-w-md mx-auto">
        <p className="text-lg mb-2">Put your content here!</p>
        <div className="mt-4">
          <Button onClick={() => signIn()} size="lg">
            Sign in with Echo
          </Button>
        </div>
      </div>
    </div>
  );
}
