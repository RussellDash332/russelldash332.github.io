# Why Python recursion sucks for competitive programming
1 July 2025

Having done several competitive programming (CP) problems in pure Python, it is safe to say that recursion is worse for most instances, especially for problems with tight memory or time limit.

While it's simpler to implement and shorter to code, here are some reasons I can think of spontaneously on why Python recursion costs more than it benefits (as opposed to iteration, obviously).

## 1. Recursion limit

By default, Python's recursion limit is 1000, which can be obtained from `import sys; print(sys.getrecursionlimit())`. For most CP questions, this value will not be enough, causing `RecursionError` on your program run as known as the Run-Time Error (RTE) verdict.

Despite being able to change this value by doing `sys.setrecursionlimit(...)`, there are some caveats: values that are too high will exceed the memory limit (MLE) to store the recursive call stacks, while sufficiently high values might still slow down the program, causing a Time Limit Exceeded (TLE) verdict.

Take this question from Kattis as an example: [Dominos](https://open.kattis.com/problems/dominos). In this question, one way to do it is by using Kosaraju's algorithm to enumerate the strongly-connected components (SCC), which mainly uses the depth-first search (DFS) function. In general, DFS is implemented as a recursive function, so initially I implemented DFS as such.

```python
def DFS(s):
    vis.add(s)      # vis is a set to store visited vertices
    for v in g[s]:  # g is a graph represented by adjacency list (list-of-list of vertices)
        if v not in vis: DFS(v)
```

Since the problem constraint specifies that there can be at most 100K vertices, I have no choice but to use something like `sys.setrecursionlimit(10**5+9)` (have a small extra buffer on the recursion limit). However, this gives me the TLE verdict, leaving me no choice but to redesign the DFS function to be iterative.

## 2. Constant factor disadvantage

Even when still having the same time complexity as the iterative counterpart, recursive functions have way more function calls. It is worth noting that function calls cause slight memory overhead/delays in the CPU, making array usage sometimes better in practice. You can check the memory allocation using `sys.getsizeof(x)` or `
x.__sizeof__()`, where `x` is the variable that you want to check on.

Some recursive functions can be made faster through memoization, and normally there are two ways I would do it, and usually I'd pick whichever came to my mind first.

- Using the builtin dictionary.

    Here's an example of how it's done.

```python
memo = {}
def fib(n):
    if n < 2: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1) + fib(n-2); return memo[n]
```


- Using `functools.cache`.

    Here's an example of how it's done. Alternatvely, you can use `@lru_cache` or `@lru_cache(maxsize=None)`, but it takes more characters (I also aimed at short code lengths) and might be slower as well.

```python
from functools import *
@cache
def fib(n):
    if n < 2: return n
    return fib(n-1) + fib(n-2)
```

While it speeds things up, both methods require storing the cache keys in a separate data structure such as dictionary (which is slower than lists) on top of the already many function calls.

## 3. Wishful thinking makes you take things for granted

Recursion allows one to do what's been taught as _wishful thinking_. In my own terms, you assume the smaller recursion states work correctly and you only need to piece these puzzles together via a recursive step to make up the bigger states. For example, in the above Fibonacci example, you assume that you know the exact results of `fib(n-1)` and `fib(n-2)`, you just need to know how to piece these two together to make up `fib(n)`.

But do you really know how it works when you have to trace the recursive calls in case something wrong happens?

In Python competitive programming, it is important to be able to convert a recursive function into iterative and vice versa, and this can only be done if you know the order of the recursive calls and what happens on each respective calls.

### DFS

Going back to the DFS example above, converting that same function to iterative is rather straightforward using a stack, as shown below.

```python
def DFS(u):
    stack = [u]
    while stack:
        s = stack.pop()
        vis.add(s)
        for v in g[s][::-1]:
            if v not in vis: stack.append(v)
```

The reversal of `g[s]` in the code above is to ensure the order of visitation remains the same as the recursive DFS function, though it may be unnecessary in the context of the Kattis question itself.

Suppose the value of `g[s]` is `[v_1, v_2, ..., v_k]`, where `v_i` represent the `i`-th neighbour of `s`, and the recursive DFS function will visit these vertices in that same order. If in the iterative DFS we keep the iteration order as such (i.e. not reversing `g[s]`), then `v_k` will be popped right after the iteration ends, then after some other vertices get popped, it will be `v_(k-1)`, and so on until `v_2`, then possibly some other vertices, and finally `v_1`. Therefore, if we want to maintain the order of visitation (possibly for easier tracing), you have to reverse `g[s]`.

Here comes the interesting part, what if in the recursive DFS function, there are some post-processing steps after the recursive calls? Notice the differences between the two codes.

```python
# before
def DFS(s):
    vis.add(s)
    for v in g[s]:
        if v not in vis: DFS(v)

# after
def DFS(s, t): # t is some boolean indicator
    vis.add(s)
    for v in g[s]:
        if v not in vis: DFS(v, t)
    if t: top.append(s) # to store the topological sort
```

How do we ensure that we can convert this to iterative, but still retaining the order of the values inside the `top` array? Instead of just storing `s` as the state, store a pair `(s, b)` where `s` is still the state but now we introduce `b`, a boolean indicating whether it's the pre-processing or the post-processing. I call this **the stack-state approach**. Personally, I like to store this state as a single integer `2*s+b` because it's more memory-efficient.

```python
def DFS(u, t):
    stack = [2*u] # (u, 0)
    while stack:
        sb = stack.pop()
        s, b = sb//2, sb%2 # decompose 2*s+b to s and b
        if b and t: top.append(u)
        elif s not in vis:
            vis.add(s)
            stack.append(2*s+1) # (s, 1)
            for v in g[s][::-1]:
                if v not in vis: stack.append(2*v) # (v, 0)
```

**What does this mean?** When you process a vertex `s`, you actually start with visiting `(s, 0)` first. In this state, you do some pre-processing such as marking `s` as visited in `vis`. Then, you'll add `(s, 1)`, then the neighbours `(v_k, 0), (v_(k-1), 0), ..., (v_2, 0), (v_1, 0)` in that order, so that `(v_1, 0)` will be processed right after `(s, 0)`. Only after you finish processing the `v_i`s as a whole, then you can finally deal with `(s, 1)` and do the post-processing there, which is adding `s` to `top`.

### Another example

DFS is actually one ~~simple~~ example, so let's turn things up a notch with another Kattis question: [Running Routes](https://open.kattis.com/problems/runningroutes).

It is a dynamic programming (DP) question, but the conversion from recursion to iteration that I could think of initially was different than using stack-state like `2*s+b`. Instead, when you use recursion for a top-down approach, you can use iteration by converting into a bottom-up approach.

Let's start with the recursive version, which passes the test cases in **9.7 seconds** given the 12-second time limit. Short code, but slow code.

```python
from functools import *
N = ... # suppose you have N and a function check(a, b) that returns either 0 or 1 depending on some black-boxed condition
@cache
def f(i, j):
    if j < 2: return 0
    if j < 3: return check(i, i+1)
    return max(max(f(i, k) + check(i+j-1, i+k) + f(i+k+1, j-k-2) for k in range(j-1)), f(i, j-1))
print(f(0, N))
```

The transition from `f(i, j)` to `f(i, k)` and `f(i+k+1, j-k-2)`, as well as to `f(i, j-1)` guarantees that there is no cyclic dependency: the value of `j` keeps getting strictly smaller, so this also motivates one to convert this short recursion to iterative.

Here's the iterative bottom-up approach, which also passes the test cases, but in **1.4 seconds**! The margin is huge!

```python
N = ...         # suppose you have N and a function check(a, b) that returns either 0 or 1 depending on some black-boxed condition
D = [0]*N*(N+1) # store the cached values f(i, j) in index j*N+i
for j in range(1, N+1):
    for i in range(N-j+1):
        if j < 2:   D[j*N+i] = 0
        elif j < 3: D[j*N+i] = check(i, i+1)
        else:       D[j*N+i] = max(max(D[k*N+i] + check(i+j-1, i+k) + D[(j-k-2)*N+(i+k+1)] for k in range(j-1)), D[(j-1)*N+i])
print(D[N*N]) # same as f(0, N)
```

The pressure point on implementing the iterative version is <u>the order of iteration</u> for `(i, j)`. Once that's settled, you can see the insides are very similar to the recursive steps defined previously.

In case you're still curious on how it's done using the stack-state approach, here's one that runs in **0.6 seconds**, much faster but is way more complex.

```python
N = ...         # suppose you have N and a function check(a, b) that returns either 0 or 1 depending on some black-boxed condition
D = [0]*N*(N+1) # store the cached values f(i, j) in index j*N+i
V = [0]*N*(N+1) # has index x ever been added into the stack?
S = [2*N*N]     # the stack itself, initially containing (N*N, 0)
while S:
    ub = S.pop() # (u, b) represented as 2*u+b
    u, b = divmod(ub, 2)
    j, i = divmod(u, N)
    if j < 2: continue # D[u] is already 0
    if j < 3: D[u] = check(i, i+1); continue
    if not b:
        if V[u]: continue
        V[u] = 1
        S.append(2*u+1)
        for k in range(j-1): S.append(2*(k*N+i)); S.append(2*((j-k-2)*N+(i+k+1)))
        S.append(2*(u-N)) # (j-1)*N+i = j*N+i-N = u-N
    else:
        D[u] = max(max(D[k*N+i] + check(i+j-1, i+k) + D[(j-k-2)*N+(i+k+1)] for k in range(j-1)), D[u-N])
print(D[N*N]) # same as f(0, N)
```

It's getting more confusing now, right? Let's break it down one-by-one.

- The array `V` is to keep track of the states that have been added into the stack to be processed. Due to the nature of the DP state transition, the same state `(u, 0)` can be added into the stack more than once, but we only need to process `(u, 1)` once, hence the need of `V` to check when `b` is still at 0.
- In pre-processing (when `b` equals 0), you add `(u, 1)` first as usual, and then add all the smaller states `(v, 0)` that you want to compute into the stack. Any order is fine because you will just take the maximum out of these. To identify which states `(v, 0)` to add to `S`, notice all the recursive calls required when iterating from `k = 0` to `k = j-2`.
- In post-processing (when `b` equals 1), it is guaranteed that the smaller states have been computed correctly, so we can update `D[u]` similar to the other iterative code.

The reasons why the second iterative code is faster is because it only explores states that are involved with `(N*N, 0)`, while the first iterative code tries to populate all entries of the cache array `D`. The first iterative code is faster than the recursive code because of the reasons previously stated, so we've come into a full circle.

## Final Note
It is indeed rather niche to program competitively in Python instead of C++, and spending lots of time on Python makes you realize it behaves differently than C++ more often than you think. This is one great example of it that I think is worth writing.