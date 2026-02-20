---
title: "Python Data Types & Structures"
summary: "Lists, tuples, sets, and dictionaries — when to use each, how comprehensions work, mutability traps, and the time/space complexity that actually matters."
date: "2026-01-28"
---

# Python Data Types & Structures

## Start Here: The Mental Model

Think of Python's data structures like containers at a hardware store.

- A **list** is like a shopping cart — ordered, you can add or remove items, and things can repeat.
- A **tuple** is like a locked display case — ordered, but nobody's changing what's inside.
- A **set** is like a bag where duplicates automatically fall out — unordered, unique items only.
- A **dictionary** is like a filing cabinet — every item has a label (key) so you can find it instantly.

That mental model alone will carry you pretty far. Now let's go deeper.

---

## Lists — Your Everyday Workhorse

A list is an ordered, mutable sequence. "Mutable" means you can change it after creation.

```python
fruits = ["apple", "banana", "cherry"]
fruits.append("mango")   # adds to end
fruits[0] = "avocado"    # changes first item
```

**When to use a list:**
- You care about order.
- You need to add, remove, or modify items.
- Duplicates are fine or even expected.

**Common pitfall:** Lists are slow for membership checks. If you're writing `if item in my_list` in a tight loop with thousands of items, switch to a set. Checking membership in a list is O(n) — it scans every element. A set does it in O(1).

---

## Tuples — Lightweight and Immutable

A tuple looks like a list but uses parentheses and cannot be changed after creation.

```python
coordinates = (40.7128, -74.0060)  # New York City lat/long
rgb = (255, 128, 0)
```

**When to use a tuple:**
- The data shouldn't change — like coordinates, RGB values, or database records.
- You need to use it as a dictionary key (lists can't be keys because they're mutable).
- You want a small performance edge — tuples use slightly less memory than lists.

**Common confusion:** Some devs avoid tuples entirely and just use lists everywhere. That works, but it misses a signal. When you use a tuple, you're saying "this data is fixed." It communicates intent, and Python also enforces it.

---

## Sets — When Uniqueness Is the Point

A set stores only unique values and doesn't preserve insertion order.

```python
tags = {"python", "backend", "api"}
tags.add("python")  # duplicate — silently ignored
print(tags)  # {"python", "backend", "api"}
```

**When to use a set:**
- You need to eliminate duplicates.
- You want fast membership testing (`in` checks).
- You're doing set operations: union, intersection, difference.

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

print(a & b)  # intersection: {3, 4}
print(a | b)  # union: {1, 2, 3, 4, 5, 6}
print(a - b)  # difference: {1, 2}
```

**Common pitfall:** You can't index a set (`my_set[0]` raises an error). If you need both uniqueness and order, consider a list that you deduplicate, or look into `dict.fromkeys()` which preserves insertion order.

---

## Dictionaries — Key-Value Lookup, Fast

A dictionary maps keys to values. Lookups by key are O(1) — essentially instant regardless of size.

```python
user = {
    "name": "Alice",
    "age": 30,
    "active": True
}

print(user["name"])       # "Alice"
user["email"] = "alice@example.com"  # add a new key
```

**When to use a dictionary:**
- You need to look something up by name or ID.
- You're counting things (`word_count["hello"] += 1`).
- You're grouping data by a category.
- You want structured data without defining a class.

**Common pitfall:** Accessing a key that doesn't exist raises a `KeyError`. Use `.get()` instead for safe access:

```python
# This raises an error if "email" doesn't exist
user["email"]

# This returns None (or a default) if "email" doesn't exist
user.get("email", "no email")
```

---

## List Comprehensions and Dict Comprehensions

These are one-liners for building collections. They're faster than loops and, once you're used to them, more readable.

**List comprehension:**

```python
# The long way
squares = []
for n in range(10):
    squares.append(n ** 2)

# The comprehension way
squares = [n ** 2 for n in range(10)]

# With a filter
even_squares = [n ** 2 for n in range(10) if n % 2 == 0]
```

**Dict comprehension:**

```python
words = ["apple", "banana", "cherry"]
word_lengths = {word: len(word) for word in words}
# {"apple": 5, "banana": 6, "cherry": 6}
```

**When to use them:** When you're transforming or filtering a collection in one step. If the logic gets complex (nested ifs, nested loops), a regular `for` loop is clearer. Comprehensions aren't always better — just often more concise.

---

## Mutable vs Immutable — Why It Matters

**Mutable** objects can be changed after creation: lists, dicts, sets.  
**Immutable** objects cannot: integers, floats, strings, tuples.

This distinction has practical consequences.

```python
# Strings are immutable — this creates a NEW string, doesn't change the original
name = "alice"
name.upper()       # returns "ALICE", but name is still "alice"
name = name.upper()  # now name is "ALICE"
```

The bigger trap is with mutable default arguments in functions:

```python
# DON'T do this
def add_item(item, my_list=[]):
    my_list.append(item)
    return my_list

add_item("a")  # ["a"]
add_item("b")  # ["a", "b"] — the list persists between calls!

# DO this instead
def add_item(item, my_list=None):
    if my_list is None:
        my_list = []
    my_list.append(item)
    return my_list
```

This trips up almost every Python developer at least once. The default list is created once when the function is defined, not each time it's called.

---

## Time and Space Complexity — The Practical Summary

You don't need to memorize every operation, but these are the ones that matter most in practice.

| Operation | List | Set | Dict |
|---|---|---|---|
| Access by index | O(1) | — | — |
| Access by key | — | — | O(1) |
| Membership test (`in`) | O(n) | O(1) | O(1) |
| Append / Add | O(1) | O(1) | O(1) |
| Insert at position | O(n) | — | — |
| Delete by value | O(n) | O(1) | O(1) |

The one to internalize first: **membership testing in a list is slow**. If you're checking `if x in collection` frequently, use a set or dict instead.

Space-wise, sets and dicts consume more memory than lists because they maintain hash tables internally. For small datasets this doesn't matter. For millions of records, it might.

---

## Takeaway

- **List** when order matters and data changes.
- **Tuple** when data is fixed and order matters.
- **Set** when you need uniqueness and fast lookups.
- **Dict** when you need to find things by a key.

Use **comprehensions** to build collections cleanly, but keep them readable. Understand **mutability** so you don't get surprised by shared state. And know that **`in` checks on a list** are linear — if you're doing many of them, reach for a set.

These aren't just syntax rules. Each choice communicates intent to the next person reading your code — including future you.