# Kattis of the Week
4 September 2024

Since I am no longer teaching CS2040 (Data Structures and Algorithms) as an undergraduate teaching assistant in NUS, I thought it would be nice to dump some additional Kattis problems here (initially for my students) that I usually call as KOTW (stands for the article title). Future CS2040 students might find this article useful.

Little warning that these problems are **almost** sorted by difficulty.

### T2: Sorting
<details>
    <summary><a href="https://open.kattis.com/problems/missinggnomes">Missing Gnomes</a></summary>
    Literally the last question of this tutorial (first permutation thingy)
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/height">Height Ordering</a></summary>
    Simulate insertion sort
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/stokigalistor">Messy lists</a></summary>
    Suppose $S$ is the sorted version of $A$, how many values of i such that <code>S[i] != A[i]</code>?
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/pivot">Pivot</a> (hard problem)</summary>
    You probably see this question very often in your VisuAlgo quiz. If an element is a possible pivot, all elements to its left must be smaller and all elements to its right must be larger. To keep track of this, you can use an array to keep track of the minimum/maximum so far as you iterate through array from the right/left direction. This technique is also known as the <b>running min/max</b>
</details>

<br>

### T3: Lists, Stacks, Queues
<details>
    <summary><a href="https://open.kattis.com/problems/circuitmath">Circuit Math</a></summary>
    Now we deal with postfix expressions! Same idea, but instead you can use one stack: if you see an operator, pop the operator and pop the two operands, and push the evaluation result, rinse and repeat
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/bracketsequence">Bracket Sequence</a> (slightly harder)</summary>
    Now we deal with infix expressions! Again same idea, with an extra toggle whether you should add everything or multiply everything. Read tokens until a you see a close bracket
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/findmyfamily">Find my Family</a> (hard but useful)</summary>
    <a href="https://www.youtube.com/watch?v=0fUUD58n6hs">My fellow ex-tutor Eric Leow has provided the entire explanation for you, here we introduce you to a special kind of stack, the monotonic stack!</a>
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/stol">Stol</a></summary>
    <a href="https://www.youtube.com/watch?v=W7RPiQl81Yc">Also a video by Eric</a>
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/bungeebuilder">Bungee Builder</a></summary>
    Now that you've learnt about monotonic stacks, try this out :)
</details>

<br>

### T4: Hashing
<details>
    <summary><a href="https://open.kattis.com/problems/iwannabe">I Wanna Be The Very Best</a></summary>
    Have a hashset that contains top K attacks, top K defense, and top K health. Report the length of the hashset (which should at most $3K$)
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/cd">CD</a></summary>
    Just populate the two sets A and B and report the size of the intersection. You can use a for loop to do this :)
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/variabelnamn">Variable Names</a></summary>
    Have a hashtable of <code>(number: variable_index)</code> and simulate the process until the number reaches $10^4$, if the number isn't taken yet it shouldn't be an existing key inside the hashtable
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/quickscope">Quickscope</a> (fun + hard? combo?)</summary>
    <b>TLDR: stack-of-hashmaps and hashmap-of-stacks</b><br>
    This is quite hard, but gives an idea of a bi-map where you store the mapping for both directions: one map tells which levels of nesting a variable has and one map tells what variables are on a particular nesting level.<br>
    Suppose we have a stack of hashmaps called $S$ and another hashmap called $T$. At any point of time, let $K$ be the hashmap on the top of $S$.<br>
    Our goal is such that for each hashmap in $S$, it stores the variables in the corresponding nesting level and their type as a key-value pair. As for $T$, the keys are the variables and the values are stacks of the nesting levels this variable is currently used.<br>
    <ul>
    <li>If you detect a new level of nesting being added (i.e. detect a <code>"{"</code>), push another empty hashmap to $S$ (this is the new $K$). This ensures that the hashmap on top of the stack refers to the current nesting level you're at</li>
    <li>If you see a <code>DECLARE x y</code>, add $x$ as the key of $K$ and $y$ as the value. If $x$ already exists beforehand as a key in $K$, you know it's a <code>MULTIPLE DECLARATION</code>, print that and terminate the code immediately. Otherwise, you also need to add the nesting level into $T$ accordingly (check if $x$ is already a key in $T$ and then handle the addition accordingly)</li>
    <li>If you see a <code>TYPEOF x</code>, then you know that we can always look at the last element of <code>T[x]</code>, say it's $d$, and report <code>S[d][x]</code> (the stack $S$ must be an arraylist so we can still access $S$ easily) or <code>UNDECLARED</code> if <code>T[x]</code> is empty</li>
    <li>If you detect the end of the nesting (i.e. a <code>"}"</code>), we need to do two things in this order: ensure that you have popped this nesting level from $T$ on all variables contained in $K$. After that, you safely pop $K$ out of $S$ ($K$ changes to the current top of $S$)</li>
    </ul>
    This ensures that the time complexity of each query is $O(1)$, note that the preprocessing happens on the first and last bullet points where you have to go through all variables within that nesting level!<br><br>
    Here's an example to visualize what's going on. Suppose we have this as the input<br>

    DECLARE a int
    DECLARE b float
    {
    DECLARE b int
    DECLARE c int
    }
    DECLARE d double

then our $S$ looks like <code>[{a: int, b: float, d: double}, {b: int, c: int}]</code> and our $T$ looks like <code>{a: [0], b: [0, 1], c: [1], d: [0]}</code>
</details>

<br>

### T5: PQ
<details>
    <summary><a href="https://open.kattis.com/problems/continuousmedian">Continuous Median</a></summary>
    One of my favourite Leetcode problems. The idea is to have one max heap to store the first half of the "array" and then one min heap to store the latter half. For every iteration, insert to one of the heaps and balance the sizes whenever necessary (e.g. ensure that max heap size is $N/2$ and min heap size if $N-N/2$). When reporting the median, check whether you need to peek the max heap or do you have to take the average of both heap peeks (depends on whether $N$ is currently odd or even)!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/koffinhradi">Koffínhraði</a></summary>
    Quite a big brain problem, thought I'd like to share with you guys. The idea is to sort the tasks by the <b>DEADLINE</b> because obviously you want to finish things due earlier first. Next, have a max heap to store the task times and a variable to keep track of the sum of the elements in the max heap so far. As you go through the sorted task list, we need to ensure that this sum does not exceed the deadline time of the task you're dealing with. Otherwise, until the sum is before the deadline, keep taking the task with the largest time (thus a max heap), half it, and put it back into the heap. This ensures that after completely processing the task, the sum of the task time so far will never exceed the deadline of the last task.<br>
    One more thing is that we take the task with the largest time because the amount of time saved by halving would be the most when performed on this particular task. For example, 5 -> 2 saves 3 seconds but 100 -> 50 saves 50 seconds!<br><br>
    Pseudocode would be something like this:<br>

    pq = max heap initially empty
    sum = 0
    ans = 0
    sort the tasks by increasing deadline
    for each task in the sorted task list:
        pq.push(task_time)
        sum += task_time
        while sum > task_deadline:
            t = popped task_time from pq
            pq.push(t/2)
            sum = sum - t + t/2
            ans += 1
    output ans
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/stockprices">Stock Prices</a></summary>
    Have a max heap for the buy prices and min heap for sell prices, keep polling from both queues accordingly using a while loop!
</details>

<br>

### T6: UFDS
<details>
    <summary><a href="https://open.kattis.com/problems/unionfind">Union-Find</a></summary>
    It's literally union find without any modification, like, at all.
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/reachableroads">Reachable Roads</a></summary>
    If $u$ and $v$ are connected by an edge, just merge $u$ and $v$ in the UFDS, reachable if they belong to the same set
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/skolavslutningen">Graduation</a></summary>
    Merge accordingly and find the number of disjoint sets left
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/busnumbers">Bus Numbers</a></summary>
    UFDS from 1 to 1000, keep track of min and max of each set
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/tildes">Tildes</a></summary>
    Keep track of size, then answer the query accordingly
</details>

<br>

### T7: BST
<details>
    <summary><a href="https://open.kattis.com/problems/continuousmedian">Continuous Median</a> (again!)</summary>
    Yes, again you can use BST for this instead of priority queue, just repeated use the select method from AVL tree as you insert elements into it
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/gcpc">Galactic Collegiate Programming Contest</a></summary>
    Store all the teams into an AVL tree, update the points by deleting the node corresponding to the particular team and then reinsert the updated node corresponding to that same team. Note that you need to use the <code>rank</code> function in AVL tree!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/99problems2">99 Problems</a></summary>
    You can use the successor method in AVL trees or just use the TreeSet/TreeMap methods such as <code>floorKey</code> or <code>higherKey</code>! The rest is straightforward based on the instructions
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/classrooms">Classrooms</a> (hard problem?)</summary>
    See <a href="https://en.m.wikipedia.org/wiki/Interval_scheduling#Unweighted"><b>interval scheduling on Wikipedia</b></a> for the official term for this problem but you use an AVL tree to store the compatible intervals so far!
</details>

<br>

### T8: Graph DS and Trav
<details>
    <summary><a href="https://open.kattis.com/problems/cutthenegativity">Cut the Negativity</a></summary>
    Basic conversion from adjacency matrix to edge list, a simple nested for loop will do
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/sverigekartan">Map of Sweden</a></summary>
    Most graph problems in Kattis involve 2D grids, so let's get familiar with making the adjacency list for this one, and then we can also represent each cell as one element of an UFDS on top of the adjacency list. Then for each query, it will be just the combination of enumerating the neighbours of the adjacency list and the merge part of UFDS
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/runningmom">Running MoM</a></summary>
    Let's apply cycle checking for this one. Report 'safe' is there is a cycle involving the city in query, 'trapped' otherwise.
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/namsleid">Námsleið</a></summary>
    Use Kahn's algorithm to keep track of the maximum distance between a node and any node with indegree 0. This can be done by carrying the current depth into the queue (store <code>(node, depth)</code> instead of just <code>node</code>, then you can update into <code>(next_node, depth+1)</code>). Finally, use a hashmap to keep track which modules to take for each depth value, assuming the graph is a DAG.
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/pachinkoprobability">Pachinko Probability</a> (slightly hard)</summary>
    Interesting problem that uses toposort to count the number of paths from any vertex with indegree 0 to those with outdegree 0, then among those paths how many land on the squared vertices (if you're using Kahn's algorithm, accumulate the number of paths in reverse topological order)
</details>

<br>

### T9: MST
<details>
    <summary><a href="https://open.kattis.com/problems/minspantree">Minimum Spanning Tree</a></summary>
    Basic MST problem, given input output MST weight and all the edges
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/freckles">Freckles</a></summary>
    Simply the MST cost
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/naturereserve">Nature Reserve</a></summary>
    Prim's, this tutorial's last question (the power plant thingy)
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/treehouses">Treehouses</a></summary>
    Run Kruskal's with all the first $e$ houses merged on the same set in the UFDS
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/gridmst">Grid MST</a> <b>(very hard, proceed with caution)</b></summary>
    Kruskal's but you need a way to reduce the graph using BFS since without it $O(N^2logN)$ is too big thus TLE, more details are omitted in this article
</details>

<br>

### T10: SSSP P1
<details>
    <summary><a href="https://open.kattis.com/problems/buttonbashing">Button Bashing</a></summary>
    First question of the tutorial (unlocking the lock), same idea!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/fire2">Fire</a></summary>
    Same as the fire tutorial question!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/fire3">Fire!</a></summary>
    Same as the fire tutorial question!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/slikar">Slikar</a></summary>
    Same as the fire tutorial question! Had enough dejavus?
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/oceancurrents">Ocean Currents</a> (useful!)</summary>
    I'd like to introduce you guys to a variant of BFS callled <b>0-1 BFS</b>. Assuming you managed to populate the graph, you will see that the edge weights are either 0 or 1. Instead of using a queue to perform the BFS, use a <b>double-ended queue</b>! This is because you have to either append the next state to the front of the queue or the back of the queue, depending on the edge weight, the front if it's 0 and the back if it's 1. This ensures that the double-ended queue will preserve the ordering of the distances taken so far (remains sorted)!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/getshorty">Get Shorty</a></summary>
    Similar to the money question, use negative log transformation and then just use Dijkstra!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/shortestpath3">Single source shortest path, negative weights</a></summary>
    Interesting SP problem, even with negative cycles doesn't mean the shortest path to any vertex cannot be found since it may be outside the negative cycle itself<br><br>
    <b>How to tackle:</b> Run bellman ford and compare the $(V-1)$-th iteration with the next $k$ iterations (at most $V-1$ more iterations). If the value doesn't change, that's the SP already. Otherwise, the vertex is part of a negative cycle. You can use a while loop to keep track of which vertices has its value changed but not marked as part of negative cycle.
</details>

<br>

### T11: SSSP P2 + APSP
<details>
    <summary><a href="https://open.kattis.com/problems/fendofftitan">Fend Off Titan</a></summary>
    Just a regular Dijkstra but instead of storing <code>(sp_estimate, node)</code> in the priority queue, store <code>(num_of_titans, num_of_shamans, sp_estimate, node)</code> instead, since we are comparing the values in this order
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/invasion">Invasion</a></summary>
    Also another variant of Dijkstra, but keep track of what's unsafe until the <code>sp_estimate</code> reaches $k$!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/xentopia">Tima goes to Xentopia</a></summary>
    The idea is to clone the graph and run regular Dijkstra, very similar to that of Finals 20/21 Sem 2 Q19
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/realmanhattandistance">Real Manhattan Distance</a> (hard problem)</summary>
    The hard part is how to construct the adjacency list since it involves linear algebra to some extent. Otherwise, it's just Dijkstra
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/visualgo">VisuAlgo Online Quiz</a></summary>
    A variant of Dijkstra algorithm where instead of storing just a single integer on the D array, you store a pair <code>(sp_estimate, num_of_paths)</code>. Make sure you managed to update the value of <code>num_of_paths</code> accordingly, whether <code>D[node] == curr_sp_estimate</code> or <code>D[node] > curr_sp_estimate</code> (to which you have to reset it to 0)
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/hopscotch50">Hopscotch 50</a></summary>
    MSSP with Dijkstra from all the 1 tiles to any one of the k tiles. Note that you can always convert MSSP to SSSP using the concept of super-source and super-sink!
</details>

<details>
    <summary><a href="https://open.kattis.com/problems/arbitrage">Arbitrage?</a></summary>
    Classic Floyd-Warshall using negative-log transformation but check the diagonal entries if there are negative values!
</details>