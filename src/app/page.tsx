import { Metadata } from "next";
import { isSignedIn } from "~/echo";
import { APP_DESCRIPTION, APP_NAME, APP_OG_IMAGE_URL } from "~/lib/constants";
import { getMiniAppEmbedMetadata } from "~/lib/utils";
import App from "./app";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: APP_NAME,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [APP_OG_IMAGE_URL],
    },
    other: {
      "fc:frame": JSON.stringify(getMiniAppEmbedMetadata()),
    },
  };
}

export default async function Home() {
  const signedIn = await isSignedIn();
  return <App signedIn={signedIn} />;
}
