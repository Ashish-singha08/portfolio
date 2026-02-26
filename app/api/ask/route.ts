import { GoogleGenerativeAI } from "@google/generative-ai"
import Groq from "groq-sdk"
import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0)
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
  return dot / (normA * normB)
}

let cachedEmbeddings: any[] | null = null

function loadEmbeddings() {
  if (cachedEmbeddings) return cachedEmbeddings
  const filePath = path.join(process.cwd(), "public", "embeddings.json")
  const raw = fs.readFileSync(filePath, "utf-8")
  cachedEmbeddings = JSON.parse(raw)
  return cachedEmbeddings
}

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json()
    if (!question?.trim()) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 })
    }

    // 1. Embed the question using Gemini
    const embeddingModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" })
    const result = await embeddingModel.embedContent(question)
    const questionEmbedding = result.embedding.values

    // 2. Find top 3 most relevant chunks
    const embeddings = loadEmbeddings()
    const scored = embeddings?.map((item: any) => ({
      ...item,
      score: cosineSimilarity(questionEmbedding, item.embedding),
    }))

    const topChunks = scored?.sort((a: any, b: any) => b.score - a.score)
      .slice(0, 3)

    // 3. Build context
    const context = topChunks?.map((c: any) => `From "${c.source.title}":\n${c.chunk}`)
      .join("\n\n---\n\n")

    // 4. Generate answer with Groq
    const prompt = `You are a helpful assistant for a technical blog by Ashish Singhal, an AI and backend engineer.

Answer the question using ONLY the context provided below. Be concise and practical.
If the answer is not in the context, say "I don't have information on that in my articles yet."

Context:
${context}

Question: ${question}

Answer:`

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
    })

    const answer = completion.choices[0]?.message?.content ?? ""

    // 5. Deduplicate sources
    const seen = new Set()
    const sources = topChunks?.filter((c: any) => {
        if (seen.has(c.source.url)) return false
        seen.add(c.source.url)
        return true
      })
      .map((c: any) => c.source)

    return NextResponse.json({ answer, sources })

  } catch (error) {
    console.error("RAG error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}