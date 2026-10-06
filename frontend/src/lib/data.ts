import "server-only";

import { unstable_rethrow } from "next/navigation";
import { cache } from "react";

import { getCategories, getSiteSettings } from "./api";
import { FALLBACK_SETTINGS } from "./fallback";

/** Site settings for layout/metadata; falls back to verified contacts if
 * the API is briefly unavailable so contact actions keep working. */
export const loadSettings = cache(async () => {
  try {
    return await getSiteSettings();
  } catch (error) {
    unstable_rethrow(error);
    console.error("Site settings unavailable, using fallback contacts:", error);
    return FALLBACK_SETTINGS;
  }
});

export const loadCategories = cache(async () => {
  try {
    return await getCategories();
  } catch (error) {
    unstable_rethrow(error);
    console.error("Categories unavailable:", error);
    return [];
  }
});
