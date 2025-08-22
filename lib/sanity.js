import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Create Sanity client
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "00ifprlp", // Your Sanity Project ID
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-08-22",
  useCdn: true,
});

// Build image URLs
const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
