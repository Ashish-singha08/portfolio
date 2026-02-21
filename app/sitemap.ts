import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BASE_URL = "https://ashishsinghal.dev";
const BUILD_TIME = new Date();

export default function sitemap() {
  const contentDir = path.join(process.cwd(), "content");

  const urls = [
    {
      url: BASE_URL,
      lastModified: BUILD_TIME,
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/insights`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  if (!fs.existsSync(contentDir)) return urls;

  const categories = fs.readdirSync(contentDir);

  categories.forEach((category) => {
    const categoryPath = path.join(contentDir, category);
    if (!fs.statSync(categoryPath).isDirectory()) return;

    urls.push({
      url: `${BASE_URL}/insights/${category}`,
      lastModified: BUILD_TIME,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    });

    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".md"));

    files.forEach((file) => {
      const slug = file.replace(".md", "");
      const filePath = path.join(categoryPath, file);

      let lastModified = BUILD_TIME;

      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);

        if (data.date) {
          const parsed = new Date(data.date);
          if (!isNaN(parsed.getTime())) {
            lastModified = parsed;
          }
        }
      } catch {
        // fallback = BUILD_TIME
      }

      urls.push({
        url: `${BASE_URL}/insights/${category}/${slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.5, // Correct relative importance
      });
    });
  });

  return urls;
}
