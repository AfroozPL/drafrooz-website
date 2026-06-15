import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type InsightFrontmatter = {
  title: string;
  excerpt: string;
  date: string;
  tags?: string[];
  cover?: string;
};

export type InsightPost = InsightFrontmatter & {
  slug: string;
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

export async function getAllInsights(): Promise<InsightPost[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file) => {
          const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf-8");
          const { data, content } = matter(raw);
          return {
            slug: file.replace(/\.mdx$/, ""),
            content,
            ...(data as InsightFrontmatter),
          };
        }),
    );
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch {
    return [];
  }
}

export async function getInsightBySlug(
  slug: string,
): Promise<InsightPost | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, `${slug}.mdx`),
      "utf-8",
    );
    const { data, content } = matter(raw);
    return {
      slug,
      content,
      ...(data as InsightFrontmatter),
    };
  } catch {
    return null;
  }
}
