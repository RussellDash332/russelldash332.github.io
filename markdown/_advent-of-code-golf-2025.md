# Advent of Code(golf) 2025
12 December 2025

[tag]: advent-of-code, python, code-golf

I have been doing Advent of Code (AOC) since 2021 and have completed all questions from 2015 as of writing this article. While the initial goal was to learn new languages (like Haskell and Rust), I ended up sticking to Python since 2023 and decided to take things up a notch: **golf the solution to a single line of code**. Once I managed to complete all 25 days (only 12 days starting this year) of problems, I would combine them into a single Python file and call it ***The Basilisk***. (get it? big snake...)

I thought this is a fun way of honing my Python understanding, not just that of data structures and algorithms. I feel that codegolfing a language exposes you to some hidden tricks on coding that language, which you'll see soon enough.

To keep up with my monthly commitment of posting at least one write-up, I decided to document my basilisk for this year's AOC. Here's my current ruleset when it comes to creating the basilisk:

- Importing third-party libraries like `networkx` or `numpy` is strictly not allowed.
- You are allowed to use semicolons to separate lines, e.g. `a=1;b=2;print('Hello')`. After AOC 2023, I realize banning this doesn't make sense since I can just *walrus-operator* almost everything: `[a:=1,b:=2,print('Hello')]`.
- Importing built-in libraries is fine, like `re`, `datetime`.
- Do not use `exec` at all. That's lame, very very lame. Using `eval` is fine though.
- Inputs must come from `stdin`, and not by reading a file. Either using `import sys;sys.stdin` or `open(0)` should work all the time.
- Output must be in **two** lines (not one): `Part 1: <answer1>` and `Part 2: <answer2>`.
- This year, I'm okay with syntax warnings, so `[1for _ in range(8)]` instead of `[1 for _ in range(8)]` is fine - shouldn't matter much.

<br>
For reference, you can find the basilisks here: [AOC 2023](https://github.com/RussellDash332/advent-of-code/blob/main/aoc-2023/basilisk.py), [AOC 2024](https://github.com/RussellDash332/advent-of-code/blob/main/aoc-2024/basilisk.py), [AOC 2025](https://github.com/RussellDash332/advent-of-code/blob/main/aoc-2025/basilisk.py).

## Day 1 - 142 bytes

<div class="aocgolf">

```python
p=50;q=[[p:=(p+2*(x>'Q')-1)%100for _ in'.'*int(x[1:])]for x in open(0)];print('Part 1:',sum(r[-1]<1for r in q),'\nPart 2:',sum(q,[]).count(0))
```

</div>

What a great start for the year! I decided to store the end destination of every single step as a 2D list to answer part 1, and then flatten the list to 1D for part 2. E.g. `L20,R10` becomes `[[49,48,...,30],[31,32,...,40]]`, which will then become `[49,48,...,30,31,32,...,40]`.

The bottleneck of the code speed is `sum(q,[]).count(0)`, which could've been much faster if I use `sum(r.count(0)for r in q)`. Note that `sum(q,[])` concatenates all the destinations into a single list, so that's why it takes a noticeable amount of time.

Initially, to check whether it's left `L` or right `R`, I used `x[0]>'Q'`, but using `x>'Q'` is sufficient because `"L9999..." < "Q" < "R0000..."`. You will find this kind of string checking very common because `==` consumes more characters than `<` or `.`. Checking for the first letter from each from a bunch of strings might require some workaround on what's the best boundary to use the strict inequalities.

In programming problems, when it comes to grids, almost all the time one represent walls with the `#` character, empty spaces with dots `.`, and some objects within a cell with either an uppercase letter, an asterisk `*`, or the `@` sign. To check whether it's equal to a specific character or not, we can refer to the ordering of the ASCII characters, like `#*.@ABCD` in increasing order, and then we can conclude what's the boundary to use.

> For example, to check if a cell is a wall, instead of using `cell == '#'`, use `cell < '*'`, assuming there's no other character lexicographically in between them.

## Day 2 - 196 bytes

<div class="aocgolf">

```python
import re;v=[[*map(int,l.split('-'))]for l in input().split(',')];f=lambda t:sum(i for a,b in v for i in range(a,b+1)if re.match(rf'^(\d+)\1{t}$',str(i)));print('Part 1:',f(''),'\nPart 2:',f('+'))
```

</div>

I had no issue with parsing the input into a list of pairs representing the intervals like `[[a1, b1], [a2, b2], ..., [an, bn]]`. Initially I was trying to loop for all pattern lengths and check if any one of them satisfies, e.g. given a string `s` check for all `k` if any of `s[:k]*(len(s)//k) == s` is true. But guess what, regex is indeed OP.

For part 1, you want exactly one repeat, so you can use the regex `^(\d+)\1$`. Let's break it down.

- `(\d+)` captures any nonzero number of digits
- `\1` refers to the digits we captured earlier - capture group 1
- `^` and `$` to signify that the pattern must occur at the beginning and the end of the string, meaning this has to be the entire thing and not just occuring as a substring

For part 2, you simply change `\1` to `\1+` to include possibly more than just one repetition. Now, it boils down to how can we generalize the function so that part 1 and part 2 invocations have minor differences: just the `+` sign. Since `rf`-string works in Python, why not use it?

## Day 3 - 187 bytes

<div class="aocgolf">

```python
from functools import*;f=cache(lambda x,n:max(f(y:=x//10,n),10*f(y,n-1)+x%10)if x*n else 0);v=[*map(int,open(0))];print('Part 1:',sum(f(x,2)for x in v),'\nPart 2:',sum(f(x,12)for x in v))
```

</div>

My first thought when doing the question was using DP, but greedy solution using iteration works. Of course, codegolfing favours recursion, so using `functools.cache` was the right call.

My DP initially stores `(idx=position_in_string, n=digits_left)`, and I realized that if you're working from the back instead of the front, the transition is just `10*dp(subproblem) + digit` instead of `10**... * digit + dp(subproblem)` which requires more characters. On top of that, working from the back means instead of storing the position in string and having to convert `string[position]` over and over to integer, you can work only around integers: store `(x=bank_digits, n=digits_left)` and truncate the last digit by going to `x//10` instead of subtracting the index to `idx-1`, but in return you can save characters by adding `x%10` instead of `int(s[idx])`.

The base case is to return `0` if either `x == 0` (no more bank digits), or `n == 0` (selected enough digits). Checking for `x*n` as is means that in order for `x*n` to be evaluated as `True`, it has to be nonzero, meaning both must be nonzero. Therefore, the `if` clause is for the recursive case, and the `else` clause is the base case.

## Day 4 - 299 bytes

<div class="aocgolf">

```python
R=range;r=len(m:=[*map(list,open(0))]);c=len(m[0])-1;P=[0];[[q:=len(M:=[(i,j)for i in R(r)for j in R(c)if'.'<m[i][j]!=sum(r>i+x>-1<j+y<c!=m[i+x][j+y]>'.'for x in R(-1,2)for y in R(-1,2))<5]),[m[i].__setitem__(j,'.')for i,j in M],q and P.append(q)]for p in P];print('Part 1:',P[1],'\nPart 2:',sum(P))
```

</div>

Quite early to show off how one can convert a `while` loop into just a bunch of list appendings.

Let's start with `c=len(m[0])-1`. The `-1` might be subtle, but when you're reading with `open(0)`, the lines will include the newline character `\n` as well, thus the need for `-1`. Take note that the last line will not have this character, and therefore without the `-1`, an index error might be triggered upon touching the last line.

Next, the `while` loop conversion. Initially, I had the following pseudocode.

```text
z = 0 to keep track of the number of processed @
while true:
    define M as the positions of all the @ that satisfies the constraint
    bulk-update the original array based on M
    z += len(M)
    if this is the first iteration, output z for part 1
    if M is empty, break the loop
output z for part 2
```

The trick is to iterate through the list you're going to append to, like `[arr.append(something) for ... in arr]`, and the loop will eventually stop if you're not appending anymore.

This trick will also solve the part 1 printing issue because I don't have to explicitly check whether `M` is empty in order to print (otherwise I will have 2 `print` invocations). I just need to store the number of `@`'s that gets removed every iteration in that array.

For example, start with `P = [0]` and then iterate through `P`, and say that you end up with `[0, 3, 2, 3, 4]` and after the last `4`, you will get no more processed `@`'s. Then, part 1 is just `P[1]`, while part 2 will simply be `sum(P)`.

Once I knew how to construct `P`, I simply add these two procedures before appending to `P` every iteration.

- Since `M:=[(i,j)for i in R(r)for j in R(c)if'.'<m[i][j]!=sum(r>i+x>-1<j+y<c!=m[i+x][j+y]>'.'for x in R(-1,2)for y in R(-1,2))<5]` will store the position of the @'s to be removed at once, I can simply define the newly added element to `P` as `len(M)`.
- Bulk-updating requires `list.__setitem__` as shown in `m[i].__setitem__(j,'.')`, which is essentially `m[i][j] = '.'`.

Note that `R>r>-1<c<C` is a common trick to check if `(r, c)` is a valid position in a $R \times C$ grid. As for why the sum of the `@`'s is 5, this is because looping through the $3 \times 3$ region will also include its own cell, which will definitely be a `@`, thus an extra.

I had to experiment between using normal `range` without redefining it to `R`, or just use `range(-1,2)` as `R` and the other two `range`s will be unmodified, but the one you see above is the best option.

## Day 5 - 295 bytes

<div class="aocgolf">

```python
S,M=str.split,[];A,B=S(open(0).read(),'\n\n');[M.append(M and(a:=M[-1])[1]>=j[0]<=j[1]>=a[0]and[M.pop(),min(a[0],j[0]),max(a[1],j[1])][1:]or j)for j in sorted([*map(int,S(i,'-'))]for i in S(A))];print('Part 1:',sum(any(a<=int(q)<b+1for a,b in M)for q in S(B)),'\nPart 2:',sum(b-a+1for a,b in M))
```

</div>

Surprisingly, I managed to make this shorter than Day 4's code. This is basically an interval merging problem. It's [very well-known in LeetCode](https://leetcode.com/problems/merge-intervals/) but guess what, it was also tested in [CS1010S practical exam](https://github.com/RussellDash332/golf/blob/main/merge_intervals.py), which means I had a good golfed template of the interval merging.

The `merge` helper function was missing in the latter, so let me put it here.

```python
def merge(a, b):
    if a[1] < b[0] or b[1] < a[0]:
        return False
    else:
        return (min(a[0], b[0]), max(a[1], b[1]))
```

Before I move on with the golfed code, let's show you the original `merge_intervals` function that I had.

```python
def merge_intervals(intervals):
    r = []
    for j in sorted(intervals):
        if r:
            k = merge(r[-1], j)
            if k: r[-1] = k
            else: r.append(j)
        else:
            r.append(j)
    return r
```

Or, if without the `merge` function...

```python
def merge_intervals(intervals):
    r = []
    for j in sorted(intervals):
        if r and r[-1][1] >= j[0] and j[1] >= r[-1][0]: r[-1] = (min(r[-1][0], j[0]), max(r[-1][1], j[1]))
        else: r.append(j)
    return r
```

And therefore, the semi-golfed `merge_intervals` without the pre-specified `merge` function.

```python
def merge_intervals(intervals):
    h=lambda a,b:0if a[1]<b[0]or b[1]<a[0]else[min(a[0],b[0]),max(a[1],b[1])]
    return [r:=[],[[r.pop(),r.append(k)]if r and(k:=h(r[-1],j))else r.append(j)for j in sorted(intervals)]][0]
```

Now, let's get back to the main problem. Reading the input requires to recognize the empty line in between and therefore using `open(0).read().split('\n\n')` will do the job just fine. The parsing afterwards becomes clear once you get the initial splitting to work.

Next, dealing with the ranges `A` and the queries `B`. Using `.split` will work, but since I'm doing 4 string splits, using `S=str.split` will save me some characters. Note that `S(A), S(A,char)` is essentially `A.split(), A.split(char)`.

The merged intervals will be stored in the variable `M` as a list of pairs `[[a1, b1], [a2, b2], ..., [an, bn]]`. Answering part 1 will require you checking for every query integer `q` in `B` if it lies in any of these intervals (binary search is not needed as the number of intervals is small), while answering part 2 is simply a linear pass on `M` itself.

Using the golfed `merge_intervals` function as is, however, will be suboptimal, as this is only done once and therefore need not be done as a function, so I had to do a bunch of workarounds to end up with my final solution.

Changing the lambda function `h` to be directly computed with computing `k:=h(r[-1],j)` was rather straightforward, but the real fun only comes when golfing the `[r.pop(),r.append(k)]if r and(k:=h(r[-1],j))else r.append(j)` part.

First, as `h` is only called once we can unpack `h(r[-1],j)` so we have the following.

```python
[r.pop(),r.append(k)]if r and(k:=0if(a:=r[-1])<j[0]or j[1]<a[0]else[min(a[0],j[0]),max(a[1],j[1])])else r.append(j)
```

Then, we want to remove the double appends to become one, so can combine this by removing the walrus assignment to `k`.

```python
r.append(r and(j if(a:=r[-1])<j[0]or j[1]<a[0]else[r.pop(),min(a[0],j[0]),max(a[1],j[1])][1:])or j)
```

The reason why this works is the short-circuiting of Python boolean evaluations. The code above is in the form of `a and b or c`. This breakdown will consider the *truthy* (is not necessrily equal to `True` but converting it bool will result in `True`) and *falsey* (basically the opposite) values of `a`, `b`, and `c`.

- If `a` is falsey, then it will skip the evaluation of `b` and will return whatever the value of `c` is, whether it's truthy or falsey.
- If `a` is truthy, then it will evaluate `b`. If `b` is truthy as well, then it doesn't need to evaluate `c` and return `b`. Otherwise, it will return `c` regardless of the value of `c`.

Therefore, it will return `b` **if and only if** `a` and `b` is truthy. In our code's case, we pop return `(j if ... [1:])` **if and only if** `r` is non-empty (since `(j if ... [1:])` is by default truthy) and return `j` otherwise.

**This is not the final version yet**. Notice that the standalone `j` appears twice, so if I invert the conditionals, I might end up with a shorter alternative with one less `j`, and in fact, I actually did!

Notice that we need both `r` being non-empty and `(a:=r[-1])<j[0]or j[1]<a[0]` to be **`False`** in order to do two things: pop from `r` and return `min(a[0],j[0]),max(a[1],j[1])`, which I subsequently combined into a single statement `[r.pop(),min(a[0],j[0]),max(a[1],j[1])][1:]`. Next, what I did was inverting the `(a:=r[-1])<j[0]or j[1]<a[0]` condition to be `(a:=r[-1])>=j[0]and j[1]>=a[0]`, and then removing the `and` to become `(a:=r[-1])>=j[0]<=j[1]>=a[0]` because `j[0]<=j[1]` in any interval anyway. Now, I want `r` to be non-empty and this *new condition* to be `True` to return `min(a[0],j[0]),max(a[1],j[1])`, otherwise `j`.

This is where I extended the short-circuit boolean pattern: `a and b and c or d`. Basically, you need `a and b and c` to be `True` to return `c`, but `d` otherwise. Since `c` is truthy in our context (the pair represented as a list of two elements), we just need to ensure `a` and `b` are truthy. This pattern matches the condition **[non-empty `r`]** and **[new condition]** having to be truthy, and so I came up with the finalized version.

```python
# version 1 for comparison, 115 bytes
[r.pop(),r.append(k)]if r and(k:=0if(a:=r[-1])<j[0]or j[1]<a[0]else[min(a[0],j[0]),max(a[1],j[1])])else r.append(j)

# version 2 for comparison, 99 bytes
r.append(r and(j if(a:=r[-1])<j[0]or a[1]<j[0]else[r.pop(),min(a[0],j[0]),max(a[1],j[1])][1:])or j)

# finalized version, 93 bytes
r.append(r and(a:=r[-1])>=j[0]<=j[1]>=a[0]and[r.pop(),min(a[0],j[0]),max(a[1],j[1])][1:]or j)

# a: r
# b: (a:=r[-1])>=j[0]<=j[1]>=a[0]
# c: [r.pop(),min(a[0],j[0]),max(a[1],j[1])][1:]
# d: j
```

Yes, all of that to cut down 6 more characters, but it's significant for a codegolfer :)

## Day 6 - 226 bytes

<div class="aocgolf">

```python
*X,P=open(0);P=P.split();A=[*zip(*map(str.split,X))];B=[''.join(x).strip()for x in zip(*X)];print('Part 1:',sum(eval(p.join(x))for x,p in zip(A,P)),'\nPart 2:',sum([eval(p.join(B[:(x:=B.index(''))])),B:=B[x+1:]][0]for p in P))
```

</div>

Easy but tedious parsing problem. You start with an input like this (taken from the website's example input).

```
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
```

Using `open(0)` is basically invoking a generator for the following iterable of strings.

```
[
    '123 328  51 64 \n',
    ' 45 64  387 23 \n',
    '  6 98  215 314\n',
    '*   +   *   +  '
]
```

Therefore, doing `*X,P` will separate the last one into `P` and everything else into `X`. Splitting `P` will get you a clean list of operators `['*', '+', '*', '+']`.

For part 1, I need to have a list of list of numbers read vertically like `[['123', '45', '6', '64'], ['328', '64', '98'], ...]` and keep the numbers as strings so I can simply join them with the operator signs as the delimiter. This is exactly what the list `A` is going to be. You start with processing the numbers row-by-row and then transpose them using `zip`. Once you get `A`, you can iterate through this list and the operators `P` at the same time. Using `zip` again, combine the numbers with the operators and calculate using `eval`, then sum all of the results.

> Note that `zip` takes **multiple arguments**, and not just one. So, if you want to transpose a 2D list, you have to unpack the list into individual arguments of `zip`. For example, `zip([1, 2, 3], [4, 5, 6])` is an iterable generator for `[(1, 4), (2, 5), (3, 6)]`. The length of each argument need not be the same, and the zip result will just have the length being the minimum of these lengths, like `zip([1, 2, 3], [4])` which will result in just `[(1, 4)]` if you convert the `zip` object into a list.

As for part 2, the plan is to transpose the numbers beforehand and then see what we can do with it. By doing `B=[''.join(x).strip()for x in zip(*X)]`, I am essentially transposing `X` and do some adjustments to as follows.

```text
zip(*X)               -> [('1', ' ', ' '), ('2', '4', '6'), ('3', '5', '6'), (' ', ' ', ' '), ('3', '6', '9'), ..., (' ', ' ', '4'), ('\n', '\n', '\n')]
''.join(each element) -> ['1  ', '24 ', '356', '  ', '369', '248', '8  ', '  ', ' 32', ..., '  4', '\n\n\n']
trim whitespaces      -> ['1',   '24',  '356', '',   '369', '248', '8',   '',   '32',  ..., '4',   '']
```

Initially, I wanted to find all the indices that contain `''` and then use this to get the respective slices of `B` (without modifying `B`), but I thought of a better idea: **keep finding the first occurence of `''` with `.index`, and then slice `B` directly instead**.

In the example, we have the list `B` as follows.

```text
['1', '24', '356', '', '369', '248', '8', '', '32', ..., '4', '']
```

The first occurence of `''` is at index `3`, so we can slice `B[:3]` to get the numbers to combine, and then update remove the first `3 + 1 = 4` elements from `B` (because of the `''` being counted as one element). The list `B` is then updated to look like this.

```text
['369', '248', '8', '', '32', ..., '4', '']
```

This will go on until all operators have been processed, and there are exactly as many operators as the number of iterations this will take.

To conclude, we can simply iterate through `P`, and for each operator `p`, we do these steps in one go.

- Find first occurence of `''` in `B`, say this is at index `x`
- Join `B[:x]` with `p` as the delimiter to make the arithmetic expression
- Use `eval` to get the actual result
- Don't forget to update `B` to exclude the first `x+1` elements for the subsequent iterations

Eventually, I got `[eval(p.join(B[:(x:=B.index(''))])),B:=B[x+1:]][0]` as desired.

The bottleneck when doing part 2 is realizing you shouldn't trim the whitespaces too early from `X`. You can only do that once you have transposed the raw input.

## Day 7 - 183 bytes

<div class="aocgolf">

```python
L,*M=open(0);Q={L.index('S'):1};print('Part 1:',sum([[T:={},sum([x:=r[k]>'S',T:=T|{v:T.get(v,0)+Q[k]for v in(k-x,k+x)}][0]for k in Q),Q:=T][1]for r in M]),'\nPart 2:',sum(Q.values()))
```

</div>

Credits to [mug1wara26](https://github.com/mug1wara26) for the idea of not building the graph for topological sort and work directly on each row instead.

The main idea here is to "build" the graph. You can use BFS for part 1 and then keep track of how many distinct `^`s that you encounter.

For part 2, I had to think twice. Is this DP? Is this topological sort by building the DAG?

Turns out, by assuming a few things (which is still true for all inputs I have encountered), one can allow some shortcuts:

- The `S` is always at the first row, meaning I can split `open(0)` to `L` (first row) and `M` (the rest) beforehand, and allow iterating through `M` without having to `M[0]` for the first row
- The `^`s will never be at the first or last columns, meaning if it's at column `k`, going to `k-1` or `k+1` will still put you in a valid column
- There are no two `^`s on top of each other, meaning if cell `(r, c)` is a `^`, instead of splitting to `(r, c-1)` and `(r, c+1)`, I can directly go to `(r+1, c-1)` and `(r+1, c+1)`
- For the normal `.`s (or `S`), you still go from `(r, c)` to `(r+1, c)`
- There is no `^` at the last row, meaning we can safely assume the answer is correct without any ambiguous splits when finished iterating through the last row

Since both cases always shift you one row ahead, we can already see the resemblance of the implicit graph to a DAG. If we work on a row at a time, we can dynamically store the number of paths going through that column (as well as the number of `^`s encountered for part 1).

Suppose we start with the example input (truncated to a few rows). Since the index of `S` on the first row is `7`, I can start my DP "table" with `{7: 1 path}`.

```text
0123456789 (column number for your reference)
.......S....... 1st
............... 2nd
.......^....... 3rd
............... 4th
......^.^...... 5th
............... 6th
.....^.^.^..... 7th
............... 8th
```

Next, when you propagate to 2nd and 3rd row, you will still have `{7: 1 path}`, but when you go to the fourth row, you will encounter a `^`, and so the table will be updated to `{6: 1 path, 8: 1 path}`, but you have also kept track of having encountered a single `^`.

Same table is produced when going to the 5th row, but on the 6th row, you will have to split the one path from column 6 to columns 5 and 7, the one from column 8 to columns 7 and 9. Therefore, we have `{5: 1 path, 7: 2 paths, 9: 1 path}` and three `^`s encountered. These three `^`s will not be found anymore in the subsequent iterations, we can keep adding the numbers without having to check if they are distinct or not. (They will always be distinct!)

This process goes on until the final row. In the end, we have kept track the number of `^`s encountered to answer part 1, and the table contains the number of paths going from `S` all the way down to the last row and the respective columns, which is why the answer to part 2 is just `sum(Q.values())`.

Initially, I used `collections.Counter` to represent the number of paths that cross through each column for a given row, and then bulk update the counter every row processed. Below was my attempt on this version with 206 bytes.

<div class="aocgolf">

```python
from collections import*;H=Counter;L,*M=open(0);Q=H([L.index('S')]);print('Part 1:',sum([[T:=H(),sum([x:=r[k]>'S',T:=T+H({k-x:Q[k],k+x:Q[k]})][0]for k in Q),Q:=T][1]for r in M]),'\nPart 2:',sum(Q.values()))
```

</div>

Using `dict.update` or `dict.__setitem__` is commonly used when updating a dictionary entry because you can't do a basic assignment without `exec` (which is not allowed), so something like `D[k]=v` won't happen. In exchange, you can do either `D.__setitem__(k,v)` (equivalently `dict.__setitem__(D, k,v)`) or `D.update({k:v})` (equivalently `dict.update(D,{k:v})`).

However, the `update` on `Counter`s work differently: **they add instead of replace**. This means instead of doing `C.update({k:C[k]+v})` for some `Counter` object `C`, I just need `C.update({k:v})`.

After using `update`, I realized that **you can also add two `Counter`s**, so instead of `C.update({k:v})` on every iteration, I can just `C:=C+Counter({k:v})`, and this might be shorter if you have assigned `Counter` to some one-letter variable like I did above.

This discovery seems like it's to my advantage, until I realized **I can combine the choices between going to `c` or `(c+1, c-1)` into a single dictionary**. Note that if `x` represents whether the processed cell is a `^` or not (`1` for yes, `0` for no), we can represent the dictionary as `{k-x:v, k+x:v}` instead of `[{k:v},{k-1:v, 1:v}][x]`. This is where the normal dictionary version starts to become the shorter code.

While using normal dictionaries requires you to use `T.get(v,0)` in case `v` is not present in the current "table", using `Counter` requires `from collections import Counter;H=Counter`. If you've had to use two or more `T.get(v,0)`s, the `Counter` version would've been shorter.

The cherry on top would be the fact that you don't even need `T.update` for the normal dictionary method. Since the updatings are already one element of a list, you can use the `|` operator (in tandem with the walrus `:=` operator), which basically does bulk updating as well. For example,

```python
>>> {'a': 3, 'b': 4} | {'a': 0, 'c': 5}
{'a': 0, 'b': 4, 'c': 5}
```

## Day 8 - 355 bytes

<div class="aocgolf">

```python
R=range(len(P:=[[*map(int,l.split(','))]for l in open(0)]));T=z=[1<<i for i in R];Q=[[U:=T[a]|T[b],[T.__setitem__(u,U)for u in R if(1<<u)&U],z:={*T},S:=P[a][0]*P[b][0]][2]for _,a,b in sorted((sum((a-b)**2for a,b in zip(P[i],P[j])),i,j)for i in R for j in range(i))if~-len(z)];*_,a,b,c=sorted(map(int.bit_count,Q[999]));print('Part 1:',a*b*c,'\nPart 2:',S)
```

</div>

Originally, this is supposed to be a Kruskal's minimum spanning tree (MST) problem: you create the edge list by finding the all-pairs distance, sort these edges, and then use UFDS to connect the vertices until all vertices are connected. For part 1, you print the UFDS states in the 1000th iteration, while for part 2, you find the last edge that gets added into the MST.

Golfing UFDS will definitely take a lot of characters, so one can resort to just linearly merging: suppose I want to merge `setA` with `setB`, then I will update the set that every element in `setA|setB` belongs to into the same `setA|setB`. This is definitely a suboptimal version of UFDS, but more intuitive and shorter to code.

Alternatively, I could've used `heapq` to extract the smallest edges over and over because all points should be connected to each other early enough (in my case, about $5000$ iterations). You don't have to sort the entire edge list, but only build the heap in linear time and pop a few of them.

Surprisingly, despite not using any priority queues or using the optimal way of merging the sets in UFDS, the code above still runs in only **about 2-2.5 seconds**!

Previously, my variable `T` stores a mapping of `vertex_id: set_containing_vertex_id`, and ensure that for two vertices belonging to the same set, the mapped set must be the same object (same memory address). This is so that for part 1, when getting the product of top 3 sizes, I won't double-count the sets.

For example, with only 4 elements. My "UFDS" can look something like this.

```python
T = [{0,1,3}, {0,1,3}, {2}, {0,1,3}]
```

The `{0,1,3}` in the example above are guaranteed to point to the same memory address, so `{*map(id, T)}` will have a length of `2`. Then, after merging 1 and 2, `T` will be updated to look as follows.

```python
T = [{0,1,2,3}, {0,1,2,3}, {0,1,2,3}, {0,1,2,3}]
assert len({*map(*id, T)}) == 1
```

Part 2 is rather straightforward by cutting the iteration when there is only one distinct memory address (you can use `id(z)` to get the memory address of `z`), and then output the product of the $x$-coordinates accordingly.

I thought of a better idea: **store the sets using bitmasks**! This means instead of storing `{a, b, c}`, I store `2**a + 2**b + 2**c`, and the `|` operation will still be relevant due to how the bit-OR operation works. Then, when doing the linear merging between `bitA` and `bitB`, I had to go through all vertices from `0` to `N-1`, but only work at the positions of the 1-bits of `bitA|bitB`. This is because you can't directly iterate through the position of the 1-bits without having to store this information somewhere else, which takes more characters.

Using the same example above, the one with only 4 elements, my "UFDS" will now look something like this.

```python
T = [11, 11, 4, 11]
assert len({*T}) == 2

T = [15, 15, 15, 15] # after merging 1 and 2
assert len({*T}) == 1
```

Now, I don't have to worry about the memory address -- **their values can already be used as an identifier**!

The bitmask approach indeed shortens the code, even when you need to take more characters for the final step of part 1: using `int.bit_count` to find the size of the "set" by looking at the number of 1-bits. This is only available in Python 3.10 or later, which shouldn't be a big problem since we are already so ahead of Python 3.10.

The next subtle-but-significant part is the reason why the code runs in only about 2-2.5 seconds despite the edge list being of length $C_2^{|V|} = C_2^{1000} = 499500$. Since I want to store the UFDS states inside `Q`, I need to store a copy of the list of sets like `{*T}` every iteration. I have to put that within the inner comprehension of the elements of `Q`, but at the same time I also want to stop "computing" if the length of this set is already equal to 1.

If there's any linear computation on the `if` clause like `if len({*T})>1`, this will be done in all $499500$ iterations, even when the true size of `T` is already 1 since the first few thousand iterations. As a result, this will make the code extremely slow, even beyond a minute of runtime. Instead, keeping the check at `len(z)` should be fine since it's a $O(1)$ operation.

I observed that the graph gets fully-connected in only about $5000$ iterations (your inputs might have different termination points), meaning having suboptimal UFDS or not using priority queues should not matter because they will be dominated by the time taken to create the edge list and sort the whole list, which means I made the right call of using linear merging and just sorting the edge list as is, as long as I don't do unnecessary things beyond the first $5000$ iterations.

One small thing remains in the handling of the value of `z` that I constantly assigned to `{*T}`. The first computation of `z:={*T}` happens after I check `~-len(z)` in the `if` clause, meaning I must already have an initial value, a dummy value, that is an iterable so that `len(z)` won't return an error. It suffices to assign `z` to any iterable defined earlier, like `T` or `P`.

I didn't forget to experiment between using `R=range` or `R=range(N)`. Sometimes the occurences of `range` in the code can affect which method is to be used, whether that number is above or below the break-even point.

## Day 9 - 606 bytes

<div class="aocgolf">

```python
R=range(len(P:=[[*map(int,l.split(','))]for l in open(0)]));D=abs;J=complex;C=lambda p:sum(I(*p,p[0]+1e6,p[1]+6e7,*P[i],*P[i-1])for i in R)%2or any(D(J(*P[i])-J(*p))+D(J(*p)-J(*P[i-1]))==D(J(*P[i])-J(*P[i-1]))for i in R);I=lambda a,b,c,d,e,f,g,h:((c-a)*(f-b)-(d-b)*(e-a))*((c-a)*(h-b)-(d-b)*(g-a))<0>((g-e)*(b-f)-(h-f)*(a-e))*((g-e)*(d-f)-(h-f)*(c-e));Z=sorted((~D(c-a)*-~D(d-b),a,b,c,d)for a,b in P for c,d in P);print('Part 1:',-Z[0][0],'\nPart 2:',next(-w for w,a,b,c,d in Z if[K:=[(a,b),(a,d),(c,d),(c,b)],z:=all(map(C,K)),[z:=z*~-I(*K[k],*K[k-1],*P[i],*P[i-1])for i in R for k in(0,1,2,3)if z],z][3]))
```

</div>

Such a bad run today, with the code running in about 2-3 minutes. On top of having to golf ray tracing to check if a point is inside a polygon and check for any intersection between two segments, you have to deal with how slow this code will be if you didn't realize that the input assumes a particular shape (if you know, you know, \*coughs in closed-mouth Pac-Man\*). Therefore, I partially decided to not assume the shape of the input (meaning it should work on most rectilinear polygons).

While the above code was not my historically shortest attempt, it strikes a very good balance between the runtime and the code length itself, the usage of `next` and `sorted` already hints how I really really needed to short-circuit most of the $O(n)$ checks.

I think the golfed code can be divided to a few main parts.

First, **the ray casting algorithm in `C`**. Initially, I had a different algorithm to check if a point is in a polygon as shown [here](https://github.com/RussellDash332/pytils/blob/main/compgeo_2d_point_in_polygon.py). But, this version is more complex to code, so instead I reverted to the basic ray casting: create a sufficienly long ray emitting from the query point $p$, then check for all edges in the polygon if it intersects or not. To deal with the edge case of the point being within a polygon edge (because the usual ray casting will have false results), we check if the distance between the endpoints of an edge is equal to the sum of the distance between this point to each of the endpoints. This can be done by treating the points as complex numbers, and then using `abs`, we can easily get the modulus that acts as the vector norm.

Next, **the intersection check `I`**. I decided to not include the case when both segments coincide because that will incur some false results as well (consider the rectangle coinciding with the polygon). The initial code for this was found [here](https://github.com/RussellDash332/pytils/blob/main/compgeo_2d_intersect.py), but I'll put it below as well.

```python
def intersect_check(s1, s2):
    (p1, p2), (p3, p4) = s1, s2; (x1, y1), (x2, y2), (x3, y3), (x4, y4) = p1, p2, p3, p4
    c1 = (x2-x1)*(y3-y1)-(y2-y1)*(x3-x1); c2 = (x2-x1)*(y4-y1)-(y2-y1)*(x4-x1)
    if (c1 < -1e-9 and c2 < -1e-9) or (c1 > 1e-9 and c2 > 1e-9): return 0
    c1 = (x4-x3)*(y1-y3)-(y4-y3)*(x1-x3); c2 = (x4-x3)*(y2-y3)-(y4-y3)*(x2-x3)
    if (c1 < -1e-9 and c2 < -1e-9) or (c1 > 1e-9 and c2 > 1e-9): return 0
    return 1
```

Workarounds involve early variable unpacking and flipping the logic inside the code: ignoring the floating point error, I need `c1*c2` to be negative **and** the next `c1*c2` to also be negative in order for it to return 1.

Finally, **dealing with all-pairs `Z` somewhat optimally**. Of course, you have to make use of the $O(n^2)$ pairs of points and see which one is the best, but does it make sense to run through all pairs and only then conclude the maximum? Why not sorting the areas first and return the area of the first feasible rectangle, because that's exactly what I did? The area of a rectangle given the corners $(a, b)$ and $(c, d)$ is supposed to be $(|c-a|+1)(|d-b|+1)$. As a fancy person I am, I'll use the `-~x == x+1` trick because that will save me two pairs of brackets, thus the `~D(c-a)*-~D(d-b)` part.

I know **this isn't fully generalizable**, but given a rectangle defined by the corners, my logic would be: checking if all 4 vertices are within the polygon, and then check if any of the four segments has a single point of intersection with any of the polygon edges. As a matter of fact, this logic isn't enough for some U-shaped rectilinear polygons, or those with dents or holes, as well for those with two adjacent edges (e.g. `(13, 9)` to `(15, 9)` VS `(13, 10)` to `(17, 10)` are two edges being next to each other). #valianteffort ?

Note that `next`, `all`, and `any` are short-circuited, meaning once the result is clear, it will return directly without computing the subsequent terms. That is why using `next(... for w,a,b,c,d in Z ...)` will stop computing on the next `w,a,b,c,d` term if we already found one that satisfies the constraint. The same goes for the use of `any` in `C` and `all` in `all(map(C,K))`.

One more subtle difference worth mentioning is how I ended up with separating the `C` checks for `K` as shown in `z:=all(map(C,K))` with the `I` checks between each polygon edge and each rectangle segment defined in `K`. If I combined them, I would end up like this.

```python
# original version
if[K:=[(a,b),(a,d),(c,d),(c,b)],z:=all(map(C,K)),[z:=z*~-I(*K[k],*K[k-1],*P[i],*P[i-1])for i in R for k in(0,1,2,3)if z],z][3]
# what if...?
if(K:=[(a,b),(a,d),(c,d),(c,b)])and all(C(K[k])*~-I(*K[k],*K[k-1],*P[i],*P[i-1])for i in R for k in(0,1,2,3))
# or maybe...?
if(K:=[(a,b),(a,d),(c,d),(c,b)])and all(~-I(*K[k],*K[k-1],*P[i],*P[i-1])for i in R for k in(0,1,2,3)if C(K[k]))
```

However, both version have serious issues.

- The "what-if" version is extremely slower because you will have to recompute `C(K[k])` over and over for every edge in the polygon (`for i in R`)
- The "or-maybe" version might give you false results if `C(K[k])` is `False`. While we won't have the issue `all([]) == True` (because at least 2 of the points will satisfy `C(K[k]) == True`), note that doing `if C(K[k])` actually ignores the possible `~-I(...)` calls being `False` at this stage. So, if my final list is (let's say) `[(True, True), (False, False), (True, True), (True, False)]` for the respective `k in (0,1,2,3)`, I should reject this entry because not all of them are `True`, but when `k == 1` and `k == 3`, if `C(K[k]) == False` it actually ignores the checking on `(False, False)` and `(True, False)`. Therefore, Python thinks you're only checking on `[(True, True), (True, True)]` and let this through.

In the end, I decided to not assume less or more things and kept the state of the logic as is because look, it's time to do the Day 10 puzzle! (last seconds before disaster)

## Day 10 - 1569 bytes

<div class="aocgolf">

```python
g=lambda A:[P:=lambda r,s:[k:=1/D[r][s],[j!=s!=F(D[i],j,D[i][j]-D[r][j]*D[i][s]*k)for i in R(m+2)if i-r for j in R(N+2)],[F(D[r],i,D[r][i]*k)for i in R(N+2)],[F(D[i],s,D[i][s]*-k)for i in R(m+2)],F(D[r],s,k),t:=C[r],F(C,r,Y[s]),F(Y,s,t)],W:=lambda p:-1if-E<D[m+p][s:=M((i for i in R(N+1)if p or~Y[i]),key=lambda x:(D[m+p][x],Y[x]))]else 0if(r:=M([i for i in R(m)if D[i][s]>E]or[-1],key=lambda x:(D[x][-1]/D[x][s],C[x])))==-1else P(r,s)and W(p),m:=len(A),Y:=[*R(N),-1],C:=[*R(N,N+m)],D:=[*([*a[:-1],-1,a[-1]]for a in A),[1]*N+[0]*2,[*[0]*N,1,0]],X:=(I,0)if-E>D[r:=M(R(m),key=lambda x:D[x][-1])][-1]and(P(r,N)and~W(1)or-E>D[-1][-1])else[[~C[i]or P(i,M(R(N),key=lambda x:(D[i][x],Y[x])))for i in R(m)],(I,0)if~W(0)else[x:=[0]*N,[F(x,C[i],D[i][-1])for i in R(m)if C[i]<N],(sum(x),x)][2]][1],x:=X[1],[T:=next(((i,int(x[i]))for i in R(N)if abs(x[i]-round(x[i]))>E),(-1,0)),k:=T[0],v:=T[1],[F(s:=[0]*N+[v],k,1),F(t:=[0]*N+[~v],k,-1),M(g(A+[s]),g(A+[t]))][2]if~k else X[0]][3]if x else I][8];I=1e9;E=1/I;M=min;R=range;F=list.__setitem__;Z=sum([[L:=l.split(),n:=len(c:=eval(f'[{L[-1][1:-1]}]')),q:=[eval(x[:-1]+',)')for x in L[1:-1]],B:=[0]+[-1]*2**n,p:=[sum(1<<i for i in x)for x in q],Q:=[0],[0if~B[k:=u^v]else F(B,k,B[u]+1)!=Q.append(k)for u in Q for v in p],N:=len(p),A:=[-~N*[0]for _ in R(2*n+N)],[F(A[~i],i,-1)!=[F(A[e],i,1)!=F(A[e+n],i,-1)for e in q[i]]for i in R(N)]+[F(A[i],N,c[i])!=F(A[i+n],N,-c[i])for i in R(n)],complex(B[int(L[0][-2:0:-1].replace('#','1').replace('.','0'),2)],round(g(A)))][-1]for l in open(0)]);print('Part 1:',int(Z.real),'\nPart 2:',int(Z.imag))
```

</div>

I did it again: *golfing a niche algorithm from scratch*.

Past records worth flexing:

- [2023 Day 24](https://adventofcode.com/2023/day/24) - [Gaussian elimination](https://github.com/RussellDash332/advent-of-code/blob/main/aoc-2023/basilisk.py#L48) with a bunch of elementary row operations
- [2023 Day 25](https://adventofcode.com/2023/day/25) - [Maximum flow](https://github.com/RussellDash332/advent-of-code/blob/main/aoc-2023/basilisk.py#L50) using Dinic's algorithm
- [2024 Day 23](https://adventofcode.com/2024/day/23) - [Maximum clique](https://github.com/RussellDash332/advent-of-code/blob/main/aoc-2024/basilisk.py#L46) using Bron Kerbosch's algorithm

Anyways, back to the problem.

Part 1 was an easy bitmask BFS where the state transition involves the bit-XOR operation. You parse the buttons as bitmasks, e.g. `(1, 3, 4)` becomes $2^1 + 2^3 + 2^4 = 26$. Pressing a button $v$ given the current state $u$ brings you to state $u \oplus v$. The answer would be the shortest path from 0 to $m$, where $m$ is parsed from the indicator light: `[.#.#]` means only light 1 and 3 is on, so this is state $2^1 + 2^3 = 10$.

Part 2, simply summarizing, is an ILP problem. An **integer linear programming** problem, basically a bunch of inequalities and the constraint that the variables have to be an integer, then we want to minimize/maximize an objective function using the variables. A simple one would be like this.

> An apple costs 5 SGD, and an orange costs 3 SGD. You only have a budget of 80 SGD for the day. What's the maximum number of fruits that you can buy today?

We can model the problem using two variables $x$ and $y$ for the number of apples and oranges bought.

$$
\begin{align*}
5x+3y &\le 80 \\
x &\ge 0 \\
y &\ge 0 \\
\text{Maximize } f(x+y)
\end{align*}
$$

Without the integer constraint, usually [the Simplex algorithm](https://en.wikipedia.org/wiki/Simplex_algorithm) would be able to solve this by treating the constraints as edges of a polygon (or specificially a *polytope*). Otherwise, it would be hard to only consider lattices, or wouldn't it?

Alternatively, if you consider using Gaussian elimination like you've learned back in linear algebra class, you might end up with a homogenous solution (because there's so many variables, but so few equations, allowing so many free variables), and this solution might have negative values (on top of it possibly not being an integer).

While I've seen non-ILP solutions like continuing from the Gaussian elimination solution and do some complete search or DFS, I would like to **instead extend my approach with the Simplex algorithm**.

The original Simplex algorithm can be found [here](https://github.com/RussellDash332/pytils/blob/main/simplex_linear_programming.py), but I'll put it here for accessibility. Yes, I have done it **without using any external library** because I needed this to solve some competitive programming problems on Kattis ([if you're interested](https://open.kattis.com/problems/cheeseifyouplease)) which obviously doesn't allow external libraries like `numpy` or `scipy`, or even the infamous `z3`.

```python
# return values have been modified slightly to include the solution vector
INF = float('inf'); EPS = 1e-5
def simplex(A, C):
    def pivot(r, s):
        k = 1/D[r][s]
        for i in range(m+2):
            if i == r: continue
            for j in range(n+2):
                if j != s: D[i][j] -= D[r][j]*D[i][s]*k
        for i in range(n+2): D[r][i] *= k
        for i in range(m+2): D[i][s] *= -k
        D[r][s] = k; B[r], N[s] = N[s], B[r]
    def find(p):
        while True:
            if D[m+p][s:=min((i for i in range(n+1) if p or N[i] != -1), key=lambda x: (D[m+p][x], N[x]))] > -EPS: return 1
            if (r:=min((i for i in range(m) if D[i][s] > EPS), key=lambda x: (D[x][-1]/D[x][s], B[x]), default=-1)) == -1: return 0
            pivot(r, s)
    m = len(A); n = len(A[0])-1; N = [*range(n), -1]; B = [*range(n, n+m)]; D = [*([*A[i], -1] for i in range(m)), C+[0]*2, [0]*(n+2)]
    for i in range(m): D[i][-2], D[i][-1] = D[i][-1], D[i][-2]
    D[-1][n] = 1; r = min(range(m), key=lambda x: D[x][-1])
    if D[r][-1] < -EPS and (pivot(r, n) or not find(1) or D[-1][-1] < -EPS):
        return -INF, None
    for i in range(m): B[i] == -1 and pivot(i, min(range(n), key=lambda x: (D[i][x], N[x])))
    if find(0):
        x = [0]*n
        for i in range(m):
            if 0 <= B[i] < n: x[B[i]] = D[i][-1]
        return sum(C[i]*x[i] for i in range(n)), x
    else:
        return -INF, None
```

Now, suppose using Simplex, we have found some objective value (minimized, because the problems wants to minimze the button presses), and the value of the solution $x$ that leads to this objective value (how many presses for each button). Note that $x$ might have non-integer values at this moment.

Allow me to introduce you to the **branch-and-bound** algorithm. It makes use of the current objective value $v$ and the respective solution vector $x$, and then **bound the first non-integer value** in $x$, say $x_k = e$, by $\left \lfloor e \right \rfloor$, to work on two cases:

- re-run Simplex on the original constraints, plus add the constraint $x_k \le \left \lfloor e \right \rfloor$
- re-run Simplex on the original constraints, plus add the constraint $x_k > \left \lfloor e \right \rfloor$, or equivalently $-x_k \le -\left \lfloor e \right \rfloor -1$

Recurse on both new constraint lists, and update the best objective value found within each recursive call. Early termination include having no need to recurse if the current solution is infeasible, or if all values in the solution vector are already integers. A simple Python implementation would look like this.

```python
INF = float('inf'); EPS = 1e-5
def f(A):
    n = len(A[0])-1
    bval = float('inf')
    def branch(A):
        nonlocal bval

        val, x = simplex(A, [1]*n)
        if val+EPS >= bval or val == -INF:
            return

        # k = index of the first non-integer value
        k, v = next(((i, int(e)) for i,e in enumerate(x) if abs(e-round(e))>EPS), (-1, 0))
        if k == -1:
            if val+EPS < bval: # found a better solution
                bval = val
        else:
            s = [0]*n+[v]; s[k] = 1
            branch(A+[s]) # <= v
            s = [0]*n+[~v]; s[k] = -1
            branch(A+[s]) # > v
    branch(A)
    return round(bval)
```

With this ILP solver in hand, we can proceed to combine all the puzzle pieces into one. The individual results from part 1 and part 2 are packed into a single complex number $p_1 + p_2i$, and then we simply sum them all into $Z$. The answer to part 1 is just $\Re(Z) = \sum p_1$ and the answer to part 2 is just $\Im(Z) = \sum p_2$.

The golfed code is basically in this given structure. If you want to uncover more, start by matching the brackets accordingly and then decompose them line-by-line. I decided to pack the Simplex algorithm further in by ensuring there are less clashing variable names and assume that the objective value is indeed the sum function so `[1]*n` need not be used anymore. This is why you see almost every lowercase letter and uppercase letter being used as a variable name.

```text
g = lambda A:[
    run simplex(A),
    run branch and bound given A, the objective value, and the solution vector
    return best solution
][-1]

define some one-letter shortcuts, like setting eps=1e-9 and inf=1e9 so we can have I=1e9;E=1/I

Z=sum([
    [
        parse the indicator lights [#..#] -> end_state
        parse the button presses: keep one version using lists of integer tuples, another version using lists of bitmask integers
        parse joltage requirements by dealing with the curly braces
        setup augmented matrix A for the ILP constraints
        p1 = BFS(0 to end_state)
        p2 = round(g(A))
        return complex(p1, p2)
    ][-1]for l in open(0)
])

print('Part 1:',int(Z.real),'\nPart 2:',int(Z.imag))
```

Let's use the first line of the example input to visualize what we're dealing with here.

```
[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
```

- The `[.##.]` is parsed into `end_state = 6`.
- The buttons are normally processed as `[[3], [1, 3], [2], [2, 3], [0, 2], [0, 1]]` for part 2, but for part 1 we use the bitmask version `[8, 10, 4, 12, 5, 3]`.
- Joltage requirements are simply parsed as `[3, 5, 4, 7]`.
- For part 1, starting state is `0`, and pressing the last two buttons is equivalently bringing you to state `0^5^3 == 6`, which is the end state (the minimum button presses is indeed $2$).
- For part 2, the constraint matrix A is defined as shown below. Since we can't represent $\sum_i c_ix_i = C$ as is, we use both $\sum_i c_ix_i \le C$ and $\sum_i c_ix_i \ge C$ (or equivalently $\sum_i (-c_i)x_i \le -C$), where $x_i$ is the number of presses on button $i$ ($0$-indexed), and $c_i$ is either $0$ or $1$. The constraints $b_i$ are for button $i$, and $d_i$ is to specify that your solution $x_i$ cannot be negative. The $d_i$ constraints are in reversed order because I was using `A[~i]` instead of `A[2*num_buttons+i]`, which takes more characters. Once you run the branch-and-bound ILP on $A$, you'll get $10$ as the optimal solution (as shown in the puzzle as well). Therefore, we store $2+10i$ as our final result for this iteration.

    $$
    A =
    \begin{pmatrix}
    0 & 0 & 0 & 0 & 1 & 1 & 3 \\
    0 & 1 & 0 & 0 & 0 & 1 & 5 \\
    0 & 0 & 1 & 1 & 1 & 0 & 4 \\
    1 & 1 & 0 & 1 & 0 & 0 & 7 \\
    0 & 0 & 0 & 0 & -1 & -1 & -3 \\
    0 & -1 & 0 & 0 & 0 & -1 & -5 \\
    0 & 0 & -1 & -1 & -1 & 0 & -4 \\
    -1 & -1 & 0 & -1 & 0 & 0 & -7 \\
    0 & 0 & 0 & 0 & 0 & -1 & 0 \\
    0 & 0 & 0 & 0 & -1 & 0 & 0 \\
    0 & 0 & 0 & -1 & 0 & 0 & 0 \\
    0 & 0 & -1 & 0 & 0 & 0 & 0 \\
    0 & -1 & 0 & 0 & 0 & 0 & 0 \\
    -1 & 0 & 0 & 0 & 0 & 0 & 0
    \end{pmatrix}
    \Rightarrow
    \begin{pmatrix}
    {b_0}^-: & x_4 + x_5 \le 3 \\
    {b_1}^-: & x_1 + x_5 \le 5 \\
    {b_2}^-: & x_2 + x_3 + x_4 \le 4 \\
    {b_3}^-: & x_0 + x_1 + x_3 \le 7 \\
    {b_0}^+: & x_4 + x_5 \ge 3 \\
    {b_1}^+: & x_1 + x_5 \ge 5 \\
    {b_2}^+: & x_2 + x_3 + x_4 \ge 4 \\
    {b_3}^+: & x_0 + x_1 + x_3 \ge 7 \\
    d_5: & x_5 \ge 0 \\
    d_4: & x_4 \ge 0 \\
    d_3: & x_3 \ge 0 \\
    d_2: & x_2 \ge 0 \\
    d_1: & x_1 \ge 0 \\
    d_0: & x_0 \ge 0
    \end{pmatrix}
    $$

I wouldn't bother you further with the very minor details, but the complex number trick and the usage of `list.__setitem__` because there's so many list assignments are the main takeaways, in my opinion.

Surprisingly, the code runs fast enough to my liking, which is about 10 seconds because I removed some early terminations in the branch-and-bound algorithm.

## Day 11 - 192 bytes

<div class="aocgolf">

```python
from functools import*;z=cache(lambda x,t,g={l[:3]:l[4:].split()for l in open(0)}:sum(z(v,t+(x in'dac fft'))for v in g[x])if x in g else t>1);print('Part 1:',z('you',2),'\nPart 2:',z('svr',0))
```

</div>

Finally, a well-deserved break, with both normal and golfed codes solving both parts in a blink of an eye!

Credits to [woojiahao](https://github.com/woojiahao) for the idea of using simple recursion instead of topological sort + DP and [Salatmate](https://github.com/Salatmate) for the further refinement of the golf by removing the bitmask part.

For part 1, knowing that the graph is directed and acyclic, we can run the following recursion.

```text
paths(node)
    1 if (node=='out')
    sum(paths(child) for child in graph[node]) otherwise
```

However, for part 2, you need to keep track of whether you have passed `dac` and `fft`, so something like this.

```text
paths(node, dac_passed, fft_passed)
    (dac_passed and fft_passed) if (node=='out')
    sum(paths(child, dac_passed | (node=='dac'), fft_passed | (node=='fft')) for child in graph[node]) otherwise
```

Instinctively, I would use a bitmask to compress both `dac_passed` and `fft_passed`, so something like

```text
paths(node, bitmask)
    (bitmask==3) if (node=='out')
    sum(paths(child, bitmask | (node=='dac') | 2*(node=='fft')) for child in graph[node]) otherwise
```

Can we combine parts 1 and 2? The answer is yes, because in part 1, you can "assume" that `dac` and `fft` have been visited. So, when you start from `you`, the bitmask has already been set to `3`, while on part 2 as you start from `svr` you have to set the initial bitmask to `0` because they are factually yet to be visited.

Having taken care of the graph parsing, I ended up with this version (semicolons converted to newlines for readability).

```python
# Again, not the finalized version!
z=cache(lambda x,t:t>2if x=='out'else sum(z(v,t|(x=='dac')|2*(x=='fft'))for v in g[x]))
g={k[:-1]:l for k,*l in map(str.split,open(0))}
print('Part 1:',z('you',3),'\nPart 2:',z('svr',0))
```

Just as I was about to return to my *work* work, Salatmate pointed out a few things:

- If you have passed `dac` before, you will never go back to `dac`. Same thing for `fft`. This means, you can just use integer additions instead of bitmask: `x in 'dac' or x in 'fft'`, which then got shortened to `x in 'dac fft'`. The extra space is just in case of the vertices `acf` or `cff` being present.
- `str.split` is not a must-use, you can use just `l` for a single line, and then use `l[:3]` and `l[4:]` to separate the `:` off.
- `g` can be defined as a default parameter of the function `z`.

And then I also pointed out that `g` has only one vertex with zero outdegree: `out`. This means, instead of `x=='out'`, we can flip the logic and use `x in g` for the recursive case. Combining all of these ideas results in the finalized code at the beginning.

## Day 12 - 161 bytes

<div class="aocgolf">

```python
import re;O=[*open(0)][::-1];print('Part 1:',sum((K:=[*map(int,re.findall('\d+',i))])and K[0]*K[1]>=9*sum(K[2:])for i in O[:O.index('\n')]),'\nPart 2: THE END!')
```

</div>

> Last day best day? (this question was written on Day 11)

Somewhat true. It's naturally hard but it's such a troll question that it's beyond easy. Well played to Eric indeed.

The input assumes that the presents are always a 3x3 grid, and there's only two cases for the packing of the presents:

- the total area of the presents' bounding boxes exceeds the region area by a large margin
- the presents can be packed within each individual 3x3 region

That's it, there's nothing in between!

Similar to Day 11, the golfed code will solve our input files, but not the example input itself, which is sometimes intended. Also, you don't have to even care to parse the presents -- just parse the regions directly! That's why I reverse the input lines, and then cut until the first occurence of the newline `\n`.

Regex is shorter to parse all the numbers in the form `RxC: q1 q2 ... qn` because you can just use `re.findall`. Here's the comparison with the non-regex approach. Huge difference, innit?

```python
# regex
import re;[*map(int,re.findall('\d+',i))]
# non-regex
[*map(int,i[:(t:=i.find(':'))].split('x')+i[t+1:].split())]
```

The fact that the presents can be packed within each individual 3x3 region means that I can simply check if `(K[0]//3)*(K[1]//3)>=sum(K[2:])`, but apparently not having to divide the dimensions by 3 also works just fine: `K[0]*K[1]>=9*sum(K[2:])`. This is because

$$
\begin{align*}
\left\lfloor\frac{K[0]}{3}\right\rfloor\cdot\left\lfloor\frac{K[1]}{3}\right\rfloor &\ge \sum K[2:] \\
K[0] \cdot K[1] \ge 3 \left\lfloor\frac{K[0]}{3}\right\rfloor\cdot 3 \left\lfloor\frac{K[1]}{3}\right\rfloor & \ge 9 \sum K[2:].
\end{align*}
$$

You might realize that this is a one-sided implication, so we could falsely classify an exceeding-area case as feasible, like so.

$$
\begin{align*}
\left\lfloor\frac{K[0]}{3}\right\rfloor\cdot\left\lfloor\frac{K[1]}{3}\right\rfloor &< \sum K[2:] \\
K[0] \cdot K[1] \ge 3 \left\lfloor\frac{K[0]}{3}\right\rfloor\cdot 3 \left\lfloor\frac{K[1]}{3}\right\rfloor & < 9 \sum K[2:] \\
\end{align*}
$$

It's logically inconclusive to determine whether $K[0] \cdot K[1] < 9 \sum K[2:]$ or $K[0] \cdot K[1] \ge 9 \sum K[2:]$. However, Eric in his trolling era has made sure that the case

$$
3 \left\lfloor\frac{K[0]}{3}\right\rfloor\cdot 3 \left\lfloor\frac{K[1]}{3}\right\rfloor < 9 \sum K[2:] \le K[0] \cdot K[1]
$$

will never happen! (check it yourself, the value $9 \sum K[2:] - K[0] \cdot K[1]$ in this case is always so big)

Finally, to end all things off, we end part 2 for today by printing `THE END!`. See you in Advent of Code 2026 :)