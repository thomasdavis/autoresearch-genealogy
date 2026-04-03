import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import type { VaultPage } from "./types";

const VAULT_DIR = path.join(process.cwd(), "..", "vault-template");

function resolveWikilinks(content: string): string {
  // Convert [[File_Name]] to markdown links
  return content.replace(/\[\[([^\]]+)\]\]/g, (_, linkText) => {
    const slug = linkText.replace(/\s+/g, "_");
    return `[${linkText}](/pages/${slug})`;
  });
}

async function renderMarkdown(content: string): Promise<string> {
  const resolved = resolveWikilinks(content);
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(resolved);
  return String(result);
}

export async function getAllPages(): Promise<VaultPage[]> {
  if (!fs.existsSync(VAULT_DIR)) {
    return [];
  }
  const files = fs.readdirSync(VAULT_DIR).filter((f) => f.endsWith(".md"));
  const pages: VaultPage[] = [];

  for (const file of files) {
    const filePath = path.join(VAULT_DIR, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const title = slug.replace(/_/g, " ");

    const htmlContent = await renderMarkdown(content);

    pages.push({
      slug,
      title,
      content,
      htmlContent,
      frontmatter: data,
      type: data.type as string | undefined,
      created: data.created ? String(data.created) : undefined,
      updated: data.updated ? String(data.updated) : undefined,
      tags: data.tags as string[] | undefined,
    });
  }

  return pages.sort((a, b) => {
    const da = a.created || "";
    const db = b.created || "";
    return db.localeCompare(da);
  });
}

export async function getPageBySlug(
  slug: string
): Promise<VaultPage | undefined> {
  const filePath = path.join(VAULT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const title = slug.replace(/_/g, " ");
  const htmlContent = await renderMarkdown(content);

  return {
    slug,
    title,
    content,
    htmlContent,
    frontmatter: data,
    type: data.type as string | undefined,
    created: data.created ? String(data.created) : undefined,
    updated: data.updated ? String(data.updated) : undefined,
    tags: data.tags as string[] | undefined,
  };
}

export function getRawContent(filename: string): string {
  const filePath = path.join(VAULT_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return "";
  }
  return fs.readFileSync(filePath, "utf-8");
}
