import { statSync } from "node:fs";
import { join } from "node:path";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

type IndexedPage = {
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  file: string;
  images?: string[];
  path: string;
  priority: number;
};

const indexedPages: IndexedPage[] = [
  {
    path: "",
    file: "page.tsx",
    changeFrequency: "weekly",
    priority: 1,
    images: [`${siteUrl}/ethan-rozee.jpeg`],
  },
  {
    path: "writing",
    file: "writing/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "contact",
    file: "contact/page.tsx",
    changeFrequency: "yearly",
    priority: 0.5,
  },
];

function getLastModified(file: string) {
  return statSync(join(process.cwd(), "src/app", file)).mtime;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return indexedPages.map(({ changeFrequency, file, images, path, priority }) => ({
    url: path ? `${siteUrl}/${path}` : siteUrl,
    lastModified: getLastModified(file),
    changeFrequency,
    priority,
    images,
  }));
}
