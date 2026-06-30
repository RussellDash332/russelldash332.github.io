# Lobotomizing my dynamic segment tree
1 July 2026

[tag]: python, data-structures, algorithms, competitive-programming

Following my "hiccup" in CAT2026's preliminary round batch 2 while solving problem D, I've come to realize that my Python dynamic segment tree was still very suboptimal. Understandably, the original intention of coding that was to come up with a simple extension of the normal segment tree where you still have to use an pre-configured array of size some multiple of $N$, that's lame.

```python
class Node:
    def __init__(s, l, r):
        s.l = l; s.r = r; s.lc = s.rc = None; s.s = s.z = 0
    def push(s):
        if s.l == s.r: return
        mi = (s.l+s.r)//2
        if not s.lc: s.lc = Node(s.l, mi); s.rc = Node(mi+1, s.r)
        s.lc.s += s.z*(mi-s.l+1); s.lc.z += s.z; s.rc.s += s.z*(s.r-mi); s.rc.z += s.z; s.z = 0
    def add(s, lq, rq, v):
        if s.l > rq or s.r < lq: return
        if s.l >= lq and s.r <= rq: s.s += v*(s.r-s.l+1); s.z += v; return
        s.push(); s.lc.add(lq, rq, v); s.rc.add(lq, rq, v); s.s = s.lc.s+s.rc.s
    def get(s, lq, rq):
        if s.l > rq or s.r < lq: return 0
        if s.l >= lq and s.r <= rq: return s.s
        s.push(); return s.lc.get(lq, rq)+s.rc.get(lq, rq)
```

Moreover, as shown above, this dynamic segment tree only works for range add and range sum operations, which is why this implementation is still very limited. There were some Kattis problems where my solution makes use of this dynamic segment tree, but the binary function being completely replaced manually.

[Fibonacci Gjöf](https://open.kattis.com/problems/fibonaccigjof), where you treat each segment as a $2 \times 2$ matrix. Update by range-multiply every value in range by a matrix, and query the matrix sum on an interval.

```python
def madd(x, y):
    return (x[0]+y[0])%M, (x[1]+y[1])%M, (x[2]+y[2])%M, (x[3]+y[3])%M

def mmul(x, y):
    return (x[0]*y[0]+x[1]*y[2])%M, (x[0]*y[1]+x[1]*y[3])%M, (x[2]*y[0]+x[3]*y[2])%M, (x[2]*y[1]+x[3]*y[3])%M

class Node:
    def __init__(s, l, r):
        s.l = l; s.r = r; s.lc = s.rc = None; s.s = s.z = 1, 0, 0, 1
    def push(s):
        if s.l == s.r: return
        mi = (s.l+s.r)//2
        if not s.lc: s.lc = Node(s.l, mi); s.rc = Node(mi+1, s.r)
        s.lc.s = mmul(s.lc.s, s.z); s.lc.z = mmul(s.lc.z, s.z); s.rc.s = mmul(s.rc.s, s.z); s.rc.z = mmul(s.rc.z, s.z); s.z = 1, 0, 0, 1
    def add(s, lq, rq, v):
        if s.l > rq or s.r < lq: return
        if s.l >= lq and s.r <= rq: s.s = mmul(s.s, v); s.z = mmul(s.z, v); return
        s.push(); s.lc.add(lq, rq, v); s.rc.add(lq, rq, v); s.s = madd(s.lc.s, s.rc.s)
    def get(s, lq, rq):
        if s.l > rq or s.r < lq: return 0, 0, 0, 0
        if s.l >= lq and s.r <= rq: return s.s
        s.push(); return madd(s.lc.get(lq, rq), s.rc.get(lq, rq))
```

[Another Query on Array Problem](https://open.kattis.com/problems/queryonarray), which stores each segment as a vector of 4 integers to keep track of some power sum. Some variables are not defined here because that's not related to the current topic.

```python
def make(lm1, r, v):
    return (v[0]*(r-lm1)%M, v[1]*(A[r]-A[lm1])%M, v[2]*(B[r]-B[lm1])%M, v[3]*(C[r]-C[lm1])%M)

def vadd(v1, v2):
    v1[0] = (v1[0]+v2[0])%M; v1[1] = (v1[1]+v2[1])%M; v1[2] = (v1[2]+v2[2])%M; v1[3] = (v1[3]+v2[3])%M

class Node:
    def __init__(s, l, r):
        s.l = l; s.r = r; s.lc = s.rc = None; s.s = [0]*4; s.z = [0]*4
    def push(s):
        if s.l == s.r: return
        mi = (s.l+s.r)//2
        if not s.lc: s.lc = Node(s.l, mi); s.rc = Node(mi+1, s.r)
        vadd(s.lc.s, make(s.l-1, mi, s.z)); vadd(s.lc.z, s.z)
        vadd(s.rc.s, make(mi, s.r, s.z)); vadd(s.rc.z, s.z)
        s.z[0] = s.z[1] = s.z[2] = s.z[3] = 0
    def add(s, lq, rq, v):
        if s.l > rq or s.r < lq: return
        if s.l >= lq and s.r <= rq: vadd(s.s, make(s.l-1, s.r, v)); vadd(s.z, v); return
        s.push(); s.lc.add(lq, rq, v); s.rc.add(lq, rq, v)
        s.s[0] = s.s[1] = s.s[2] = s.s[3] = 0
        vadd(s.s, s.lc.s); vadd(s.s, s.rc.s)
    def get(s, lq, rq, t):
        if s.l > rq or s.r < lq: return
        if s.l >= lq and s.r <= rq: return vadd(t, s.s)
        s.push(); s.lc.get(lq, rq, t); s.rc.get(lq, rq, t)
```

[Japanese Lottery](https://open.kattis.com/problems/japaneselottery), where you treat each segment as a permutation of the first $N$ positive integers. Both update and query use permutation functions. Weirdest one so far.

```python
class Node:
    def __init__(s, l, r, w):
        s.l = l; s.r = r; s.lc = s.rc = None; s.s = [*range(w)]
    def push(s):
        if s.l == s.r: return
        if not s.lc: s.lc = Node(s.l, mi:=(s.l+s.r)//2, w); s.rc = Node(mi+1, s.r, w)
    def add(s, p, v):
        if s.l == s.r == p: s.s[v[0]], s.s[v[1]] = s.s[v[1]], s.s[v[0]]; return
        s.push(); s.lc.add(p, v) if p <= (s.l+s.r)//2 else s.rc.add(p, v); s.s = [s.rc.s[i] for i in s.lc.s]
    def get(s, lq, rq):
        if s.l > rq or s.r < lq: return 0
        if s.l >= lq and s.r <= rq: return s.s
        s.push(); rr = s.rc.get(lq, rq); return [rr[i] for i in s.lc.get(lq, rq)]
```

After seeing the three examples above, one can see that there isn't any general pattern to specify the binary function and/or the lazy propagation handling.

In this article, I will try to optimize the original dynamic segment tree code that I've had for years, and refactor until I feel like it. You can also find out the finalized result [here](https://github.com/RussellDash332/pytils/blob/main/segment_tree_dynamic.py) if you're too lazy to read.

## Removing OOP

To do so, we can store the left values, right values, the pointer to left/right child, sum value, and lazy value; all on separate arrays. Instead of passing the object, we pass the index referring to the segment in the array. My current code assumes the use of just a single segment tree, so if you happens to have more segment trees, you have to reset the arrays or share the contents cleverly.

```python
L = []; R = []; LC = []; RC = []; S = []; Z = []

def create(l, r):
    L.append(l); R.append(r); LC.append(-1); RC.append(-1); S.append(0); Z.append(0)
    return len(L)-1

def push(i):
    l = L[i]; r = R[i]
    if l == r: return
    mi = (l+r)>>1
    if LC[i] < 0: LC[i] = create(l, mi); RC[i] = create(mi+1, r)
    lc = LC[i]; rc = RC[i]; z = Z[i]
    S[lc] += z*(mi-l+1); S[rc] += z*(r-mi)  # propagate sums
    Z[lc] += z; Z[rc] += z; Z[i] = 0        # propagate lazy values

def add(lq, rq, v, i=0):
    l = L[i]; r = R[i]
    if l > rq or r < lq: return
    if l >= lq and r <= rq: S[i] += v*(r-l+1); Z[i] += v; return
    push(i)
    add(lq, rq, v, lc:=LC[i]); add(lq, rq, v, rc:=RC[i])
    S[i] = S[lc]+S[rc]

def get(lq, rq, i=0):
    l = L[i]; r = R[i]
    if l > rq or r < lq: return 0
    if l >= lq and r <= rq: return S[i]
    push(i)
    return get(lq, rq, LC[i])+get(lq, rq, RC[i])

# example
T = create(0, 10**9) # should return 0
add(10, 200, -60)
add(100, 300, 67)
print(get(9, 12))    # -180
print(get(190, 201)) # 144
print(get(140, 140)) # 7
print(get(0, 10**9)) # 2007
```

## Removing recursion

This is very doable, based on what I mentioned in my [previous article](https://russelldash332.github.io/posts/why-python-recursion-sucks.html) long time ago. The challenge is on how to separate the preprocessing and the postprocessing part (if any).

```python
def add(lq, rq, v, i=0):
    stk = [(i, 0)]
    while stk:
        i, b = stk.pop()
        if b>0:
            S[i] = S[LC[i]]+S[RC[i]] # combine
        else:
            l = L[i]; r = R[i]
            if l > rq or r < lq: continue
            if l >= lq and r <= rq:
                S[i] += v*(r-l+1)
                Z[i] += v
                continue
            push(i)
            stk.append((i, 1)); stk.append((LC[i], 0)); stk.append((RC[i], 0)) # recursion branch

def get(lq, rq, i=0):
    stk = [(i, 0)]; tmp = []
    while stk:
        i, b = stk.pop()
        if b>0:
            tmp.append(tmp.pop()+tmp.pop())
        else:
            l = L[i]; r = R[i]
            if l > rq or r < lq: tmp.append(0); continue
            if l >= lq and r <= rq: tmp.append(S[i]); continue
            push(i)
            stk.append((i, 1)); stk.append((LC[i], 0)); stk.append((RC[i], 0)) # recursion branch
    return tmp[0]
```

Since we're adding `(LC[i], 0)` first then `(RC[i], 0)` into the stack `stk`, the value `(RC[i], 0)` will be handled earlier and its corresponding result is therefore added into `tmp` earlier. Thus, when doing `tmp.pop()+tmp.pop()`, the first term is actually the one from `(LC[i], 0)`.

## Handling binary functions

Probably the most challenging part. Given the aforementioned Kattis problems above, how can I incorporate the two recent changes to tackle this constraint?

Maybe, we'll start with a combiner function, that takes in two values (ideally from a segment's two children), and returns the value of combining both values.

```python
def combine(a, b):
    return a+b # for range sum
```

Next, an accumulator. You need an initial value, and once you have obtained the combined value, you have to accumulate this to that initial value until it becomes the final result. Alternatively, you can have three separate accumulators to handle the propagations of $S_{lc}$, $S_{rc}$, and $Z$, but I personally think this is not an urgent requirement.

```python
INITIAL_VALUE = 0
def accumulate(a, b):
    return a+b # for range sum
```

I will now rename `add` to `update`, so bringing back the `create` and `push` functions, we'll have something like this.

```python
L = []; R = []; LC = []; RC = []; S = []; Z = []

# to be modified
def combine(a, b):
    return a+b

# to be modified
INITIAL_VALUE = 0
def accumulate(a, b):
    return a+b

def create(l, r):
    L.append(l); R.append(r); LC.append(-1); RC.append(-1); S.append(INITIAL_VALUE); Z.append(INITIAL_VALUE)
    return len(L)-1

def push(i):
    l = L[i]; r = R[i]
    if l == r: return
    mi = (l+r)>>1
    if LC[i] < 0: LC[i] = create(l, mi); RC[i] = create(mi+1, r)
    lc = LC[i]; rc = RC[i]; z = Z[i]
    # to be modified
    S[lc] = accumulate(S[lc], z*(mi-l+1)); S[rc] = accumulate(S[rc], z*(r-mi))
    Z[lc] = accumulate(Z[lc], z); Z[rc] = accumulate(Z[rc], z)
    Z[i] = INITIAL_VALUE

def update(lq, rq, v, i=0):
    stk = [(i, 0)]
    while stk:
        i, b = stk.pop()
        if b>0: S[i] = combine(S[LC[i]], S[RC[i]])
        else:
            l = L[i]; r = R[i]
            if l > rq or r < lq: continue
            if l >= lq and r <= rq:
                # to be modified
                S[i] = accumulate(S[i], v*(r-l+1)); Z[i] = accumulate(Z[i], v)
                continue
            push(i); stk.append((i, 1)); stk.append((LC[i], 0)); stk.append((RC[i], 0))

def get(lq, rq, i=0):
    stk = [(i, 0)]; tmp = []
    while stk:
        i, b = stk.pop()
        if b>0: tmp.append(combine(tmp.pop(), tmp.pop()))
        else:
            l = L[i]; r = R[i]
            if l > rq or r < lq: tmp.append(INITIAL_VALUE); continue
            if l >= lq and r <= rq: tmp.append(S[i]); continue
            push(i); stk.append((i, 1)); stk.append((LC[i], 0)); stk.append((RC[i], 0))
    return tmp[0]

# example
T = create(0, 10**9) # should return 0
update(10, 200, -60)
update(100, 300, 67)
print(get(9, 12))    # -180
print(get(190, 201)) # 144
print(get(140, 140)) # 7
print(get(0, 10**9)) # 2007
```

I think this should be enough, let's see how can we modify this template for the three aforementioned Kattis problems.

- [Fibonacci Gjöf](https://open.kattis.com/problems/fibonaccigjof)

    Keep the original definition of `madd` and `mmul`. The combiner is `madd`, the accumulator is `mmul` with the same value passed for both `S` and `Z` arrays (as opposed to range sum which needs to be differentiated). The initial value is simply the tuple `(0, 0, 0, 0)`.

- [Another Query on Array Problem](https://open.kattis.com/problems/queryonarray)

    The `vadd` function in my example is a void function, but I can make it return a tuple/list to represent the vector, and then use this as the combiner. The accumulator is also `vadd`. The initial value can be kept at `[0]*4`. Similar to the original range sum, you might need to modify what to pass on `vadd` at the `push` function.

- [Japanese Lottery](https://open.kattis.com/problems/japaneselottery)

    Initial value will be `[*range(w)]`, where `w` is already given in the input. The accumulator will be something like `accumulate(s, v) -> swap s[v[0]] and s[v[1]]`, and the combiner will be the permutation function `combine(p, q) -> [q[i] for i in p]`. The handling of `lq` and `rq` in the `update` function is slightly different, but that shouldn't be a big deal.

- **BONUS:** [CAT2026's Isomorphic Operations](https://codeforces.com/gym/106515/problem/D), also available at [my article last month](https://russelldash332.github.io/posts/cat-2026-favorite-problems.html#preliminary-batch-2-problem-d)

    Initial value for an interval $[L, R]$ is `(0, 0, 0, 0, R-L+1)` to store $h_A, h_B, h_C, h_D$, and the length of this segment. The lazy array $Z$ is mainly used to lazily store the value of $n_\text{shift}$. The accumulator will rotate the four hash values based on the value of $n_\text{shift}$, while the combiner function will combine the hash of the two smaller strings, making use of the string lengths in order to offset the prime power of the first string.

Yep, I'm committing this change to [pytils](https://github.com/RussellDash332/pytils/blob/main/segment_tree_dynamic.py)...