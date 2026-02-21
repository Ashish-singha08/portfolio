---
title: "Decorators in Python: A Deep Dive"
summary: "Exploring the mechanics of decorators beyond the basics — metaclasses, descriptor protocols, and practical patterns for production code."
date: "2026-01-15"
---

## Why Decorators Matter

Decorators are one of Python's most powerful metaprogramming features. At their core, they're syntactic sugar for higher-order functions — but understanding their full depth unlocks patterns that can dramatically simplify complex codebases.

> Note: If you're new to Python metaprogramming, start by fully understanding closures and first-class functions before diving into decorators.

## Beyond the Basics

Most tutorials cover the simple case:

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Before")
        result = func(*args, **kwargs)
        print("After")
        return result
    return wrapper
```

But production decorators need to handle edge cases: preserving function signatures, working with methods vs. functions, supporting both `@decorator` and `@decorator()` syntax, and integrating with type checkers.

## The Descriptor Protocol Connection

When you apply a decorator to a method inside a class, Python's descriptor protocol comes into play. Understanding `__get__`, `__set__`, and `__delete__` is essential for writing decorators that work correctly in class contexts.

```python
import functools

class CachedProperty:
    def __init__(self, func):
        self.func = func
        self.attrname = None
        functools.update_wrapper(self, func)

    def __set_name__(self, owner, name):
        self.attrname = name

    def __get__(self, instance, owner=None):
        if instance is None:
            return self
        cache = instance.__dict__
        val = cache.get(self.attrname)
        if val is None:
            val = self.func(instance)
            cache[self.attrname] = val
        return val
```

## Practical Patterns

### Retry with Exponential Backoff

```python
def retry(max_attempts=3, backoff_factor=2):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(max_attempts):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts - 1:
                        raise
                    await asyncio.sleep(backoff_factor ** attempt)
        return wrapper
    return decorator
```

### Type-Safe Validation

```python
def validate_types(**expected_types):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for param, expected in expected_types.items():
                if param in kwargs and not isinstance(kwargs[param], expected):
                    raise TypeError(f"{param} must be {expected.__name__}")
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

> Common mistake: Forgetting to use `functools.wraps` inside your wrapper function. Without it, the decorated function loses its `__name__`, `__doc__`, and module info, breaking debugging and introspection.

## Key Takeaways

1. Always use `functools.wraps` to preserve metadata
2. Design decorators that work with both sync and async functions
3. Consider the descriptor protocol when decorating methods
4. Support both `@decorator` and `@decorator()` invocation styles
5. Write type stubs for complex decorators to maintain IDE support
