# Python complex numbers for computational geometry
31 August 2026

[tag]: geometry, math, python

Sorry that I had to write this closer to the end of the month! I have been busy grinding Kattis and my actual irl work stuff, but the storm is starting to settle down and I can finally sit down and writing this peacefully.

This month's topic will be friendlier than usual, as we go through some applications of complex numbers especially when it comes to solving **computational geometry** problems, which people consider as a big pain to deal with due to precision issues. However, this write-up with focus more on the simplicity of the implementation rather than the precision of the result, so bear with me on that one.

## Motivation

Most computational geometry problems will require us to represent points in either a 2D or 3D Cartesian coordinate, and most people will be either use tuples, lists, or OOP. I wonder if I can appreciate the complex number approach even more after writing this.

Suppose you're reading $N$ the number of points to parse, and then the description of points in the next $N$ lines, represented by 2 space-separated integers `x y`.

```python
# either this way
N = int(input())
points = []
for _ in range(N):
    x, y = map(int, input().split())
    points.append((x, y))
print(points)

# or using OOP!
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def __str__(self):
        return f'({self.x}, {self.y})'
N = int(input())
points = []
for _ in range(N):
    x, y = map(int, input().split())
    points.append(Point(x, y))
print(points)
```

I guess the difference isn't much for now, since we're only reading the points! Now let's consider a few operations using these kind of complex numbers.

```python
N = int(input())
points = []
for _ in range(N):
    x, y = map(int, input().split())
    points.append(complex(x, y)) # or x+y*1j
print(points)
```

## The Norm

Instead of doing `(p[0]**2 + p[1]**2)**.5`, we can just to `abs(p)` since `abs` on complex numbers will simply return its modulus. E.g. `abs(3+4j) == 5`.

## Dot Product

Given two vectors $\vec{a}$ and $\vec{b}$, the dot product is basically $a_xb_x + a_yb_y$. If we represent the two vectors as complex numbers instead, say $a+bi$ and $c+di$, we want to obtain $ac+bd$, but notice that

$$(a-bi)(c+di) = (ac+bd)+(ad-bc)i$$

so we can simply just take the real part of the product!

In Python, to obtain the conjugate of a complex number, we can simply use the `.conjugate()` method, as for getting the real/imaginary part we simply use `.real` and `.imag` respectively.

```python
def dot(a, b):
    return (a.conjugate() * b).real
```

## Cross Product

Given two vectors $\vec{a}$ and $\vec{b}$, the dot product is basically $a_xb_y - a_yb_x$. Using a similar idea as the previous part, we want the $ad-bc$ from $a+bi$ and $c+di$, which is what we already had as the imaginary part of the previous product.

```python
def cross(a, b):
    return (a.conjugate() * b).imag
```

## Rotation

Rotation by multiples of $\frac{\pi}{2}$ radians counterclockwise since you want to convert $(x, y) \rightarrow (y, -x) \rightarrow (-x, -y) \rightarrow (-y, x) \rightarrow (x, y)$. This is basically multiplying the original complex number by $i$ per rotation.

```python
def rot90(x):
    return x * 1j
```

What about general angles?

Suppose we want to rotate a point $(x, y)$ by a specific angle $\theta$ against the origin, the point will then become $(x\cos\theta-y\sin\theta, y\cos\theta+x\sin\theta)$.

Representing this point as a complex number would mean we will end up with

$$(x\cos\theta-y\sin\theta) + i \cdot (y\cos\theta+x\sin\theta) = (x+yi)(\cos\theta+i\cdot\sin\theta)$$

After a bit of rearranging, notice how it's just a product between the original "point" $x+yi$ with a fixed complex number. That fixed complex number is indeed $e^{i\theta} = \cos\theta + i \cdot \sin\theta$.

We can make use a Python library called `cmath` that handles operations on complex numbers where the same on `math` might not be able to. With this idea in mind, we can make use of `cmath.exp` because we need to multiply the original $x+yi$ with $e^{i\theta}$.

```python
from cmath import *
def rot(p, a):
    return p * exp(a * 1j)
```

If the base of the rotation is not the origin, we can add a single extra step to handle the offset :)

```python
from cmath import *
def rot(p, a, c):
    return c + (p-c) * exp(a * 1j)
```

Alternatively, you can also use `cmath.rect` to replace `cmath.exp`, but I personally prefer using `exp` because this is widely applicable for Fast Fourier transform as well, though this particular topic is not in scope of this article. In other words, one can rewrite `exp(a * 1j)` as `rect(1, a)`. I thought this is important to put down here, as future possible usage of `rect` will be replaced by `exp`.

## Projection

The current task is projecting a point $P$ onto the line $AB$. Let's define $\vec{AB} = B-A, \vec{AP} = P-A$. Finding the vector projection of $\vec{AP}$ onto $\vec{AB}$ simply requires the dot formula.

$$\text{proj}_{\vec{AB}}\vec{AP} = \frac{\vec{AP} \cdot \vec{AB}}{\vec{AB} \cdot \vec{AB}}\vec{AB}$$

But this is equivalently the same as

$$\frac{(p_x - a_x)(b_x - a_x) + (p_y - a_y)(b_y - a_y)}{(b_x - a_x)^2 + (b_y - a_y)^2}(B-A)$$

Note that

$$
\begin{align*}
\frac{P-A}{B-A} &= \frac{(p_x - a_x) + (p_y - a_y)i}{(b_x - a_x) + (b_y - a_y)i}\\
&= \frac{[(p_x - a_x) + (p_y - a_y)i][(b_x - a_x) - (b_y - a_y)i]}{(b_x - a_x)^2 + (b_y - a_y)^2}\\
&= \frac{(p_x - a_x)(b_x - a_x) + (p_y - a_y)(b_y - a_y)}{(b_x - a_x)^2 + (b_y - a_y)^2} + i \cdot \frac{-(p_x - a_x)(b_y - a_y) + (p_y - a_y)(b_x - a_x)}{(b_x - a_x)^2 + (b_y - a_y)^2}
\end{align*}
$$

Therefore, we can conclude that the projection is simply $\text{proj}_{\vec{AB}}\vec{AP} = \text{Re}(\frac{P-A}{B-A})(B-A)$.

Also, the projected point is simply $P_{\text{proj}} = A + \text{proj}_{\vec{AB}}\vec{AP}$.

```python
def proj(p, a, b):
    return a + ((p-a)/(b-a)).real * (b-a)
```

This is, of course, assuming $A \neq B$.

## Line Intersection

Assuming non-degenerate cases, implementing line intersection of $AB$ and $CD$ can be done in just two lines of code (or less if golfed).

```python
def intersect(a, b, c, d):
    t = cross(c-a, d-c) / cross(b-a, d-c)
    return a + t * (b-a)
```
Any point $P(t)$ along line $AB$ can be written as $P(t) = a+t(b-a)$. Next, in order for this same point to lie on $CD$, we must have $P(t)-c$ to be parallel with $d-c$.

Since two lines are parallel iff their cross product is 0, we have $$(P(t)-c) \times (d-c) = 0$$

Subsituting back $P(t)$ in terms of $a$ and $b$, we have $$(a+t(b-a)-c) \times (d-c) = ((a-c) + t(b-a)) \times (d-c) = 0$$

We can further decompose this cross product into $$(a-c) \times (d-c) + t \cdot ((b-a) \times (d-c))$$, so solving the zero of this term is equivalent to moving one of the term to the other side, so something like this.

$$t \cdot ((b-a) \times (d-c)) = - (a-c) \times (d-c) = (c-a) \times (d-c)$$

Thus the quotient $t = \frac{(c-a) \times (d-c)}{(b-a) \times (d-c)}$ as per given code.

## Polygon Area

Remember the shoelace theorem to compute a polygon's area? Well, this is basically just spamming `cross` over and over.

```python
def area(P):
    return abs(sum(cross(P[i], P[i-1]) for i in range(len(P)))) / 2
```

I decided to use `P[i-1]` instead of `P[(i+1)%len(P)]` because it's shorter, and a flipped sign doesn't matter here since we will apply `abs` in the end.

## Circle Tangents

Given a point $p$, a circle with radius $r$ centered at $c$, what are the point(s) of tangency of the circle from $P$, if any?

```python
from cmath import *
def tangent(p, c, r):
    v = p - c
    d = abs(v)
    if d < r: return [] # inside the circle
    theta = acos(r / d) # find the angle adjacent to the radius and the line
    unit = v / d * r
    return [c + unit * exp(theta * 1j), c + unit * exp(-theta * 1j)]
```

Basically we connect $p$ and $c$, and find out the angle it makes against the tangent line, then we simply figure out the tangent point by adding the vector from $c$.

## Circle-circle Intersection

```python
from cmath import *
def intersect_circle(c1, r1, c2, r2):
    d = abs(c2 - c1)
    if d > r1 + r2 or d < abs(r1 - r2) or d == 0: return [] # well-known condition
    theta = acos((r1**2 + d**2 - r2**2) / (2 * r1 * d))
    base = (c2 - c1) / d * r1
    return [c1 + base * exp(theta * 1j), c1 + base * exp(-theta * 1j)]
```

The idea is very similar to the tangent point formula, but this time we're making good use of the law of cosine to compute `theta`.

$$\cos\theta = \frac{r_1^2+d^2-r_2^2}{2r_1d}$$

## Circumcenter

```python
def circumcenter(a, b, c):
    v1, v2 = b - a, c - a
    return a + 1j * (v1 * abs(v2)**2 - v2 * abs(v1)**2) / (2 * cross(v1, v2))
```

The idea here is to first shift all three points such that $a$ is at the origin $(0, 0)$, so now the other two points are at $v_1 = b-a$ and $v_2 = c-a$.

Next, we want to find a point $x$ such that $|x|^2 = |x-v_1|^2 = |x-v_2|^2$. Using the formula $d \cdot \text{conjugate}(d) = |d|^2$, we have

$$
\begin{align*}
x \cdot \text{conjugate}(x) &= (x-v_1) \cdot \text{conjugate}(x-v_1)\\
&= x \cdot \text{conjugate}(x) - x \cdot \text{conjugate}(v_1) - v_1 \cdot \text{conjugate}(x) + v_1 \cdot \text{conjugate}(v_1)\\
x \cdot \text{conjugate}(v_1) + v_1 \cdot \text{conjugate}(x) &= |v_1|^2
\end{align*}
$$

Similarly,

$$x \cdot \text{conjugate}(v_2) + v_2 \cdot \text{conjugate}(x) = |v_2|^2$$

Eliminating $\text{conjugate}(x)$ by multiplying both equations by their respective proper coefficients, and we get

$$x \cdot \text{conjugate}(v_1) \cdot v_2 - x \cdot \text{conjugate}(v_2) \cdot v_1 = v_2|v_1|^2 - v_1|v_2|^2$$

Finally, we have

$$x = \frac{v_2|v_1|^2 - v_1|v_2|^2}{v_2 \text{conjugate}(v_1) - v_1 \text{conjugate}(v_2)}$$

This next part's a bit derived by reverse engineering, but note that

$$\text{cross}(v_1, v_2) = \frac{v_2 \text{conjugate}(v_1) - v_1 \text{conjugate}(v_2)}{2i}$$

Therefore, we can substitute the denominator accordingly as such.

$$x = \frac{v_2|v_1|^2 - v_1|v_2|^2}{2i \cdot \text{cross}(v_1, v_2)} = -\frac{v_2|v_1|^2 - v_1|v_2|^2}{2 \cdot \text{cross}(v_1, v_2)}i = \frac{v_1|v_2|^2 - v_2|v_1|^2}{2 \cdot \text{cross}(v_1, v_2)}i$$

The last step is to bring back the original offset of $a$ and we've obtained the result.

## Collinearity

Before that, we need an extra function `ccw` that checks if three points $a, b, c$ are forming a counter-clockwise turn, a clockwise turn, or a straight line.

```python
def ccw(a, b, c):
    return cross(b-a, c-a)
```

If the return value is positive (i.e. $>0$) then the three points are forming a counter-clockwise turn. Clockwise turn if negative and a straight line if 0.

Therefore, to check if three points are collinear, we simply check if `ccw(a, b, c) == 0`.

## Convex Hull

Now, we can extend the previous idea to perform the Graham scan when forming the top and lower part of the convex hull, which is the minimum polygon that contains all the points in the original polygon.

In this technique, we repeatedly remove the previously added points that don't make a counter-clockwise turn with the current point of interest. This is because the convex polygon is a convex hull and will eventually consist of points that make a counter-clockwise turn with their adjacents.

```python
def chull(pts):
    if len(pts) < 3: return pts
    pts, n = sorted(pts, key=lambda x: (x.real, x.imag)), len(pts) # sort points by their original (x, y) coordinates
    upper, lower = pts[:2], pts[-1:-3:-1]
    for i in range(2, n):
        while len(upper) > 1 and ccw(upper[-2], upper[-1], pts[i]) <= 0: upper.pop()
        upper.append(pts[i])
    for i in range(n-2, -1, -1):
        while len(lower) > 1 and ccw(lower[-2], lower[-1], pts[i]) <= 0: lower.pop()
        lower.append(pts[i])
    return upper[:-1] + lower[:-1]
```

---

That is all for now! There are possibly other applications that involve more `cmath` like the usage of `cmath.phase` instead of using `math.atan` or `math.atan2`, but I hope you have at least slightly more idea of how complex numbers work in Python, especially when it comes to computational geometry!