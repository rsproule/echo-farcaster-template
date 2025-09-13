"use client";

import { sdk } from "@farcaster/miniapp-sdk";
import { useMiniApp } from "@neynar/react";
import { useEffect } from "react";
import { Header } from "~/components/ui/Header";
import { HomeTab } from "~/components/ui/tabs";
import { useNeynarUser } from "../hooks/useNeynarUser";

// --- Types ---
export enum Tab {
  Home = "home",
  Actions = "actions",
  Context = "context",
  Wallet = "wallet",
}

export interface AppProps {
  title?: string;
  signedIn?: boolean;
}

/**
 * App component serves as the main container for the mini app interface.
 *
 * This component orchestrates the overall mini app experience by:
 * - Managing tab navigation and state
 * - Handling Farcaster mini app initialization
 * - Coordinating wallet and context state
 * - Providing error handling and loading states
 * - Rendering the appropriate tab content based on user selection
 *
 * The component integrates with the Neynar SDK for Farcaster functionality
 * and Wagmi for wallet management. It provides a complete mini app
 * experience with multiple tabs for different functionality areas.
 *
 * Features:
 * - Tab-based navigation (Home, Actions, Context, Wallet)
 * - Farcaster mini app integration
 * - Wallet connection management
 * - Error handling and display
 * - Loading states for async operations
 *
 * @param props - Component props
 * @param props.title - Optional title for the mini app (defaults to "Neynar Starter Kit")
 *
 * @example
 * ```tsx
 * <App title="My Mini App" />
 * ```
 */
export default function App(
  { title, signedIn }: AppProps = { title: "Neynar Starter Kit" },
) {
  // --- Hooks ---
  const { isSDKLoaded, context, setInitialTab, setActiveTab, currentTab } =
    useMiniApp();

  // --- Neynar user hook ---
  const { user: neynarUser } = useNeynarUser(context || undefined);

  // --- Effects ---
  /**
   * Sets the initial tab to "home" when the SDK is loaded.
   *
   * This effect ensures that users start on the home tab when they first
   * load the mini app. It only runs when the SDK is fully loaded to
   * prevent errors during initialization.
   */
  useEffect(() => {
    if (isSDKLoaded) {
      setInitialTab(Tab.Home);
    }
  }, [isSDKLoaded, setInitialTab]);

  // Signal readiness to Farcaster so the splash screen can dismiss
  useEffect(() => {
    if (!isSDKLoaded) return;
    // Defer to next tick to ensure initial UI has rendered
    const id = setTimeout(() => {
      try {
        sdk.actions.ready();
      } catch (e) {
        console.error("Failed to call sdk.actions.ready():", e);
      }
    }, 0);
    return () => clearTimeout(id);
  }, [isSDKLoaded]);

  // --- Early Returns ---
  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="spinner h-8 w-8 mx-auto mb-4"></div>
          <p>Loading SDK...</p>
        </div>
      </div>
    );
  }

  // --- Render ---
  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      {/* Header should be full width */}
      <Header neynarUser={neynarUser} />

      {/* Main content and footer should be centered */}
      <div className="container py-2 pb-20">
        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>
        {currentTab === Tab.Home && <HomeTab signedIn={signedIn} />}
      </div>
    </div>
  );
}
