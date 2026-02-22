---
title: "RAG Evaluation Metrics That Actually Matter"
summary: "Moving beyond basic recall — measuring faithfulness, relevance, and answer quality in retrieval-augmented systems."
date: "2026-01-15"
---

## The Measurement Problem

Most RAG evaluations test retrieval recall and call it a day. But retrieval quality is necessary, not sufficient. A production RAG system can retrieve perfect context and still generate incorrect answers.

## The Three Pillars

### 1. Retrieval Quality

Traditional IR metrics still apply, but with nuance:

```python
def retrieval_metrics(retrieved, ground_truth):
    return {
        "recall@5": len(set(retrieved[:5]) & ground_truth) / len(ground_truth),
        "precision@5": len(set(retrieved[:5]) & ground_truth) / 5,
        "mrr": next(
            (1 / (i + 1) for i, doc in enumerate(retrieved) if doc in ground_truth),
            0
        ),
    }
```

### 2. Faithfulness

Does the generated answer actually follow from the retrieved context? This catches hallucinations that sound plausible but aren't grounded in the source material.

### 3. Answer Relevance

Is the generated answer actually addressing the user's question? High faithfulness with low relevance means your system is accurately summarizing the wrong information.

## Building an Evaluation Pipeline

Automate evaluation as part of your CI/CD pipeline. Every change to chunking, retrieval, or prompting should trigger evaluation against a curated test set.

## Key Takeaways

Measure faithfulness and relevance alongside retrieval quality. Automate evaluation. Build test sets from real user queries, not synthetic data.
