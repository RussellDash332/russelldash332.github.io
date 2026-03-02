# Integer Factorization Made Easy!
2 March 2026

[tag]: algorithms, math, python, competitive-programming

Integer factorization is one of the most useful techniques in competitive programming when it comes to handling large numbers. Once we know the list of the prime numbers $p_1, p_2, \ldots, p_k$ dividing a given integer $n$ (and the highest power $e_i$ that divides it), the problems becomes easier to handle.

Formally, given an integer $n$, we want to express $n$ as $$n = \prod_{i=1}^k p_i^{e_i}$$ where $p_i \forall i = 1, 2, \ldots, k$ are distinct prime numbers and $e_i \forall i = 1, 2, \ldots, k$ are the highest integer power of $p_i$ that divides $n$. For example, $324324 = 2^2 \cdot 3^4 \cdot 7^1 \cdot 11^1 \cdot 13^1$. Furthermore, $e_i > 0 \forall i = 1, 2, \ldots, k$.

In this article, we will uncover the algorithms to optimize such factorization step-by-step.

**SHORTCUT:** If you are here to just copy-paste the Python code: go [here](#wrapping-up).

## Prime Checking

To begin, we need to find out how to find the prime numbers and then later use them to divide $n$ until it's reduced to $1$.

### $O(n)$ check

In university, you will be taught the simplest way to check if an integer $n$ is a prime number: check from $2$ to $n-1$ and ensure that nothing divides $n$. This way, the only divisors of $n$ will be $1$ and itself and therefore $n$ is a prime number.

```python
def is_prime(n):
    if n == 2: return True # edge case
    for i in range(2, n):
        if n % i == 0: return False
    return True
```

### $O(\sqrt{n})$ check

Clearly, this is not our best shot. Notice that $n$ is not prime if and only if there exists a divisor $x$ of $n$ such that $1 < x \le \sqrt{n}$.

<details>
<summary>Click to show proof</summary>
<div class="boxed">

We need to prove this in two directions. It's easier to prove $LHS \Leftarrow RHS$ because the said $x$ will never be equal to $1$ and $n$, therefore $n$ has more than two factors and by definition not a prime number.

As for proving $LHS \Rightarrow RHS$, suppose there isn't such $x$. Since $n$ is not prime, there is a factor $y$ that is neither $1$ nor $n$. Since $y \vert n$, $\frac{n}{y}$ is an integer.

However, since we assumed $RHS$ to be false, then $\sqrt{n} < y < n$. But this means $$\sqrt{n} = \frac{n}{\sqrt{n}} > \frac{n}{y} > \frac{n}{n} = 1$$

a contradiction to our earlier assumption that there isn't a factor $x$ such that $1 < x \le \sqrt{n}$.

</div>
</details>

Therefore, we can simply cut down our search to be just up to $\sqrt{n}$. Again, check for possible edge cases.

```python
def is_prime(n):
    if n == 2 or n == 3: return True # edge cases
    for i in range(2, int(n**.5)+1):
        if n % i == 0: return False
    return True
```

### The Sieve of Eratosthenes

Think about it this way: if we want to factorize $n$, then intuitively from what we've known so far, we can just iterate for all prime numbers up to the "current value" $n$, and then keep dividing until $n$ is equal to $1$. But, does checking for primality in every number we iterate an effective way?

Using the $O(\sqrt{n})$ checker we had previously, and then iterating for each number up to $n$ will take $O(n^\frac{3}{2})$ time, which is extremely expensive.

If we can somehow precompute the list of all primes effectively, checking `is_prime` can be done in $O(1)$ by member checking, and therefore future `factorize` queries can be done in just $O(n)$ time. This is where the sieve of Eratosthenes comes in.

Here's the ELI5 of how the sieve works: arrange the first $n$ numbers on a table initially all marked as prime, and iterate from $i = 2, 3, \ldots n$: if $i$ is marked, keep $i$ marked as prime and unmark all the following multiples of $i$ as they are not prime. In the end, you will have all the prime numbers up to $n$.

Let's see how the sieve works for $n = 67$.

- $i = 2$

    2 is marked and therefore is prime, and then we'll unmark $4, 6, 8, \ldots, 66$ as they are not prime.

- $i = 3$

    3 is marked and therefore is prime, and then we'll unmark $6, 9, \ldots, 66$. Note that the re-unmarking of $6$ is redundant here as it has been unmarked previously.

- $i = 4$

    4 is already unmarked, so we skip this.

- $i = 5$

    5 is marked and therefore is prime, and then we'll unmark $10, 15, \ldots, 65$.

The process continues until $i = 67$, which is still marked, so $67$ is prime and there are no more following multiples of $i$ not more than $67$. In the end, we'll have $2, 3, 5, 7, 11, 13, 17, \ldots, 61, 67$ marked as prime numbers!

```python
LIMIT = 10**6

primes = []
sieve = [1]*LIMIT
sieve[0] = sieve[1] = 0 # edge case
p = 2
while p < LIMIT:
    if sieve[p]:
        primes.append(p)
        for q in range(2*p, LIMIT, p):
            sieve[q] = 0
    if p == 2: p -= 1
    p += 2 # once p is odd, we don't need to check the even terms

def is_prime(n):
    return sieve[n]
```

While it's faster for `is_prime` to just use `sieve` directly compared to checking `n in primes`, we need the `primes` list for our factorization because it's faster to iterate through just the prime numbers instead of having to go from $i = 2, 3, \ldots n$ one at a time, checking if $i$ is a prime factor of $n$.

As for the time complexity of this algorithm, I found great explanations using different techniques such as using $\pi(x) \approx \frac{x}{\ln{x}}$ where $\pi(x)$ is the number of primes up to $x$, or even the [Euler's product formula](https://en.wikipedia.org/wiki/Riemann_zeta_function#Euler's_product_formula) combined with Taylor's expansion. But, [this one by cp-algorithms](https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html#asymptotic-analysis) takes the cake for me, so do give that a read instead of you're interested.

Another variant of the sieve that I personally prefer doesn't just store the $0/1$ booleans in the sieve. Instead, for a particular $n$ we store the smallest prime factor dividing $n$, initially set to $n$ and then shrinks over time until it reaches the actual smallest prime factor. While this will take more memory (needs to store array of integers instead of array of bits), it is extremely useful for factorization. In fact we can linearize this, making it run in $O(n)$ time.

An integer $n > 1$ is a prime number iff the smallest prime factor is itself. This code is also available at [pytils](https://github.com/RussellDash332/pytils/blob/main/number_theory_prime_sieve.py).

```python
LIMIT = 10**6
spf = [0]*LIMIT
primes = []

for i in range(2, LIMIT):
    if spf[i] < 1: spf[i] = i; primes.append(i)
    for p in primes:
        if (j:=i*p) >= LIMIT: break
        spf[j] = p
        if p == spf[i]: break

def is_prime(n):
    return spf[n] == n
```

The proof of its time complexity being linear can be found [here](https://cp-algorithms.com/algebra/prime-sieve-linear.html).

While this `is_prime` takes $O(1)$ time per query, precomputing the sieve takes a lot of time and memory as it is at least linearly proportional to the query $n$. What if I want to check if $n=10^{18}-11$ is a prime number or not? Obviously I can't create an array of length $n$, or even of length $\sqrt{n}$. There has to be another way!

### Miller-Rabin Primality Test

We start with the Fermat's Little Theorem that states that given a prime number $p$, it implies that for every **coprime** integer $a$, we have $$a^{p-1} \equiv 1 \pmod p$$

This means that if there exists an integer $x \in [2, p-2]$ such that $x^{p-1} \not\equiv 1 \pmod p$, then $p$ is not prime. We extend this idea to have a randomized algorithm that samples sufficiently many $x$ values until we find a hit of $x^{p-1} \not\equiv 1 \pmod p$ and then report not prime.

However, the inverse isn't always true: if $p$ is composite, it can still be the case that for every coprime integer $a$, the equation applies. E.g. when $p$ is a [Carmichael number](https://en.wikipedia.org/wiki/Carmichael_number), lke $561$. Since there's only [a few such numbers](https://oeis.org/A055553), this is rather a randomized check that a number is prime **with high probability**.

This is where the actual Miller-Rabin test comes. Suppose we represent $p-1$ in the form of $2^s \cdot d$ where $d$ is odd, we can transform our original equation as follows.

$$
\begin{align*}
a^{p-1}-1 &\equiv 0 \pmod p \\
a^{2^s d}-1 &= (a^{2^{s-1}d}+1)(a^{2^{s-1}d}-1) \\
&= (a^{2^{s-1}d}+1)(a^{2^{s-2}d}+1)(a^{2^{s-2}d}-1) \\
&= (a^{2^{s-1}d}+1)(a^{2^{s-2}d}+1)\cdots(a^{2d}-1) \\
&= (a^{2^{s-1}d}+1)(a^{2^{s-2}d}+1)\cdots(a^d+1)(a^d-1) &\equiv 0 \pmod p
\end{align*}
$$

It suffices to show that either $a^d \equiv 1 \pmod p$ or for $a^{2^r d} \equiv -1 \pmod p$ for some $0 \le r \le s-1$. This method will decrease the probability that we will fail due to the presence of the numbers like the Carmichael numbers mentioned above.

Below is the Python code that I have at [pytils](https://github.com/RussellDash332/pytils/blob/main/number_theory_miller_rabin.py) for Miller-Rabin primality test. (I removed the `p == 2` check to save some time)

```python
from random import randint
def miller_rabin(p):
    # obvious edge cases
    if p == 2: return 1
    if p % 2 == 0: return 0
    if p == 3: return 1

    # transform p-1 = 2^s * d where d is odd
    d, s = p-1, 0
    while d % 2 == 0: d //= 2; s += 1

    # k = 3 tries, can go higher
    for _ in range(3):
        # select random base a, compute x = a^d mod p
        x = pow(randint(2, p-2), d, p)

        # need to check for failure instead
        if x == 1 or x == p-1: continue

        # try all a^(2^r d) mod p
        ok = 0
        for _ in range(s):
            x = x*x%p
            if x == 1: return 0         # (early termination!)
            if x == p-1: ok = 1; break  # found -1 mod p
        if not ok: return 0
    return 1

print(miller_rabin(10**9+7)) # prime
print(miller_rabin(10**9+3)) # not a prime
```

Assuming the computation of `x = x*x%p` takes $O(1)$ time, the whole algorithm takes $O(k \log n)$ time, where $n$ is the number of interest and $k$ is the number of random tries to execute. If you happen to find $O(k \log^3 n)$ or some sort, this is influenced by the time taken to multiply the two big numbers as mentioned. The $\log n$ factor is due to the highest exponent of $2$ that divides $n$ and/or the computation of $x = a^d \pmod p$ on every iteration.

On the `(early termination!)` part, notice that if we ever encounter some $$a^{2^r d}-1 \equiv 0 \pmod p$$ where $r > 0$, it means that either $$\exists 0 \le k < r \rightarrow a^{2^k d}+1 \equiv 0 \pmod p$$ or $a^d \equiv 1 \pmod p$. The former case cannot happen because we would've reached `ok = 1; break` sometime before, and for the latter case we also have skipped this before the `for _ in range(s)` loop. Therefore, this is a nontrivial square-root of $1 \pmod p$ and concludes that $p$ is in fact composite.

## The Factorization

Now that we've gathered every piece of the puzzle, let's finish this with the factorization algorithm.

### Using the sieve

With the Eratosthenes sieve, we obtained the list of prime numbers `primes`. We only need to check for primes up to $\sqrt{n}$, because after dividing $n$ with all the prime numbers not more than $\sqrt{n}$, the remaining value of $n$ is either $1$, which means we have finished factorizing $n$, or $n$ is a prime number, which means this is the only prime factor left.

```python
# insert sieve code (up to sqrt(n)) here

def factorize(n):
    pf = {}
    for p in primes:
        if n%p: continue
        k = 0
        while n%p == 0: n //= p; k += 1
        pf[p] = k

    if n != 1: pf[n] = 1

    return pf
```

In the other variant, we obtained the `spf` array. We can factorize $n$ by repeatedly dividing $n$ with $\text{spf}[n]$ until $n$ is equal to $1$. This approach however requires you to sieve all the way up to $n$ instead of $\sqrt{n}$.

```python
# insert sieve code (up to n) here

def factorize(n):
    pf = {}
    while n > 1:
        p = spf[n]; k = 0
        while n%p == 0: n //= p; k += 1
        pf[p] = k
    return pf
```

Both variants are still a rather naïve approach because they will be very slow for huge values of $n$.

### Pollard-Rho's algorithm

The reason on why I insisted on understanding primality tests first is because large prime numbers will cause factorization algorithms to be very slow, so if we skip prime numbers beforehand, and only work on composite number, one of the factors would have been much smaller and therefore easier to find: at most $\sqrt{n}$. Without loss of generality, **assume that the Miller-Rabin primality test has been done and $n$ is composite.**

The algorithm makes use of the sequence $$[x_i] = [x_0, x_1=f(x_0), x_2=f(f(x_0)), \ldots]$$ for some polynomial $f$, like $f(x) = x^2 + c$ for some fixed constant $c$, and **outputs a non-trivial factor of $n$ (not $1$, not $n$ itself)**.

Suppose there is a prime factor $p$ of $n$. The expectation is that this sequence eventually becomes periodic under modulo $p$, i.e. we can find two indices $i, j$ such that $x_i = x_j \pmod p$. This is guaranteed to be happen as there are only $p$ possible modulos and the sequence is infinite.

When it does, it also means that $p$ divides $|x_i-x_j|$, or even better: $p$ divides $\gcd(|x_i-x_j|, n)$. This is true because $n$ is a multiple of $p$. The issue is that we don't know what the value of $p$ is, so if we just use $d = \gcd(|x_i-x_j|, n)$, we can simply output $d$ as a non-trivial factor of $n$.

Since we can't store huge values of $x_i$, we can store them under modulo $n$. The new issue is that it is possible that $x_i \equiv x_j \pmod n$ and therefore $d = \gcd(0, n) = n$, which is a trivial factor. In this case, we can simply use a different sequence and start over. For example, changing the value of $c$ in $f(x) = x^2+c$ as the easiest alternative.

So how do we find such cycle? We can make use of [**Floyd's tortoise and hare cycle-finding algorithm!**](https://cp-algorithms.com/others/tortoise_and_hare.html)

The gist of this cycle-finding algorithm is having **two pointers that move at a different speed**: $1$ and $2$ for instance. Eventually, these pointers will meet at the same location if there is a cycle. In the context of our topic right now, we want to check for $x_i \pmod n$ versus $x_{j=2i} \pmod n$ and hopefully they can output a non-trivial factor.

> Fun fact: I learned this algorithm from JomaTech's [If Programming Was An Anime](https://www.youtube.com/watch?v=pKO9UjSeLew).

Combining both cycle-finding and the logic to terminate our search, we have the following Python code below. This is also available at [pytils](https://github.com/RussellDash332/pytils/blob/main/number_theory_pollard_rho.py).

```python
from math import gcd

def pollard_rho(n):
    c = 1
    while True:
        # base is x_0 = 2
        x, y, d = 2, 2, 1

        # if a cycle is found, the value of d should not be 1 anymore
        while d == 1:
            x = (x*x+c)%n                   # tortoise
            y = (y*y+c)%n; y = (y*y+c)%n    # hare
            d = gcd(abs(x-y), n)

        # found a non-trivial factor
        if d != n:
            return d

        # next value of c to try
        c += 1

print(pollard_rho(105))
print(pollard_rho(10**9+3)) # not a prime
# print(pollard_rho(10**9+7)) will take a very long time since the number is prime
```

The time complexity simply depends on how quickly a cycle is detected. Under modulo $p$, there are $p$ possible modulos, and the expected number of terms before a collision occurs is $O(\sqrt{p})$.

<details>
<summary>Why $O(\sqrt{p})$?</summary>
<div class="boxed">

Suppose $x$ is the number of terms before the collision happened. The probability of no-collision on the first $k$ terms is

$$P(x>k) = \frac{p}{p} \cdot \frac{p-1}{p} \cdot \ldots \cdot \frac{p-k+1}{p} = \prod_{i=0}^{k-1} \left(1-\frac{i}{p}\right)$$

The expected number of terms before a collision is therefore equal to

$$
\begin{align*}
\mathbb{E}(x) &= \sum_{k=0}^p k \cdot P(x=k) \\
&= \sum_{k=0}^p P(x>k) \\
&= \sum_{k=0}^p \prod_{i=0}^{k-1} \left(1-\frac{i}{p}\right)
\end{align*}
$$

For large values of $p$, we can approximate each product term using the leading term of Taylor's expansion as follows.

$$
\begin{align*}
\ln \prod_{i=0}^{k-1} \left(1-\frac{i}{p}\right) &= \sum_{i=0}^{k-1} \ln \left(1-\frac{i}{p}\right) \\
&\approx \sum_{i=0}^{k-1} -\frac{i}{p} \\
&= -\frac{(k-1)k}{2p} \\
\prod_{i=0}^{k-1} \left(1-\frac{i}{p}\right) &= \exp \left(-\frac{(k-1)k}{2p} \right) \\
&\approx \exp \left(-\frac{k^2}{2p} \right)
\end{align*}
$$

Going back to $\mathbb{E}(x)$, since $p$ is large, we can approximate this sum as a Riemann sum with blocks of size $\sqrt{p}$ that forms an integral.

$$
\begin{align*}
\mathbb{E}(x) &= \sum_{k=0}^p \prod_{i=0}^{k-1} \left(1-\frac{i}{p}\right) \\
&\approx \sum_{k=0}^p \exp \left(-\frac{k^2}{2p} \right) \\
&\approx \sum_{k=0}^\infty \exp \left(-\frac{k^2}{2p} \right) \\
&= \sqrt{p}\sum_{k=0}^\infty \frac{1}{\sqrt{p}} \exp \left(-\frac{k^2}{2p} \right) \\
&= \sqrt{p}\sum_{k=0}^\infty \frac{1}{\sqrt{p}} \exp \left(-\frac{(\frac{k}{\sqrt{p}})^2}{2} \right) \\
&\approx \sqrt{p} \int_{0}^{\infty} e^{-\frac{t^2}{2}} dt \\
&= \sqrt{p} \cdot \sqrt{\frac{\pi}{2}} = O(\sqrt{p})
\end{align*}
$$

The integral calculation is derived from <a href="https://en.wikipedia.org/wiki/Gaussian_integral">Gaussian integrals</a>.

</div>
</details>

Since $n$ is composite, we expect $p \le \sqrt{n}$ and therefore the estimated number of iterations is $O(\sqrt[4]{n})$. Since we compute $\gcd$ in every iteration, each taking $O(\log n)$, the overall time complexity is $O(\sqrt[4]{n}\log n)$.

### Brent modification

This modification only changes how the two pointers in Floyd's algorithm advances. Instead of the tortoise moving $1$ step at a time and the hare moving $2$ at a time, the tortoise and hare move in increasing powers of $2$.

In the original version, we check for $x_i$ versus $x_{2i}$ for $i = 1, 2, 3, \ldots$ and so on. With Brent's modification, we need only check $x_t$ versus $x_{t+k}$ for some starting values $t$ and $k = 1, 2, 3, \ldots, 2^r$ for some integer $r$.

We extend this idea by only **checking the GCD after every batch of few steps** instead of every single step. Suppose we denote the batch size as $m$. Instead of checking $\gcd(|x_t-x_{t+k}|, n)$ for every $k$ one-by-one, we check for $$\gcd\left(\prod_{k=1}^{m} |x_t-x_{t+k}|, n\right), \gcd\left(\prod_{k=m+1}^{2m} |x_t-x_{t+k}|, n\right), \ldots$$ and so on until we hit $k = 2^i$. This will significantly reduce the number of GCD computations will therefore optimize the algorithm.

It is still possible that we encounter a GCD of $n$, meaning the product of the absolute differences modulo $n$ is $0$. In this case, we can rollback to our last starting value of $x_{t+k}$ before obtaining this batch with zero product. For example, if $$\prod_{k=m+1}^{2m} |x_t-x_{t+k}| \equiv 0 \pmod n$$ then we reset our variable back to $k' = m+1$, and only from this point we start going one step at a time for a more careful check until we find a non-trivial value of $\gcd(|x_t-x_{t+k'}|, n)$.

Otherwise, in the case of a batch's GCD not equal to $n$, we have already found a non-trivial factor!

The Python code below is also available at [pytils](https://github.com/RussellDash332/pytils/blob/main/number_theory_pollard_rho.py).

```python
from math import gcd
from random import *

def pollard_rho_brent(n):
    while True:
        y = randint(1, n-1) # random base x_1
        c = randint(1, n-1) # random constant for f(x) = x^2 + c
        m = randint(1, n-1) # random batch size

        g = r = q = 1
        while g == 1:
            # start with x = x_t and y = x_t
            x = y; k = 0

            # check every product of m consecutive terms until y = x_{t+r}
            while k < r and g == 1:
                s = y # starting value to rollback
                for _ in range(min(m, r-k)):
                    y = (y*y+c)%n
                    q = q*abs(x-y)%n
                g = gcd(q, n)
                k += m

            # increase interval size for next iteration
            r *= 2

        # found a zero-product batch, rollback y to s
        if g == n: g = 1
        while g == 1:
            s = (s*s+c)%n
            g = gcd(abs(x-s), n)

        # done
        if g != n: return g

print(pollard_rho_brent(105))
print(pollard_rho_brent(10**9+3)) # not a prime
# print(pollard_rho_brent(10**9+7)) will also take a very long time since the number is prime
```

### Wrapping up

Now that we're all set, our pipeline for factorizing a number $n$ is as follows.

- Check if $n$ is prime using Miller-Rabin. If it's prime, output itself.
- Use Pollard-Rho-Brent to output a non-trivial factor $d$.
- Recurse factorization on $d$ and $\frac{n}{d}$ and combine both results.

The Python code is as shown below.

```python
from math import gcd
from random import *

def miller_rabin(p):
    if p == 2: return 1
    if p % 2 == 0: return 0
    if p == 3: return 1
    d, s = p-1, 0
    while d % 2 == 0: d //= 2; s += 1
    for _ in range(3):
        x = pow(randint(2, p-2), d, p)
        if x == 1 or x == p-1: continue
        ok = 0
        for _ in range(s):
            x = x*x%p
            if x == 1: return 0
            if x == p-1: ok = 1; break
        if not ok: return 0
    return 1

def pollard_rho_brent(n):
    while True:
        y = randint(1, n-1)
        c = randint(1, n-1)
        m = randint(1, n-1)
        g = r = q = 1
        while g == 1:
            x = y; k = 0
            while k < r and g == 1:
                s = y
                for _ in range(min(m, r-k)):
                    y = (y*y+c)%n
                    q = q*abs(x-y)%n
                g = gcd(q, n)
                k += m
            r *= 2
        if g == n: g = 1
        while g == 1:
            s = (s*s+c)%n
            g = gcd(abs(x-s), n)
        if g != n: return g

def factorize(n):
    # base case
    if n == 1: return {}
    if miller_rabin(n): return {n: 1}

    # non-trivial factor d
    d = pollard_rho_brent(n)

    # recurse two halves
    l = factorize(d); r = factorize(n//d)

    # accumulate results
    pf = {}
    for k, v in l.items():
        pf[k] = v
    for k, v in r.items():
        if k in pf: pf[k] += v
        else: pf[k] = v
    return pf

print(factorize(67676700))  # {2:2, 3:1, 5:2, 7:1, 13:1, 37:1, 67:1}
print(factorize(10**9+3))   # {23:1, 307:1, 141623:1}
print(factorize(10**9+7))   # {1000000007:1}
print(factorize(998244352)) # {2:23, 7:1, 17:1}
```

Now try using this on some Kattis problems that involve factoring large numbers (**not** in order of difficulty): [logri](https://open.kattis.com/problems/logri), [subcommittees](https://open.kattis.com/problems/subcommittees), [bigfactoring](https://open.kattis.com/problems/bigfactoring), [fourquestions](https://open.kattis.com/problems/fourquestions), [atrivialpursuit](https://open.kattis.com/problems/atrivialpursuit), [batchgcd](https://open.kattis.com/problems/batchgcd), [primitiveroots](https://open.kattis.com/problems/primitiveroots), [yetanotherdivisorproblem](https://open.kattis.com/problems/yetanotherdivisorproblem), [eveningout2](https://open.kattis.com/problems/eveningout2), [divisorsofasum](https://open.kattis.com/problems/divisorsofasum), [eindahradall](https://open.kattis.com/problems/eindahradall), [circlemerge](https://open.kattis.com/problems/circlemerge)

### Bash black magic

In case you haven't known, Linux's `factor` command also uses Pollard-Rho to factor a number, and it does a pretty good job at doing so!

```bash
> factor 67676700
67676700: 2 2 3 5 5 7 13 37 67
```

You can invoke this from Python by using `subprocess.check_output` if your OS so happens to be Linux, and this is where the black magic lies. This function will output the string in a format similar to `"67676700: 2 2 3 5 5 7 13 37 67"` and then we can process it further back in Python.

```python
import subprocess
from collections import Counter

def factorize(n):
    return Counter(map(int, subprocess.check_output(f"factor {n}",shell=1).split()[1:]))

print(factorize(67676700))  # counter of {2:2, 3:1, 5:2, 7:1, 13:1, 37:1, 67:1}
print(factorize(10**9+3))   # counter of {23:1, 307:1, 141623:1}
print(factorize(10**9+7))   # counter of {1000000007:1}
print(factorize(998244352)) # counter of {2:23, 7:1, 17:1}
```

Short and simple :)