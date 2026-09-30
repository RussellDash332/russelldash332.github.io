# Interesting High School Inequality
30 September 2026

[tag]: math

I was at a house party spectating my friends solving math problems for fun when we stumbled across this high school olympiad question:

> Given $n$ numbers $a_1 \ge 1$ and $a_{i+1} \ge a_i+1$ for $1 \le i \le n-1$. Prove that $a_1^3 + a_2^3 + \cdots + a_n^3 \ge (a_1 + a_2 + \cdots + a_n)^2$.

Then, the second part:

> Furthermore, prove that $a_1^5 + a_2^5 + \cdots + a_n^5 \ge (a_1 + a_2 + \cdots + a_n)^3$.
 
Surprisingly, we came up with different solutions, and I thought I'd share what came across our minds that day.

Before we begin, credits to Devandhira Wijaya and Nicholas Minardi for bringing this topic again, days after the house party, so I finally have something nice to share for the month.

> I might not use any sigma notation anywhere in this article just because.

## Prologue

To start, we think of this problem as an induction problem. Clearly, the inequality is satisfied for $n=1$ because $a_1 \ge 1$ and therefore $a_1^3 \ge a_1^2$.

Next, assume that the inequality is satisfied for $n=k-1$. We have

$$a_1^3 + a_2^3 + \cdots + a_{k-1}^3 \ge (a_1 + a_2 + \cdots + a_{k-1})^2$$

Then it suffices to show that the inequality is also satisfied for $n=k$. Equivalently, we want this to be satisfied:

$$a_1^3 + a_2^3 + \cdots + a_{k-1}^3 + a_k^3 \ge (a_1 + a_2 + \cdots + a_{k-1} + a_k)^2$$

Let's start working on the left hand side. Since it works for $n = k-1$, we have

$$
\begin{align*}
(a_1^3 + a_2^3 + \cdots + a_{k-1}^3) + a_k^3 &\ge (a_1 + a_2 + \cdots + a_{k-1})^2 + a_k^3 \\
&= ([a_1 + a_2 + \cdots + a_{k-1} + a_k] - a_k)^2 + a_k^3 \\
&= [(a_1 + a_2 + \cdots + a_{k-1} + a_k)^2 - 2a_k(a_1 + a_2 + \cdots + a_{k-1} + a_k) + a_k^2] + a_k^3 \\
&= (a_1 + a_2 + \cdots + a_{k-1} + a_k)^2 + [a_k^3 - 2a_k(a_1 + a_2 + \cdots + a_{k-1}) - a_k^2]
\end{align*}
$$

This means, if we can prove that $a_k^3 - 2a_k(a_1 + a_2 + \cdots + a_{k-1}) - a_k^2 \ge 0$, the problem is solved! Equivalently, this is what we want to prove.

$$
\begin{align*}
a_k^3 - 2a_k(a_1 + a_2 + \cdots + a_{k-1}) - a_k^2 &\ge 0 \\
a_k^2 - 2(a_1 + a_2 + \cdots + a_{k-1}) - a_k &\ge 0 \\
a_k^2 - a_k &\ge 2(a_1 + a_2 + \cdots + a_{k-1}) \\
\frac{a_k(a_k-1)}{2} &\ge a_1 + a_2 + \cdots + a_{k-1}
\end{align*}
$$

## Integer version

The initial question only stated "numbers", so it wasn't that clear whether they are integers or real numbers. For now, let's assume they are the former, since I wanted to use a particular trick.

Notice that the form $\frac{a_k(a_k-1)}{2}$ is equal to $1+2+\cdots+(a_k-1)$. Therefore, we want to prove that

$$1+2+\cdots+(a_k-1) \ge a_1+a_2+\cdots+a_{k-1}$$

However, notice that $1 \le a_1 < a_2 < \cdots < a_{k-1} \le a_k-1$, and since all the terms above are integers, this means that the $k-1$ terms on the right hand side is actually a subset of the terms on the left hand side, thus completing our proof.

## Generalization to real numbers

Clearly it would be more challenging if the question assumes real numbrs instead, but this is actually also doable!

Notice that

$$a_k \ge a_{k-1}+1 \ge a_{k-2}+2 \ge \cdots \ge a_1 + (k-1) \ge k$$

This means for any $1 \le i \le k-1$, we have the property $a_k - a_i \ge k-i$. Repeatedly substituting the $k-1$ values and adding all of them, we have

$$
\begin{align*}
(k-1)a_k - (a_1 + a_2 + \cdots + a_{k-1}) &\ge (k-1) + (k-2) + \cdots + 1 \\
&= \frac{k(k-1)}{2} \\
a_1 + a_2 + \cdots + a_{k-1} &\le (k-1)a_k - \frac{k(k-1)}{2}
\end{align*}
$$

Recall the original inequality that we want to prove at the last induction step:

$$\frac{a_k(a_k-1)}{2} \ge a_1 + a_2 + \cdots + a_{k-1}$$

Therefore, it suffices to show that

$$
\begin{align*}
(k-1)a_k - \frac{k(k-1)}{2} &\le \frac{a_k(a_k-1)}{2} \\
(k-1)(2a_k-k) &\le a_k(a_k-1) \\
2ka_k - k^2 - 2a_k + k &\le a_k^2 - a_k \\
a_k^2 - 2ka_k + k^2 + a_k - k &\ge 0 \\
(a_k - k)^2 + (a_k - k) &\ge 0 \\
(a_k - k)(a_k - k + 1) &\ge 0
\end{align*}
$$

which is true because from the aforementioned chain inequality we obtained $a_k \ge k$.

## Alternate proof

Special credits to Nicholas Minardi again for the alternate proof that was posted on his Instagram account [@menahmathics_16](https://instagram.com/menahmathics_16). His proof uses bounding on $a_i^3$ instead as such.

Since $a_i \ge a_{i-1}+1$, we have (assume $a_0 = 0$)

$$
\begin{align*}
a_1^3 + a_2^3 + \cdots + a_n^3 &\ge a_1^2(a_0+1) + a_2^2(a_1+1) + \cdots + a_n^2(a_{n-1}+1) \\
&= (a_1^2 + a_2^2 + \cdots + a_n^2) + (a_1^2a_0 + a_2^2a_1 + \cdots + a_n^2a_{n-1})
\end{align*}
$$

It suffices to show that $a_1^2a_0 + a_2^2a_1 + \cdots + a_n^2a_{n-1} \ge 2(a_1a_2 + a_1a_3 + \cdots + a_1a_n + a_2a_3 + \cdots + a_{n-1}a_n)$.

After some pattern finding from the first few terms, we have

$$
\begin{align*}
a_2^2a_1 = a_2(a_1a_2) &\ge 2a_1a_2 \\
\\
a_3^2a_2 = a_3(a_2a_3) &\ge (a_1+2)a_2a_3 \\
&\ge 2a_2a_3 + a_1a_2a_3 \\
&\ge 2a_2a_3 + 2a_1a_3
\end{align*}
$$

Based on the above, we also want to claim that $a_i^2a_{i-1} \ge 2a_i(a_1+a_2+\cdots+a_{i-1})$ or equivalently $a_ia_{i-1} \ge 2(a_1+a_2+\cdots+a_{i-1})$.

> Not to be confused with $a_i(a_i-1)$... this one's a tighter bound.

Only at this point then the induction was applied. The base cases $i = 2$ and $i = 3$ can be seen above. Now suppose it's true for $i = k-1$, then for $i = k$, we have

$$
\begin{align*}
a_ka_{k-1} &= 2a_{k-1} + a_{k-1}(a_k-2) \\
&\ge 2a_{k-1} + a_{k-1}a_{k-2} \\
&\ge 2a_{k-1} + 2(a_1+a_2+\cdots+a_{k-2}) \\
&= 2(a_1+a_2+\cdots+a_{k-1})
\end{align*}
$$

Now that the claim is proven, we can simply backtrack by summing all the inequalities for $i = 2, 3, \cdots, n$.

## The one-shot

Now that we've cleared the first part, which was the main chunk of this question, the second part can be done easily using Cauchy-Schwarz inequality:

$$(x_1^2 + x_2^2 + \cdots + x_n^2)(y_1^2 + y_2^2 + \cdots + y_n^2) \ge (x_1y_1 + x_2y_2 + \cdots + x_ny_n)^2$$

Setting $x_i = a_i^2\sqrt{a_i}$ and $y_i = \sqrt{a_i}$, we have

$$(a_1^5 + a_2^5 + \cdots + a_n^5)(a_1 + a_2 + \cdots + a_n) \ge (a_1^3 + a_2^3 + \cdots + a_n^3)^2 \ge (a_1 + a_2 + \cdots + a_n)^4$$

The second and third expression are directly obtained from the first part.

To finish it, we divide both the first and third expression by $(a_1 + a_2 + \cdots + a_n)$ to obtain the desired inequality.

> There are plenty other ways to solve both the first and second part, but since it's a high school math problem, we avoid using as many weird techniques as possible :)