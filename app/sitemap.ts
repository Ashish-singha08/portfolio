import fs from "fs";
import path from "path";

const BASE_URL = "https://ashishsinghaldev.netlify.app";

export default function sitemap() {
  const contentDir = path.join(process.cwd(), "content");

  const categories = fs.readdirSync(contentDir);

  const urls = [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
  ];

  categories.forEach((category) => {
    const categoryPath = path.join(contentDir, category);
    const files = fs.readdirSync(categoryPath);

    // Category page
    urls.push({
      url: `${BASE_URL}/insights/${category}`,
      lastModified: new Date(),
    });

    files.forEach((file) => {
      const slug = file.replace(".md", "");

      urls.push({
        url: `${BASE_URL}/insights/${category}/${slug}`,
        lastModified: new Date(),
      });
    });
  });

  return urls;
}
