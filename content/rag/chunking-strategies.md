---
title: "How to Choose Chunk Size for RAG (With 7 Chunking Strategies & Trade-offs)"
summary: "A developer-focused guide to chunk size selection in Retrieval-Augmented Generation (RAG), covering fixed, sliding window, recursive, semantic, and LLM-based chunking — with real failure modes and tuning advice."
date: "2026-02-23"
---

# How to Choose Chunk Size for RAG (With 7 Chunking Strategies & Trade-offs)

## What Is Chunking?

When you build a RAG (Retrieval-Augmented Generation) system, you can't feed an entire 200-page document into an LLM at once. So you split it into smaller pieces — **chunks** — store them in a vector database, and retrieve only the relevant ones at query time.

Chunking is that splitting step. It sounds simple. It isn't.

The way you split text directly affects what your LLM can find and how well it can answer. A bad chunk gives the model half a thought. A good chunk gives it exactly the context it needs.

> Note: Chunking is not just a pre-processing step. It's a design decision that shapes your entire retrieval pipeline's quality. Getting it wrong means your LLM confidently answers from the wrong context — or misses the answer entirely.

---

## Why One Strategy Doesn't Fit All

Think of chunking like packing boxes. If you throw everything into boxes of exactly the same size, a short poem and a legal contract end up treated the same way. That's a problem — they have completely different structures and meaning densities.

Different documents, different use cases, and different queries all need different chunking approaches. The seven strategies below each solve a specific problem. Know which one to reach for.

---

## A Word on Tokens vs Characters

Before diving in, one critical clarification: **LLMs think in tokens, not characters.**

A token is roughly 3–4 characters in English. `chunk_size=500` in character terms is approximately 125–170 tokens — not 500 tokens. This gap matters because your embedding model and LLM both have **token-based** context limits, not character limits.

> Common mistake: Assuming character-based chunk sizes map directly to LLM token limits. A 500-character chunk is roughly 125 tokens — not 500. Always verify chunk sizes in tokens, not characters, when working near context limits.

The code examples below that use character slicing are kept simple for readability. In production, use a tokenizer:

```python
import tiktoken

def token_count(text, model="gpt-3.5-turbo"):
    enc = tiktoken.encoding_for_model(model)
    return len(enc.encode(text))

def fixed_token_chunk(text, chunk_size_tokens=256, model="gpt-3.5-turbo"):
    enc = tiktoken.encoding_for_model(model)
    tokens = enc.encode(text)
    chunks = []
    for i in range(0, len(tokens), chunk_size_tokens):
        chunk_tokens = tokens[i:i + chunk_size_tokens]
        chunks.append(enc.decode(chunk_tokens))
    return chunks
```

> Rule of thumb: For most embedding models, 200–400 tokens per chunk is the practical sweet spot. Too small loses context; too large dilutes the signal and retrieves noisy results.

---

## The Seven Chunking Strategies

### 1. Fixed-Size Chunking

Split text into chunks of exactly N tokens (or characters for quick prototyping), regardless of content.

```python
# Character-based — for illustration only, not token-accurate
def fixed_size_chunk(text, chunk_size=500):
    # NOTE: chunk_size here is in characters (~125–170 tokens)
    # Use the token-aware version above for production
    return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]
```

**How it works:** Count to your limit, cut, repeat. No understanding of content structure.

> When to use: Quick prototypes, homogeneous data like logs or CSVs, when speed matters more than precision.

> Warning: It cuts mid-sentence or mid-word. "The patient should not take aspirin with..." gets split right before the critical part. Never use this for medical, legal, or any precision-sensitive content.

**Where it excels:** Uniform data like chat logs or structured records where each line is self-contained.

**Where it fails:** Narrative text, code, or legal documents where a sentence split destroys meaning.

---

### 2. Sliding Window Chunking

Same as fixed-size, but each chunk overlaps with the previous one by a set number of tokens.

```python
def sliding_window_chunk(text, chunk_size=500, overlap=100):
    # chunk_size and overlap are in characters here
    # Scale to tokens in production (overlap ≈ 20-15% of chunk_size is typical)
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks
```

**How it works:** Move a window across the text, but slide it forward by less than the full chunk size. The repeated section is the overlap — a safety net for information that lands at a boundary.

> When to use: When critical information might fall at the boundary of two chunks. A good default addition to any character or token-based strategy.

> Common mistake: Setting overlap too high (e.g., 80% of chunk size). You'll get near-duplicate chunks, bloated storage, slower retrieval, and redundant results. Keep overlap at 10–20% of chunk size.

**Where it excels:** Long-form articles where a key sentence might land at the edge of a chunk.

**Where it fails:** Still cuts through sentences — just less often. Not a substitute for structure-aware splitting.

---

### 3. Paragraph Chunking

Split on paragraph boundaries — double newlines or other natural text breaks.

```python
def paragraph_chunk(text, max_tokens=400):
    paragraphs = text.split("\n\n")
    chunks, current, current_len = [], [], 0

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
        # Rough token estimate: characters / 4
        para_len = len(para) // 4
        if current_len + para_len > max_tokens and current:
            chunks.append("\n\n".join(current))
            current, current_len = [], 0
        current.append(para)
        current_len += para_len

    if current:
        chunks.append("\n\n".join(current))
    return chunks
```

**How it works:** Respect the author's own structure. Each paragraph becomes a chunk, grouped if they're short.

> When to use: Articles, blog posts, books — any content where paragraphs represent one complete idea.

**Where it excels:** Editorial content. Each paragraph usually covers one topic, so retrieval maps naturally to user intent.

**Where it fails:** Academic papers sometimes have 500-word paragraphs. One chunk becomes too large to embed meaningfully, and the signal gets diluted.

---

### 4. Sentence Chunking

Split on sentence boundaries, then group N sentences per chunk.

```python
import nltk

def sentence_chunk(text, sentences_per_chunk=3):
    sentences = nltk.sent_tokenize(text)
    chunks = []
    for i in range(0, len(sentences), sentences_per_chunk):
        chunk = " ".join(sentences[i:i + sentences_per_chunk])
        chunks.append(chunk)
    return chunks
```

> Note: `nltk.sent_tokenize` handles abbreviations and edge cases better than splitting on `.` alone. Download the punkt tokenizer first with `nltk.download('punkt')`.

**How it works:** Detect sentence endings, group N sentences per chunk.

> When to use: When you need finer granularity than paragraphs — FAQs, support docs, anywhere answers live in 1–3 sentences.

**Where it excels:** Short, self-contained answers. Great retrieval precision when questions map to a single sentence or two.

**Where it fails:** Technical documentation where a concept builds across many sentences. Splitting too fine loses the context that makes an answer meaningful.

---

### 5. Recursive / Hierarchical Chunking

Try to split by the largest meaningful unit first (section → paragraph → sentence → word), falling back only when a chunk still exceeds your size limit.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,        # characters (~250 tokens)
    chunk_overlap=100,      # characters (~25 tokens)
    separators=["\n\n", "\n", ".", "!", "?", " ", ""]
)
chunks = splitter.split_text(text)
```

**How it works:** Try `\n\n` first. If the result is still too large, try `\n`. Still too large? Try `.`. It cascades down the hierarchy until chunks fit your size limit.

> Rule of thumb: This is the safest general-purpose strategy. If you don't know which strategy to use, start here.

**Where it excels:** Mixed documents — a PDF with headers, paragraphs, bullet points, and code all in one file.

**Where it fails:** Documents with no natural separators (e.g., one giant unformatted string). The fallback to character splitting will kick in and you're back to fixed-size behavior.

---

### 6. Semantic Chunking

Group sentences together as long as they're semantically similar. Start a new chunk when the topic shifts — measured by a drop in embedding similarity between consecutive sentences.

```python
from sentence_transformers import SentenceTransformer
import numpy as np
import nltk

model = SentenceTransformer("all-MiniLM-L6-v2")

def cosine_similarity(a, b):
    # Explicit cosine similarity — dot product alone is NOT cosine similarity
    # unless vectors are already normalized
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def semantic_chunk(text, threshold=0.75):
    sentences = nltk.sent_tokenize(text)
    if len(sentences) < 2:
        return [text]

    embeddings = model.encode(sentences, normalize_embeddings=True)
    # With normalize_embeddings=True, dot product == cosine similarity
    # Without it, you MUST divide by the product of norms

    chunks, current = [], [sentences[0]]
    for i in range(1, len(sentences)):
        sim = np.dot(embeddings[i - 1], embeddings[i])  # valid only because normalized
        if sim < threshold:
            chunks.append(" ".join(current))
            current = []
        current.append(sentences[i])

    chunks.append(" ".join(current))
    return chunks
```

> Warning: Computing `np.dot(a, b)` is only cosine similarity if vectors are unit-normalized. If you use raw embeddings without normalization, always compute: `np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))`. Getting this wrong silently produces invalid similarity scores and unpredictable chunk boundaries.

**How it works:** Embed each sentence. When two consecutive sentences are semantically far apart (cosine similarity drops below your threshold), cut there.

> When to use: Long documents that cover multiple topics — whitepapers, research reports, multi-section manuals — where structural markers like headers may be absent.

**Where it excels:** Finding natural topic transitions that fixed-size or paragraph methods would miss. Chunks are more topically coherent, which improves retrieval precision.

**Where it fails:** Slow and expensive at scale (you're embedding every sentence). Threshold tuning is non-trivial — too tight and you over-split, too loose and unrelated content merges. Start at 0.7–0.8 and evaluate with your actual queries.

---

### 7. LLM-Based Chunking

Ask an LLM to read the document and decide where to split it — the way a human editor would.

```python
import anthropic
import json

client = anthropic.Anthropic()

def llm_chunk(text):
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{
            "role": "user",
            "content": f"""Split the following text into logically self-contained chunks.
Each chunk should cover one complete idea or topic.

Return ONLY a valid JSON array. Each element should have:
- "title": a short label describing the chunk's topic
- "content": the chunk text

Text to split:
{text}"""
        }]
    )

    raw = response.content[0].text
    # Strip markdown code fences if the model wraps its output
    clean = raw.strip().removeprefix("```json").removesuffix("```").strip()
    return json.loads(clean)
```

**How it works:** The LLM reads the full text, understands it, and makes intelligent split decisions. It can handle unusual structures, implicit topic shifts, and domain-specific logic that no rule can encode.

> When to use: High-value documents where quality matters more than cost — legal contracts, clinical notes, complex technical specs with irregular structure.

**Where it excels:** Unstructured or unusual documents where rules-based methods struggle. The model can understand authorial intent, not just whitespace patterns.

**Where it fails:** Expensive and slow. At scale, this can cost 10–100x more than other methods. LLM context limits also mean very long documents need a pre-pass to break them into sections first. Not viable for bulk ingestion pipelines.

> Warning: LLMs sometimes wrap JSON in markdown fences (` ```json `) even when you ask for raw JSON. Always strip fences before parsing, or your `json.loads()` will throw.

---

## How to Choose: A Decision Framework

Before picking a strategy, answer these three questions:

**1. What's the structure of your document?**
Well-structured (headers, paragraphs) → Recursive or Paragraph. Unstructured blob → Semantic or LLM. Uniform/tabular → Fixed-size.

**2. How large is your dataset?**
Thousands of documents → Recursive or Fixed-size. Dozens of high-value documents → Semantic or LLM.

**3. What kind of queries will you serve?**
Short factual queries → Smaller chunks (200–300 tokens). Reasoning-heavy queries needing context → Larger chunks (400–600 tokens).

> Rule of thumb: Start with recursive chunking at 300 tokens with 10–15% overlap. Measure retrieval quality. Only then optimize.

---

## Quick Comparison

| Strategy | Speed | Cost | Semantic Quality | Best For |
|---|---|---|---|---|
| Fixed-size | ⚡ Fastest | 💰 Lowest | ⭐ Basic | Logs, prototypes |
| Sliding window | ⚡ Fast | 💰 Low | ⭐⭐ Better | Boundary-sensitive text |
| Paragraph | ⚡ Fast | 💰 Low | ⭐⭐ Good | Articles, blogs |
| Sentence | ⚡ Fast | 💰 Low | ⭐⭐ Good | FAQs, short answers |
| Recursive | 🔄 Medium | 💰 Low | ⭐⭐⭐ Great | Mixed documents **(default)** |
| Semantic | 🐢 Slow | 💰 Medium | ⭐⭐⭐ Great | Multi-topic long docs |
| LLM-based | 🐢 Slowest | 💰 High | ⭐⭐⭐⭐ Best | High-value unstructured docs |

---

## Takeaways

- Chunking is a core RAG design decision — bad chunks mean bad retrieval, regardless of how good your LLM is.
- **Characters ≠ tokens.** Always think in tokens when sizing chunks. 500 characters ≈ 125 tokens.
- **Start with recursive chunking** at 200–400 tokens with 10–15% overlap. It handles most document types well.
- Use **semantic chunking** when documents shift topics without structural markers like headers.
- Reserve **LLM chunking** for high-value documents — the quality jump is real, but so is the cost.
- When computing similarity between embeddings, use **cosine similarity**, not raw dot product — unless your vectors are explicitly unit-normalized.
- Retrieval quality is your real metric. After chunking, test with real queries and measure whether the right chunks come back. Chunk size tuning without this feedback loop is guesswork.
- Smaller chunks improve retrieval precision (finding the right chunk). Larger chunks improve answer quality (giving the model enough context). You're always balancing both.