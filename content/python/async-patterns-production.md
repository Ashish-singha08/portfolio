---
title: "Async Patterns for Production Python"
summary: "Structuring concurrent Python applications with asyncio — task groups, graceful shutdown, and error boundaries."
date: "2025-01-28"
---

## Beyond async/await

Writing `async def` is the easy part. Building reliable concurrent systems requires understanding task lifecycle management, cancellation semantics, and error propagation.

## Task Groups

Python 3.11 introduced `TaskGroup`, the structured concurrency primitive that should replace `asyncio.gather` in production code.

```python
async def process_batch(items: list[Item]) -> list[Result]:
    async with asyncio.TaskGroup() as tg:
        tasks = [tg.create_task(process(item)) for item in items]
    return [task.result() for task in tasks]
```

The key difference: if any task fails, all other tasks in the group are cancelled. With `asyncio.gather`, you get partial results and potentially leaked tasks.

## Graceful Shutdown

Production services must handle SIGTERM gracefully. This means draining in-flight requests, closing database connections, and flushing buffers.

```python
class GracefulService:
    def __init__(self):
        self.shutdown_event = asyncio.Event()

    async def run(self):
        loop = asyncio.get_event_loop()
        loop.add_signal_handler(signal.SIGTERM, self.shutdown_event.set)

        async with asyncio.TaskGroup() as tg:
            tg.create_task(self.serve())
            tg.create_task(self.wait_for_shutdown())

    async def wait_for_shutdown(self):
        await self.shutdown_event.wait()
        await self.drain_connections()
        raise SystemExit(0)
```

## Semaphores for Rate Limiting

When calling external APIs concurrently, semaphores prevent overwhelming downstream services.

```python
class RateLimitedClient:
    def __init__(self, max_concurrent: int = 10):
        self.semaphore = asyncio.Semaphore(max_concurrent)

    async def fetch(self, url: str) -> Response:
        async with self.semaphore:
            return await self.client.get(url)
```

## Key Takeaways

1. Prefer `TaskGroup` over `asyncio.gather` for structured error handling
2. Always implement graceful shutdown in long-running services
3. Use semaphores to bound concurrency against external resources
4. Design cancellation-aware code from the start
