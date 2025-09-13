"use client";

import { useEcho } from "@merit-systems/echo-next-sdk/client";
import { useMiniApp } from "@neynar/react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../Button";
import { EchoSignInButton } from "../EchoSignInButton";

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
export function HomeTab({ signedIn }: { signedIn?: boolean }) {
  const echo = useEcho();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<number | null>(null);
  const { context } = useMiniApp();
  console.log("context", context);
  const fid = useMemo(() => context?.user?.fid, [context?.user?.fid]);
  const [totalCasts, setTotalCasts] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const result = await echo.balance.getBalance();
        setBalance(typeof result?.balance === "number" ? result.balance : null);
      } catch (_err) {
        setBalance(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [echo]);

  // Load total casts when we have a fid
  useEffect(() => {
    if (!fid) {
      setTotalCasts(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/farcaster/user-casts?fid=${fid}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setTotalCasts(Array.isArray(data?.casts) ? data.casts.length : null);
      } catch (_err) {
        if (!cancelled) return;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fid]);
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)] px-6">
      <div className="text-center w-full max-w-md mx-auto">
        <p className="text-lg mb-2">FID: {fid}</p>
        {fid && totalCasts !== null && (
          <p className="text-sm mt-1">Total casts: {totalCasts}</p>
        )}
        <p>Total casts: {totalCasts}</p>
        {!loading && !signedIn && (
          <div className="mt-4">
            <EchoSignInButton />
          </div>
        )}
        {!loading && signedIn && balance !== null && (
          <div className="mt-4 text-base">
            Balance:{" "}
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "USD",
            }).format(balance)}
          </div>
        )}
        {!loading && balance !== null && fid && (
          <div className="mt-3">
            <Button
              onClick={async () => {
                const res = await fetch(`/api/farcaster/user-casts?fid=${fid}`);
                if (!res.ok) {
                  const text = await res.text();
                  alert(`Failed to generate report: ${text}`);
                  return;
                }
                const data = await res.json();
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `farcaster-report-fid-${fid}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              }}
            >
              Generate Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
