/**
 * Mock adapter for Instagram social feed.
 * Transforms the Instagram scraper JSON into SocialPost format.
 * Used as temporary fallback when no real API data is available.
 */

import type { SocialPost } from "@/app/[locale]/(site)/_components/social-feed";
import dataset from "./dataset_instagram-scraper_2026-07-08_04-45-10-103.json";

type InstagramItem = {
  id: string;
  type: "Video" | "Image";
  shortCode: string;
  caption?: string;
  displayUrl: string;
  videoUrl?: string;
  ownerUsername: string;
  timestamp: string;
  likesCount: number;
  media_url?: string;
  media_type?: string;
  url?: string;
};

function transformPost(item: InstagramItem): SocialPost {
  const isVideo = item.type === "Video";
  return {
    id: item.id,
    image: item.displayUrl,
    media_url: isVideo ? item.videoUrl : item.displayUrl,
    media_type: isVideo ? "VIDEO" : "IMAGE",
    caption: item.caption ?? "",
    username: item.ownerUsername,
    timestamp: item.timestamp,
    permalink: `https://www.instagram.com/p/${item.shortCode}/`,
    likes: item.likesCount,
    opacity: 1,
  };
}

/**
 * Returns up to `limit` mock Instagram posts for the social feed.
 */
export function getMockSocialFeedPosts(limit = 12): SocialPost[] {
  const items = dataset as InstagramItem[];
  return items.slice(0, limit).map(transformPost);
}

export type { SocialPost };
