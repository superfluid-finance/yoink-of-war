import { getBaseUrl } from "./URLUtils";

export function buildShareUrl(handle: string, battleId: string) {
  const shareUrl = new URL("https://warpcast.com/~/compose");

  shareUrl.searchParams.append(
    "text",
    `Prepare your butt @${handle}. I challenge you to a yoink-off!`
  );
  shareUrl.searchParams.append(
    "embeds",
    `${getBaseUrl()}/api/battle/${battleId}`
  );

  return shareUrl.toString();
}
