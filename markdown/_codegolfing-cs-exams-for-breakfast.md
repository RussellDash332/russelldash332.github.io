# Codegolfing CS Exams for Breakfast
1 February 2026

[tag]: python, code-golf

Let's just say this is an old habit that dies hard and therefore worth another write-up.

As of the moment of writing, NUS CS1010A (then CS1010S) practical exams always come in 4 questions of the following format:

1. **Question 1**: Recursion or iteration - no O(1) closed-form formula allowed, you need to use either recursion, iteration, or mix of both
2. **Question 2A**: Working with CSV files to answer a query that can be solved in a linear pass, e.g. how many entries satisfy a given criteria
3. **Question 2B**: Working with CSV files to provide a top-K list of some metric, e.g. top 5 average grouped by a specific column
4. **Question 3**: Object-oriented programming - design one or more classes to simulate stuff

> The current CS1010S might have a different question format by now, but the same strategies that I'll be explaining also apply.

And every time, I will always to try to solve these questions with as few characters as possible, on top of minimizing the number of lines of code used. Isn't that a nice side quest?

For this month's write-up, I will cover different codegolfing strategies for each question, which you might have not known before.

## Question 1

It is almost always better to use recursion when golfing this kind of question. Let's use the vanilla Fibonacci as an example.

```python
def fib(n):
    if n < 2: return 1
    return fib(n-1)+fib(n-2)
```

We then convert into a lambda function like such. Note that lambda functions are always shorter than functions defined with `def`.

```python
fib=lambda n:1 if n<2 else fib(n-1)+fib(n-2)
```

We can remove the spaces before `if`/`and`/`or`/`else` if the previous thing is a number, like `0.1if`, but **not after**, like `else 1.3`. However, you can remove the space after if the following is a dash, bracket, or tilde, such as `else-1.2`, `if(x+1)**.5` and `or~3`. Note that this may trigger syntax warnings when run locally with Python 3.11 and above.

```python
fib=lambda n:1if n<2else fib(n-1)+fib(n-2)
```

Finally, we can save a few characters yet again by renaming the function to something else, yet still maintaining the name of the original function to define.

```python
fib=f=lambda n:1if n<2else f(n-1)+f(n-2)
```

Note that using lists won't work because Python will have to compute all the entries of the list beforehand.

```python
fib=f=lambda n:[f(n-1)+f(n-2),1][n<2] # doesn't work!
```

Another one is the use of the `~` symbol on integers, which means bit inversion, but also equivalently `~x == -x-1`. You can play around with this like the following three examples to redefine `x-1` and `x+1` and save some brackets.

```python
x=sum(i for i in range(n))
x=n*(n-1)//2
x=n*~-n//2

x=(n-1)*a+(n+1)*b
x=~-n*a+-~n*b

from math import*;x=ceil(a/b)
x=(a+b-1)//b
x=~-a//b+1
```
 
## Question 2A

Normally, you would do something like this (or you would be taught as such). Note that the function `read_csv` has been defined for you: takes in a CSV filename, and then converts it into **a list of list of strings** of the corresponding content.

```python
def find_something(csv_filename, group):
    r = read_csv(csv_filename)[1:] # trim header row
    ans = 0
    for row in r:
        if row[3] == group and int(row[4]) > ...:
            ans += int(row[5])
    return ans
```

You can combine the entire `for` loop and the conditional checks as a aggregate comprehension.

<div class="aocgolf">

```python
def find_something(csv_filename, group):
    return sum(int(row[5]) for row in read_csv(csv_filename)[1:] if row[3]==group and int(row[4])>...)
```

</div>

Almost everytime, multiple boolean checks can be combined into one, especially when the value types are different. Another example when all of them are numbers is `a>1<b` to check for both `a` and `b` being larger than 1.

<div class="aocgolf">

```python
def find_something(f,g):
    return sum(int(r[5]) for r in read_csv(f)[1:] if r[3]==g!=int(r[4])>...)
```

</div>

Finally, we can cut down the unnecessary spaces and convert this into a one-line lambda function. There are two alternatives for what I think is the shortest code for this example.

<div class="aocgolf">

```python
find_something=lambda f,g:sum(int(r[5])for r in read_csv(f)[1:]if r[3]==g!=int(r[4])>...)
find_something=lambda f,g:sum(int(r[5])*(r[3]==g!=int(r[4])>...)for r in read_csv(f)[1:])
find_something=lambda f,g:sum(int(u)*(s==g!=int(t)>...)for p,q,r,s,t,u in read_csv(f)[1:])
```

</div>

The third one involves the sequence unpacking strategy, though it makes the code longer for this example, but for fewer columns it should be the better approach.

## Question 2B
Top k! Using the same CSV file, we will have to usually aggregate the data into a grouped data structure, and then do some sorting with it. The code will usually go something like this.

```python
def top_k_stuff(csv_filename, group, k):
    r = read_csv(csv_filename)[1:] # trim header row
    grouped = {}
    for row in r:
        if row[3] == group:
            key = row[2]
            if key not in grouped: grouped[key] = []
            grouped[key].append(float(row[5]))

    # suppose I want to top K average (rounded to 2dp) among these groups, from highest to lowest
    for key in grouped:
        grouped[key] = round(sum(grouped[key])/len(grouped[key]), 2)

    # convert into sorted list
    sorted_group = sorted(grouped.items(), key=lambda x: x[1], reverse=True)

    # resolve for ties or big k
    if k >= len(sorted_group):
        return sorted_group
    idx = k
    while idx < len(sorted_group) and sorted_group[idx][1] == sorted_group[k][1]: idx += 1
    return sorted_group[:idx]
```

Alright... where do we start? Maybe by shortening the aggregation to the `grouped` dictionary?

```python
def top_k_stuff(f, g, k):
    grouped = {}
    for row in read_csv(f)[1:]:
        if row[3] == g:
            grouped.update({row[2]:grouped.get(row[2],[])+[float(row[5])]})
    ...
```

Let's use `dict.setdefault` and change `float` to `eval` to save 1 character, maybe add in sequence unpacking as well, if the first few columns or the last few columns aren't used, you can use the `*args` operator.

```python
def top_k_stuff(f, g, k):
    grouped = {}
    for *_,r,s,_,u,*_ in read_csv(f)[1:]:
        if s==g:
            grouped.setdefault(r,[]).append(eval(u))
    ...
```

And now, use the walrus operator to combine the entire part into a single line of code. You can remove the `[1:]` slicing if the conditional check doesn't involve having to convert the header column into a number.

<div class="aocgolf">

```python
def top_k_stuff(f, g, k):
    # alternatively
    [grouped:={},[s!=g or grouped.setdefault(r,[]).append(eval(u))for*_,r,s,_,u,*_ in read_csv(f)]]
    # let's use this instead!
    [grouped:={},[grouped.setdefault(r,[]).append(eval(u))for*_,r,s,_,u,*_ in read_csv(f)if s==g]]
    ...
```

</div>

The next part is to convert the dictionary into the sorted average values as required. Notice how I used `y,v` instead of `for k,v in grouped.items()` because it will clash with the vaue `k` provided in the function signature. The items stored in `sorted_group` will be slightly altered but will be reverted back on the next part, and this is because using `key=lambda` takes more character most of the time.

<div class="aocgolf">

```python
# before
def top_k_stuff(f, g, k):
    ...
    for key in grouped:
        grouped[key] = round(sum(grouped[key])/len(grouped[key]), 2)
    sorted_group = sorted(grouped.items(), key=lambda x: x[1], reverse=True) # (k1, v1), (k2, v2)
    ...

# after
def top_k_stuff(f, g, k):
    ...
    sorted_group = sorted((-round(sum(v)/len(v),2),y)for y,v in grouped.items()) # (-v1, k1), (-v2, k2)
    ...
```

</div>

Finally, dealing with the top-k, the ties, and the big k cases. Note that slicing to index `k` regardless of how big it is will not cause an error, so the idea is to slice to that index, and the last element in this list is either the last element, or the $k$-th element. Then, we do a linear pass to compare every other value with this "last" element.

Due to the previous part changing the format of what's stored in `sorted_group`, we have to address that too.

<div class="aocgolf">

```python
# before
def top_k_stuff(f, g, k):
    ...
    if k >= len(sorted_group):
        return sorted_group
    idx = k
    while idx < len(sorted_group) and sorted_group[idx][1] == sorted_group[k][1]: idx += 1
    return sorted_group[:idx]

# after
def top_k_stuff(f, g, k):
    ...
    return [(b,-a)for a,b in sorted_group if a<=sorted_group[:k][-1][0]]
```

</div>

Remember that `sorted_group` stores a list of $[(-v_1,k_1),(-v_2,k_2),\cdots]$, so `sorted_group[:k][-1][0]` will be the **negative** of the threshold average, which is why the inequality sign is `<=` instead of `>=`.

Combining all three parts will leave us with a much shorter code.

<div class="aocgolf">

```python
def top_k_stuff(f, g, k):
    [grouped:={},[grouped.setdefault(r,[]).append(eval(u))for*_,r,s,_,u,*_ in read_csv(f)if s==g]]
    sorted_group = sorted((-round(sum(v)/len(v),2),y)for y,v in grouped.items())
    return [(b,-a)for a,b in sorted_group if a<=sorted_group[:k][-1][0]]
```

</div>

We can combine all of these things into a single list, and then we can convert it into a lambda function. The index 3 in the end is there because after combining, the list to return is the fourth element.

<div class="aocgolf">

```python
# separated into one element per line for readability
def top_k_stuff(f, g, k):
    return[G:={},
           [G.setdefault(r,[]).append(eval(u))for*_,r,s,_,u,*_ in read_csv(f)if s==g],
           S:=sorted((-round(sum(v)/len(v),2),y)for y,v in grouped.items()),
           [(b,-a)for a,b in S if a<=S[:k][-1][0]]
    ][3]

# final version
top_k_stuff=lambda f,g,k:[G:={},[G.setdefault(r,[]).append(eval(u))for*_,r,s,_,u,*_ in read_csv(f)if s==g],S:=sorted((-round(sum(v)/len(v),2),y)for y,v in grouped.items()),[(b,-a)for a,b in S if a<=S[:k][-1][0]]][3]
```

</div>

## Question 3

My favorite question to explore the shortest alternative on.

While this question will never be done with just a single line of code due to the declaration(s) of the class(es), I find converting the methods into lambda functions interesting yet sacrilegious. Anyways, had to do what I have to do.

Suppose we have a simple class definition like this.

```python
class Code:
    def __init__(self, name):
        self.name = name
        self.golfed = False
    def get_name(self):
        return self.name
    def is_golfed(self):
        return self.golfed
    def golf(self):
        if self.is_golfed():
            return f'{self.get_name()} has been golfed'
        else:
            self.golfed = True
            return f'Time to shorten {self.get_name()}'
```

Starting easy, we shorten all the variable names.

```python
class Code:
    def __init__(s,n):
        s.n=n
        s.g=False
    def get_name(s):
        return s.n
    def is_golfed(s):
        return s.g
    def golf(s):
        if s.is_golfed():
            return f'{s.get_name()} has been golfed'
        else:
            s.g = True
            return f'Time to shorten {s.get_name()}'
```

Convert all getter functions into lambda functions stored as the class attributes.

<div class="aocgolf">

```python
class Code:
    def __init__(s,n):s.n=n;s.g=False;s.get_name=lambda:s.n;s.is_golfed=lambda:s.g
    def golf(s):
        if s.is_golfed():
            return f'{s.get_name()} has been golfed'
        else:
            s.g = True
            return f'Time to shorten {s.get_name()}'
```

</div>

Golfing the `golf` function is the last piece of the puzzle, and we need to set an attribute's value into something else in that function. To do this, there are three ways to do so:

- Leaving it as is, if it happens to be shorter.
- Using `setattr` built-in function.

<div class="aocgolf">

```python
    class Code:
    def __init__(s,n):s.n=n;s.g=False;s.get_name=lambda:s.n;s.is_golfed=lambda:s.g
    def golf(s):
        if s.is_golfed():
            return f'{s.get_name()} has been golfed'
        else:
            setattr(s,'g',True);return f'Time to shorten {s.get_name()}'
```

</div>

- Changing how the attribute is stored, for example: a list. Some setter functions might be affected, so you need to watch out for those, too.

<div class="aocgolf">

```python
class Code:
    def __init__(s,n):s.n=n;s.g=[];s.get_name=lambda:s.n;s.is_golfed=lambda:bool(s.g)
    def golf(s):
        if s.is_golfed():
            return f'{s.get_name()} has been golfed'
        else:
            s.g.append(1);return f'Time to shorten {s.get_name()}'
```

</div>

Assuming we use the latter approach, we can now combine it into a single list, or even convert it into a lambda function and therefore an attribute.

<div class="aocgolf">

```python
class Code:
    def __init__(s,n):s.n=n;s.g=[];s.get_name=lambda:s.n;s.is_golfed=lambda:bool(s.g)
    def golf(s):
        return s.get_name()+' has been golfed'if s.is_golfed()else s.g.append(1)or'Time to shorten '+s.get_name()

# final version
class Code:
 def __init__(s,n):s.n=n;s.g=[];s.get_name=lambda:s.n;s.is_golfed=lambda:bool(s.g);s.golf=lambda:s.get_name()+' has been golfed'if s.is_golfed()else s.g.append(1)or'Time to shorten '+s.get_name()
```

</div>

And there we have it, the entire class in just **two** lines of code! I think this is just the very basic idea of golfing OOP, but certain approaches need to be experimented because they are not always the best alternative, which is why it's hard to nail it within only a few attempts.

> You can find the list of my attempts to golf all of the past CS1010A/S questions [here](https://github.com/RussellDash332/golf).