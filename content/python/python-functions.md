---
title: "Python Functions: Arguments, Scope, Lambdas, and First-Class Behavior"
summary: "A practical guide to how Python functions work — from how you pass arguments to how variables are scoped and why functions are more powerful than they first appear."
date: "2026-02-20"
---

# Python Functions: Arguments, Scope, Lambdas, and First-Class Behavior

## Function Arguments: Positional, Keyword, and Default

When you call a function, you need to pass it data. Python gives you three ways to do that.

**Positional** arguments are matched by order. The first value goes to the first parameter, and so on.

```python
def greet(name, age):
    print(f"{name} is {age}")

greet("Alice", 30)  # name="Alice", age=30
```

**Keyword** arguments let you name the parameter explicitly, so order doesn't matter.

```python
greet(age=30, name="Alice")  # same result
```

**Default** arguments give a parameter a fallback value if nothing is passed.

```python
def greet(name, age=25):
    print(f"{name} is {age}")

greet("Bob")  # age defaults to 25
```

> **Common mistake:** Never use a mutable object (like a list or dict) as a default value. It's shared across all calls.
> ```python
> # BAD
> def add_item(item, items=[]):
>     items.append(item)
>     return items
>
> # GOOD
> def add_item(item, items=None):
>     if items is None:
>         items = []
>     items.append(item)
>     return items
> ```

---

## `*args` and `**kwargs`

Sometimes you don't know how many arguments a caller will pass. That's where these come in.

`*args` collects extra **positional** arguments into a tuple.

```python
def total(*args):
    return sum(args)

total(1, 2, 3)   # 6
total(10, 20)    # 30
```

`**kwargs` collects extra **keyword** arguments into a dict.

```python
def display(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

display(name="Alice", city="London")
```

You can combine them. The order must be: positional → `*args` → keyword → `**kwargs`.

```python
def example(a, b, *args, key="default", **kwargs):
    pass
```

These are useful when writing wrappers, decorators, or any function that needs to be flexible about what it receives.

---

## Lambda Functions

A lambda is just a small, anonymous function — one that you write inline without using `def`.

```python
square = lambda x: x * x
square(5)  # 25
```

Lambdas are limited to a single expression. No loops, no multiple statements.

They're most useful when passing a short function as an argument, like with `sorted` or `map`.

```python
names = ["Charlie", "Alice", "Bob"]
sorted(names, key=lambda name: len(name))
# ["Bob", "Alice", "Charlie"]
```

> **When to use them:** Only when the function is truly throwaway and short. If you find yourself writing a complex lambda, define a proper function instead — it'll be easier to read and test.

---

## Scope: Local, Global, and Nonlocal

Scope controls where a variable can be seen and modified.

**Local** scope means a variable lives inside a function. It disappears when the function returns.

```python
def foo():
    x = 10  # local to foo
```

**Global** scope means a variable is defined at the top level of a file and can be read from anywhere.

```python
x = 10

def foo():
    print(x)  # reads the global x — this works
```

But if you try to *assign* to a global variable inside a function, Python creates a new local variable instead. To actually modify the global, you need to declare it.

```python
x = 10

def foo():
    global x
    x = 20  # now modifies the global x
```

**Nonlocal** handles the case where you have a nested function and want to modify a variable in the enclosing (but not global) function.

```python
def outer():
    count = 0

    def inner():
        nonlocal count
        count += 1

    inner()
    print(count)  # 1
```

> **Rule of thumb:** Avoid using `global` in production code. It makes functions harder to reason about and test. Prefer passing values in and returning them out.

---

## First-Class Functions

In Python, functions are objects. You can store them in variables, pass them to other functions, and return them from functions. This is what "first-class" means.

**Storing a function in a variable:**

```python
def say_hello():
    print("Hello")

greet = say_hello
greet()  # Hello
```

**Passing a function as an argument:**

```python
def run(func):
    func()

run(say_hello)  # Hello
```

**Returning a function from a function:**

```python
def make_multiplier(n):
    def multiply(x):
        return x * n
    return multiply

double = make_multiplier(2)
double(5)  # 10
```

This last pattern — returning a function that "remembers" a value from its enclosing scope — is called a **closure**. It's the foundation of decorators and many functional patterns in Python.

---

## Takeaways

- Use positional args for required inputs, keyword args for clarity, and defaults for optional config.
- `*args` and `**kwargs` make functions flexible — use them for wrappers and generic utilities.
- Lambdas are useful inline, but don't overuse them. If it needs a name, write a real function.
- Variables follow LEGB scope: Local → Enclosing → Global → Built-in. Avoid `global`; prefer returning values.
- Functions are objects. Passing them around and returning them unlocks powerful patterns like closures and decorators.