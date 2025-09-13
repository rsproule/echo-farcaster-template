import Echo from "@merit-systems/echo-next-sdk";

export const { handlers, isSignedIn, openai, anthropic, getUser } = Echo({
  appId:
    process.env.NEXT_PUBLIC_ECHO_APP_ID ||
    "656137e3-8566-4414-ad13-5bf519843901",
});
