import { ImageResponse } from "next/og"
import { getPost } from "@/lib/content"

export const runtime = "nodejs"
export const alt = "Article cover"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OGImage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const post = getPost(category, slug)
  const title = post?.title ?? "Insight"
  const cat = post?.category ?? category

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#080808",
          color: "#ededed",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top: category */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#888",
            }}
          >
            {cat}
          </div>
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "#333",
            }}
          />
        </div>

        {/* Center: title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
              maxWidth: "900px",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom: site name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontSize: 16, color: "#666" }}>
            ashishsinghal.dev
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Ashish Singhal
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
