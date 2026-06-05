/* ============================================================
   COURSE CONTENT — Weeks 4–6
   ============================================================ */
window.WEEK_LESSONS = window.WEEK_LESSONS || {};

/* ---------- WEEK 4 · Graphs & Traversal ---------- */
WEEK_LESSONS[4] = {
  hook: "Graphs model everything connected — maps, networks, dependencies. First you learn to walk them: breadth-first, depth-first, and in dependency order.",
  chapters: [
    { id:'basics', title:'The Language of Graphs', icon:'🕸️', blocks:[
      {t:'p', x:"A <span class='kw'>graph</span> G = (V, E) is a set of <b>vertices</b> V joined by <b>edges</b> E. Edges can be <b>directed</b> (one-way) or <b>undirected</b>, and <b>weighted</b> (carry a cost) or not."},
      {t:'p', x:"Key vocabulary: a <b>path</b> is a sequence of edges; a <b>connected component</b> is a maximal group of mutually-reachable vertices; a <span class='kw'>tree</span> is a connected graph with no cycles and exactly <b>V−1</b> edges."},
      {t:'h', x:'Two ways to store a graph'},
      {t:'p', x:"<b>Adjacency matrix</b> — a V×V grid; edge lookup is O(1) but it costs O(V²) space (great for dense graphs). <b>Adjacency list</b> — each vertex keeps a list of neighbours; O(V+E) space and you iterate neighbours efficiently (great for sparse graphs, which is most of them)."},
      {t:'insight', title:'Sparse vs dense decides your representation', x:"Most real graphs are sparse (E ≈ V, not V²). Adjacency lists win there — and almost every O(V+E) algorithm in this unit assumes one."},
      {t:'check', q:"An edge whose removal disconnects the graph is critical. What do we call such an edge, and why care?", a:"A <b>bridge</b> (cut-edge). It matters because the connection between two parts of a network depends entirely on it — a single point of failure."},
    ]},
    { id:'bfs', title:'Breadth-First Search', icon:'🌊', blocks:[
      {t:'p', x:"<b>BFS</b> explores in rings: all vertices at distance 1, then distance 2, and so on. It uses a <span class='kw'>queue</span> (FIFO) — discover a vertex, enqueue it, deal with it later. Watch BFS ripple out from <b>A</b>:"},
      {t:'demo', kind:'graph', accent:'#54f0c8', w:480, h:220,
        nodes:[{id:'A',x:50,y:110,label:'A'},{id:'B',x:160,y:50,label:'B'},{id:'C',x:160,y:170,label:'C'},{id:'D',x:300,y:50,label:'D'},{id:'E',x:300,y:170,label:'E'},{id:'F',x:430,y:110,label:'F'}],
        edges:[{u:'A',v:'B'},{u:'A',v:'C'},{u:'B',v:'D'},{u:'C',v:'D'},{u:'C',v:'E'},{u:'D',v:'F'},{u:'E',v:'F'}],
        frames:[
          {nodeState:{A:'active'}, dist:{A:0}, note:"Start at <b>A</b>, distance 0. Enqueue it. Queue: [A]."},
          {nodeState:{A:'done',B:'frontier',C:'frontier'}, edgeState:{'A-B':'done','A-C':'done'}, dist:{A:0,B:1,C:1}, note:"Dequeue A, visit its neighbours <b>B</b> and <b>C</b> — distance 1. Queue: [B, C]."},
          {nodeState:{A:'done',B:'done',C:'frontier',D:'frontier'}, edgeState:{'A-B':'done','A-C':'done','B-D':'done'}, dist:{A:0,B:1,C:1,D:2}, note:"Dequeue B, discover <b>D</b> at distance 2. Queue: [C, D]."},
          {nodeState:{A:'done',B:'done',C:'done',D:'frontier',E:'frontier'}, edgeState:{'A-B':'done','A-C':'done','B-D':'done','C-E':'done'}, dist:{A:0,B:1,C:1,D:2,E:2}, note:"Dequeue C, discover <b>E</b> (D already seen). Queue: [D, E]."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done',E:'done',F:'frontier'}, edgeState:{'A-B':'done','A-C':'done','B-D':'done','C-E':'done','D-F':'done'}, dist:{A:0,B:1,C:1,D:2,E:2,F:3}, note:"<b>F</b> found at distance 3. BFS distances = shortest paths in an <b>unweighted</b> graph!"},
        ]},
      {t:'cx', items:[{k:'Time',v:'O(V + E)',cls:'t',note:'each vertex & edge once'},{k:'Space',v:'O(V)',cls:'s',note:'the queue'},{k:'Gives',v:'Shortest paths',note:'unweighted only'}]},
      {t:'insight', title:'BFS = free shortest paths (unweighted)', x:"Because BFS expands strictly by distance, the first time it reaches a vertex is via a shortest path. This only holds when every edge counts the same — add weights and you need Dijkstra (next week)."},
      {t:'h', x:'Finding all connected components'},
      {t:'p', x:"To find <span class='kw'>all connected components</span>, run BFS (or DFS) from every unvisited vertex. Each new run discovers one complete component. Total cost stays O(V+E) since every edge is touched at most once across all runs."},
      {t:'check', q:"What property of BFS makes it guarantee shortest paths in unweighted graphs?", a:"BFS visits vertices in non-decreasing order of their distance from the source — all distance-1 vertices before any distance-2, etc. So the <i>first</i> time BFS reaches a vertex, it must be via a shortest route."},
    ]},
    { id:'dfs', title:'Depth-First Search & DFS Tree', icon:'🧭', blocks:[
      {t:'p', x:"<b>DFS</b> plunges as deep as possible before backtracking, using a <span class='kw'>stack</span> (or recursion). Same O(V+E) cost, totally different shape — DFS is the backbone of cycle detection, connected components, and ordering tasks."},
      {t:'p', x:"During DFS on a directed graph, each edge gets classified into four types based on the DFS tree:"},
      {t:'code', x:"Tree edge    → leads to an unvisited vertex (forms the DFS spanning tree)\nBack edge    → leads to an ANCESTOR in the DFS tree  ← cycle indicator!\nForward edge → leads to a DESCENDANT (non-tree)\nCross edge   → leads to an unrelated vertex already finished"},
      {t:'insight', title:'Back edges are the only cycle evidence', x:"In a directed graph, a cycle exists <b>iff</b> DFS finds a back edge. Forward and cross edges never form cycles. In an undirected graph, every non-tree edge is a back edge."},
      {t:'demo', kind:'graph', accent:'#54f0c8', w:400, h:240, directed:true,
        nodes:[{id:'A',x:55,y:50,label:'A'},{id:'B',x:195,y:50,label:'B'},{id:'C',x:325,y:50,label:'C'},{id:'D',x:55,y:185,label:'D'},{id:'E',x:195,y:185,label:'E'}],
        edges:[{u:'A',v:'B'},{u:'A',v:'D'},{u:'B',v:'C'},{u:'B',v:'E'},{u:'D',v:'E'},{u:'E',v:'B'}],
        frames:[
          {nodeState:{A:'active'}, note:"DFS from A. Track discovery (d) and finish (f) timestamps. Active vertices shown bright."},
          {nodeState:{A:'done',B:'done',C:'done',E:'done'}, edgeState:{'A-B':'done','B-C':'done','B-E':'done'}, dist:{A:'1/8',B:'2/7',C:'3/4',E:'5/6'}, note:"A→B→C (dead end). Back to B→E (dead end). Finish B. Then A→D."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done',E:'done'}, edgeState:{'A-B':'done','B-C':'done','B-E':'done','A-D':'done','E-B':'active'}, dist:{A:'1/10',B:'2/7',C:'3/4',D:'8/9',E:'5/6'}, note:"E→B: B already has d=2 and is an ancestor of E — this is a <b>back edge → cycle detected!</b> The cycle is B→E→B."},
        ]},
      {t:'h', x:'Topological Sort'},
      {t:'p', x:"A <span class='kw'>DAG</span> is a directed graph with no cycles — perfect for modelling dependencies (course prerequisites, build steps). A <b>topological sort</b> lists vertices so every edge points forward: you never do a task before its prerequisites."},
      {t:'analogy', title:'Getting dressed', x:"Socks before shoes, shirt before jacket. Many valid orders exist, but never shoes-before-socks. A topological sort is any 'legal getting-dressed order' for a dependency DAG."},
      {t:'demo', kind:'graph', accent:'#54f0c8', w:400, h:240, directed:true,
        nodes:[{id:'A',x:55,y:50,label:'A'},{id:'B',x:195,y:50,label:'B'},{id:'C',x:55,y:185,label:'C'},{id:'D',x:195,y:185,label:'D'},{id:'E',x:330,y:118,label:'E'}],
        edges:[{u:'A',v:'B'},{u:'A',v:'C'},{u:'B',v:'D'},{u:'C',v:'D'},{u:'D',v:'E'}],
        frames:[
          {note:"A directed acyclic graph. Each arrow X→Y means <b>X must come before Y</b>. We want a linear order respecting every arrow."},
          {nodeState:{A:'active',B:'active',D:'active',E:'compare'}, edgeState:{'A-B':'active','B-D':'active','D-E':'active'}, note:"DFS dives as deep as it can from A: A → B → D → E. E is a dead end — no outgoing arrows."},
          {nodeState:{E:'done',D:'done',B:'done',A:'active',C:'compare'}, dist:{E:1,D:2,B:3}, edgeState:{'A-C':'active'}, note:"A vertex <b>finishes</b> once all its descendants are done: E first (1), then D (2), then B (3). Backtrack to A and explore C."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done',E:'done'}, dist:{E:1,D:2,B:3,C:4,A:5}, note:"C finishes (4), then A last (5). <b>Finish order: E, D, B, C, A.</b>"},
          {nodeState:{A:'frontier',C:'frontier',B:'frontier',D:'frontier',E:'frontier'}, dist:{A:1,C:2,B:3,D:4,E:5}, edgeState:{'A-B':'done','A-C':'done','B-D':'done','C-D':'done','D-E':'done'}, note:"<b>Reverse</b> the finish order → topological order <b>A, C, B, D, E</b>. Every arrow points forward. ✔"},
        ]},
      {t:'check', q:"Why can you only topologically sort a DAG — never a graph with a cycle?", a:"A cycle A→B→C→A means A must come before B, B before C, and C before A simultaneously — a contradiction. No linear order can satisfy a circular dependency, so a topological sort exists <b>if and only if</b> the graph is acyclic."},
    ]},
  ]
};

/* ---------- WEEK 5 · Greedy: Dijkstra & MST ---------- */
WEEK_LESSONS[5] = {
  hook: "Greedy algorithms grab the best-looking choice right now and never look back. Astonishingly, for the right problems, local greed is globally optimal.",
  chapters: [
    { id:'greedy', title:'The Greedy Paradigm', icon:'💎', blocks:[
      {t:'p', x:"A <span class='kw'>greedy algorithm</span> builds a solution one step at a time, always taking the choice that looks best <i>right now</i> — and never reconsidering. Fast and simple, but only correct when the problem has the right structure."},
      {t:'insight', title:'Greed needs a proof', x:"Greedy isn't always right (it fails for 0/1 knapsack, for instance). When it <i>is</i> right, you prove it — usually with an <b>exchange argument</b>: show that any optimal solution can be transformed into the greedy one without getting worse."},
    ]},
    { id:'dijkstra', title:"Dijkstra's Shortest Paths", icon:'🗺️', blocks:[
      {t:'p', x:"With <b>weighted</b> edges, BFS breaks. <b>Dijkstra's algorithm</b> greedily grows a set of finalised vertices: repeatedly pick the unfinalised vertex with the smallest tentative distance, lock it in, and <span class='kw'>relax</span> its outgoing edges. A <b>min-heap</b> supplies the next-closest vertex fast."},
      {t:'demo', kind:'graph', accent:'#3ee0ff', w:480, h:230, directed:true,
        nodes:[{id:'S',x:50,y:115,label:'S'},{id:'A',x:170,y:45,label:'A'},{id:'B',x:170,y:185,label:'B'},{id:'C',x:310,y:90,label:'C'},{id:'D',x:430,y:150,label:'D'}],
        edges:[{u:'S',v:'A',w:2},{u:'S',v:'B',w:5},{u:'A',v:'C',w:3},{u:'B',v:'C',w:1},{u:'C',v:'D',w:4},{u:'B',v:'D',w:9}],
        frames:[
          {nodeState:{S:'active'}, dist:{S:0,A:'∞',B:'∞',C:'∞',D:'∞'}, note:"Source <b>S</b> = 0, all others ∞. Pick the closest unfinalised vertex: S."},
          {nodeState:{S:'done',A:'frontier',B:'frontier'}, edgeState:{'S-A':'active','S-B':'active'}, dist:{S:0,A:2,B:5,C:'∞',D:'∞'}, note:"Finalise S. Relax its edges: A ← 2, B ← 5. Closest unfinalised is now <b>A</b> (2)."},
          {nodeState:{S:'done',A:'done',B:'frontier',C:'frontier'}, edgeState:{'A-C':'active'}, dist:{S:0,A:2,B:5,C:5,D:'∞'}, note:"Finalise A. Relax A→C: C ← 2+3 = 5. Next closest: <b>B</b> (5) or C (5) — break ties either way."},
          {nodeState:{S:'done',A:'done',B:'done',C:'frontier'}, edgeState:{'B-C':'active'}, dist:{S:0,A:2,B:5,C:5,D:14}, note:"Finalise B. B→C offers 5+1 = 6, but C is already 5 — <b>no improvement</b>. B→D sets D ← 14."},
          {nodeState:{S:'done',A:'done',B:'done',C:'done',D:'frontier'}, edgeState:{'C-D':'active'}, dist:{S:0,A:2,B:5,C:5,D:9}, note:"Finalise C. C→D: 5+4 = 9 beats 14 → D ← <b>9</b>. Finalise D. Shortest distances: {S:0, A:2, B:5, C:5, D:9}. ✔"},
        ]},
      {t:'cx', items:[{k:'Time',v:'O(E log V)',cls:'t',note:'binary min-heap'},{k:'Space',v:'O(V)',cls:'s'},{k:'Needs',v:'weights ≥ 0',note:'no negatives!'}]},
      {t:'warn', title:'Dijkstra forbids negative edges', x:"Once Dijkstra finalises a vertex it never revisits it. A negative edge could later offer a cheaper route to a 'finalised' vertex — breaking the greedy invariant. For negatives you need Bellman-Ford (Week 7)."},
      {t:'check', q:"Why does relaxing edge (u,v) only update v if dist[u] + w(u,v) < dist[v]?", a:"Relaxation asks 'is routing through u a <b>shorter</b> way to reach v than what I've found so far?' You only overwrite dist[v] when the new path genuinely improves it — that's how the algorithm converges to true shortest distances."},
    ]},
    { id:'mst', title:'Minimum Spanning Trees', icon:'🌲', blocks:[
      {t:'p', x:"A <span class='kw'>spanning tree</span> connects all V vertices with exactly V−1 edges and no cycles. The <b>minimum</b> spanning tree (MST) is the one with the least total edge weight — the cheapest way to wire everything together."},
      {t:'h', x:"Prim's — grow from a seed"},
      {t:'demo', kind:'graph', accent:'#54f0c8', w:380, h:280,
        nodes:[{id:'A',x:55,y:65,label:'A'},{id:'B',x:205,y:50,label:'B'},{id:'C',x:120,y:165,label:'C'},{id:'D',x:305,y:135,label:'D'},{id:'E',x:235,y:240,label:'E'}],
        edges:[{u:'A',v:'B',w:2},{u:'A',v:'C',w:3},{u:'B',v:'C',w:1},{u:'B',v:'D',w:4},{u:'C',v:'D',w:5},{u:'D',v:'E',w:2},{u:'C',v:'E',w:6}],
        frames:[
          {note:"Build the <b>minimum spanning tree</b>: connect all 5 vertices with minimum total weight. Prim's grows one tree outward from a seed."},
          {nodeState:{A:'done'}, note:"Start the tree with just <b>A</b>. The crossing edges leaving {A} are: A–B(2), A–C(3). Cheapest = A–B(2)."},
          {nodeState:{A:'done',B:'done'}, edgeState:{'A-B':'done'}, note:"Add <b>B</b> via A–B(2). Crossing edges now: A–C(3), B–C(1), B–D(4). Cheapest = B–C(1)."},
          {nodeState:{A:'done',B:'done',C:'done'}, edgeState:{'A-B':'done','B-C':'done'}, note:"Add <b>C</b> via B–C(1). Crossing edges: B–D(4), C–D(5), C–E(6). Cheapest = B–D(4)."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done'}, edgeState:{'A-B':'done','B-C':'done','B-D':'done'}, note:"Add <b>D</b> via B–D(4). Crossing edge: D–E(2) beats C–E(6). Add D–E."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done',E:'done'}, edgeState:{'A-B':'done','B-C':'done','B-D':'done','D-E':'done'}, note:"MST complete — total weight 2+1+4+2 = <b>9</b>. Greedy never backtracked. ✔"},
        ]},
      {t:'h', x:"Kruskal's — sort edges, grow forest"},
      {t:'p', x:"<b>Kruskal's</b> approach is different: sort <i>all</i> edges by weight and greedily add the cheapest edge that doesn't create a cycle. To detect cycles instantly, use a <span class='kw'>Union-Find</span> (Disjoint-Set) structure."},
      {t:'demo', kind:'graph', accent:'#54f0c8', w:380, h:280,
        nodes:[{id:'A',x:55,y:65,label:'A'},{id:'B',x:205,y:50,label:'B'},{id:'C',x:120,y:165,label:'C'},{id:'D',x:305,y:135,label:'D'},{id:'E',x:235,y:240,label:'E'}],
        edges:[{u:'A',v:'B',w:2},{u:'A',v:'C',w:3},{u:'B',v:'C',w:1},{u:'B',v:'D',w:4},{u:'C',v:'D',w:5},{u:'D',v:'E',w:2},{u:'C',v:'E',w:6}],
        frames:[
          {note:"Edges sorted by weight: B–C(1), A–B(2), D–E(2), A–C(3), B–D(4), C–D(5), C–E(6). Try each in order; add if no cycle."},
          {nodeState:{B:'done',C:'done'}, edgeState:{'B-C':'done'}, note:"Add <b>B–C (1)</b>. No cycle — B and C were in different components. Components: {A},{B,C},{D},{E}."},
          {nodeState:{A:'done',B:'done',C:'done'}, edgeState:{'B-C':'done','A-B':'done'}, note:"Add <b>A–B (2)</b>. A and B are in different components. Components: {A,B,C},{D},{E}."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done',E:'done'}, edgeState:{'B-C':'done','A-B':'done','D-E':'done'}, note:"Add <b>D–E (2)</b>. Different components. Now {A,B,C},{D,E}."},
          {nodeState:{A:'done',B:'done',C:'done',D:'done',E:'done'}, edgeState:{'B-C':'done','A-B':'done','D-E':'done','B-D':'done'}, note:"Try A–C (3): A and C are in the <b>same</b> component — skip (would form cycle). Add <b>B–D (4)</b>. All 5 vertices connected — MST done! Weight = 1+2+2+4 = <b>9</b>. ✔"},
        ]},
      {t:'insight', title:'Union-Find makes Kruskal fast', x:"The <b>Union-Find</b> structure answers 'are these two vertices already connected?' in nearly constant time using two techniques: <b>path compression</b> (flatten long chains during find) and <b>union by rank</b> (attach smaller trees under larger ones). Combined they give amortised O(α(V)) ≈ O(1) per operation."},
      {t:'code', x:"# Union-Find with path compression + union by rank\nfind(x):  if parent[x] != x: parent[x] = find(parent[x])  # compress\n          return parent[x]\n\nunion(x, y):\n    rx, ry = find(x), find(y)\n    if rx == ry: return False           # already connected — cycle!\n    if rank[rx] < rank[ry]: rx, ry = ry, rx\n    parent[ry] = rx                     # attach smaller under larger\n    if rank[rx] == rank[ry]: rank[rx] += 1\n    return True"},
      {t:'check', q:"Prim's and Kruskal's are both greedy and both O(E log V). When might you prefer Kruskal's?", a:"When the graph is <b>sparse</b> or edges are already sorted, Kruskal's edge-centric approach shines. Prim's suits <b>dense</b> graphs where growing from a vertex with a heap is natural. Both yield a valid MST."},
    ]},
  ]
};

/* ---------- WEEK 6 · Dynamic Programming ---------- */
WEEK_LESSONS[6] = {
  hook: "When subproblems overlap, solving each one once and remembering the answer turns exponential brute force into polynomial magic. That's dynamic programming.",
  chapters: [
    { id:'dp', title:'The DP Mindset', icon:'🧠', blocks:[
      {t:'p', x:"<span class='kw'>Dynamic programming</span> applies when a problem has two traits: <b>optimal substructure</b> (the best solution is built from best solutions of subproblems) and <b>overlapping subproblems</b> (the same subproblems recur again and again)."},
      {t:'p', x:"Naive recursive Fibonacci recomputes fib(3) a hundred times for fib(10). <b>Memoization</b> stores each answer the first time, turning O(2ⁿ) into <span class='kw'>O(n)</span>. That's the entire idea: compute once, reuse forever."},
      {t:'h', x:'Top-down vs bottom-up'},
      {t:'p', x:"<b>Top-down</b> (memoized recursion) computes subproblems lazily, only what it needs. <b>Bottom-up</b> (tabulation) fills a table in dependency order with simple loops — usually faster (no recursion overhead) and easier to analyse. Same answers, two styles."},
      {t:'insight', title:'The four-step DP recipe', x:"1) <b>Define</b> the subproblem precisely (what does cell [i] / [i][j] mean?). 2) Write the <b>recurrence</b> relating it to smaller cells. 3) Identify <b>base cases</b>. 4) Decide the <b>fill order</b>. Nail step 1 and the rest follows."},
    ]},
    { id:'coins', title:'Coin Change: DP in 1D', icon:'🪙', blocks:[
      {t:'p', x:"The <span class='kw'>coin change problem</span>: given coin denominations and a target value V, find the minimum number of coins that sum to V. Greedy (pick largest coin first) fails — e.g. coins {9,6,5,1}, target 12: greedy picks 9+1+1+1 = 4 coins, but optimal is 6+6 = <b>2</b>."},
      {t:'p', x:"DP definition: <b>MinCoins[v]</b> = fewest coins to make exactly $v. Recurrence: MinCoins[v] = 1 + min(MinCoins[v−c] for each coin c ≤ v). Watch the table fill for coins <b>{9, 6, 5, 1}</b> up to V=12:"},
      {t:'demo', kind:'array', accent:'#a6ff5c', frames:[
        {title:'Base + first few values', cells:[{v:0,state:'done',tag:'0'},{v:1,state:'done',tag:'1'},{v:2,state:'done',tag:'2'},{v:3,state:'done',tag:'3'},{v:4,state:'done',tag:'4'},{v:1,state:'active',tag:'5'},{v:1,state:'active',tag:'6'},{v:2,state:'compare',tag:'7'},{v:3,state:'compare',tag:'8'},{v:1,state:'compare',tag:'9'},{v:2,state:'compare',tag:'10'},{v:2,state:'compare',tag:'11'},{v:'?',tag:'12'}], note:"MinCoins[0]=0 (free). MinCoins[1..4] = 1,2,3,4 (only use coin 1). MinCoins[5] = 1+MinCoins[0] = 1 (use coin 5). MinCoins[6] = 1 (use coin 6). Now compute MinCoins[12]."},
        {title:'MinCoins[12] — try each coin', cells:[{v:0,tag:'0'},{v:1,tag:'1'},{v:2,tag:'2'},{v:3,tag:'3'},{v:4,tag:'4'},{v:1,tag:'5'},{v:1,tag:'6'},{v:2,tag:'7'},{v:3,tag:'8'},{v:1,tag:'9'},{v:2,tag:'10'},{v:2,tag:'11'},{v:'?',state:'active',tag:'12'}], note:"Coin 1: 1+MinCoins[11]=3.  Coin 5: 1+MinCoins[7]=3.  Coin 6: 1+MinCoins[6]=2.  Coin 9: 1+MinCoins[3]=4. Best = <b>2</b> (two 6-coins)!"},
        {title:'Final table', cells:[{v:0,state:'done',tag:'0'},{v:1,state:'done',tag:'1'},{v:2,state:'done',tag:'2'},{v:3,state:'done',tag:'3'},{v:4,state:'done',tag:'4'},{v:1,state:'done',tag:'5'},{v:1,state:'done',tag:'6'},{v:2,state:'done',tag:'7'},{v:3,state:'done',tag:'8'},{v:1,state:'done',tag:'9'},{v:2,state:'done',tag:'10'},{v:2,state:'done',tag:'11'},{v:2,state:'done',tag:'12'}], note:"MinCoins[12] = <b>2</b>. The DP table fills left-to-right; each cell costs O(number of coins) to fill — total O(V×N)."},
      ]},
      {t:'cx', items:[{k:'Time',v:'O(V·N)',cls:'t',note:'V = target, N = #coins'},{k:'Space',v:'O(V)',cls:'s'}]},
      {t:'check', q:"Why does greedy fail for coins {9,6,5,1} and target 12?", a:"Greedy takes the largest coin it can: 9, then 1+1+1 = 4 coins. But 6+6 = <b>2</b> coins is better. Greedy picks locally optimal coins without considering what denominations remain — no exchange argument saves it here."},
    ]},
    { id:'knap', title:'Knapsack: Bounded & Unbounded', icon:'🎒', blocks:[
      {t:'p', x:"The <b>knapsack</b> family is core exam territory. Given items with weights and values and a capacity, maximise value. <b>Unbounded</b> = use each item any number of times; <b>0/1</b> = each item at most once."},
      {t:'p', x:"The 0/1 recurrence captures a single decision per item — <b>take it or leave it</b>:"},
      {t:'code', x:"# memo[i][c] = best value using items 1..i with capacity c\nif weight[i] > c:\n    memo[i][c] = memo[i-1][c]                     # can't fit — skip\nelse:\n    memo[i][c] = max(\n        memo[i-1][c],                            # leave item i\n        value[i] + memo[i-1][c - weight[i]]      # take item i\n    )"},
      {t:'demo', kind:'grid', accent:'#a6ff5c', rows:4, cols:6, cap:'item \\ cap',
        rowLabels:['∅','#1','#2','#3'], colLabels:['0','1','2','3','4','5'],
        frames:[
          {title:'Row 0 — no items available', cells:{'0,0':{v:0,state:'done'},'0,1':{v:0,state:'done'},'0,2':{v:0,state:'done'},'0,3':{v:0,state:'done'},'0,4':{v:0,state:'done'},'0,5':{v:0,state:'done'}}, note:"With no items, every capacity holds value 0."},
          {title:'Add item #1 (w2, v3)', cells:{'0,0':{v:0},'0,1':{v:0},'0,2':{v:0},'0,3':{v:0},'0,4':{v:0},'0,5':{v:0},'1,0':{v:0,state:'done'},'1,1':{v:0,state:'done'},'1,2':{v:3,state:'active'},'1,3':{v:3,state:'active'},'1,4':{v:3,state:'active'},'1,5':{v:3,state:'active'}}, note:"Item #1 weighs 2, so it fits once capacity ≥ 2, adding value <b>3</b>."},
          {title:'Add item #2 (w3, v4)', cells:{'0,0':{v:0},'0,1':{v:0},'0,2':{v:0},'0,3':{v:0},'0,4':{v:0},'0,5':{v:0},'1,0':{v:0},'1,1':{v:0},'1,2':{v:3},'1,3':{v:3},'1,4':{v:3},'1,5':{v:3},'2,0':{v:0,state:'done'},'2,1':{v:0,state:'done'},'2,2':{v:3,state:'done'},'2,3':{v:4,state:'done'},'2,4':{v:4,state:'done'},'2,5':{v:7,state:'active'}}, note:"At cap 5: <b>max(</b> leave #2 = 3, <b>take</b> 4 + best-of-cap-2 = 4+3 <b>) = 7</b>."},
          {title:'Add item #3 (w4, v5) → answer', cells:{'1,2':{v:3},'1,3':{v:3},'1,4':{v:3},'1,5':{v:3},'2,2':{v:3},'2,3':{v:4},'2,4':{v:4},'2,5':{v:7},'3,0':{v:0,state:'done'},'3,1':{v:0,state:'done'},'3,2':{v:3,state:'done'},'3,3':{v:4,state:'done'},'3,4':{v:5,state:'done'},'3,5':{v:7,state:'active'}}, note:"Item #3 (w4,v5) helps at cap 4+ but not beyond. Corner cell = <b>7</b>: items #1+#2 (w5, v7)."},
        ]},
      {t:'warn', title:'Why greedy fails 0/1 knapsack', x:"Grabbing the highest value-per-weight item first can lock you out of a better combination. 0/1 knapsack needs DP precisely because the best <i>global</i> choice isn't the best <i>local</i> one — there's no exchange argument to save you."},
      {t:'check', q:"Unbounded knapsack lets you reuse items; 0/1 doesn't. Which index changes in the recurrence?", a:"In <b>unbounded</b>, after taking item i you may take it again, so you recurse on <b>memo[i][c − weight[i]]</b> (same i row). In <b>0/1</b> you move on, recursing on <b>memo[i−1][c − weight[i]]</b> (previous row)."},
    ]},
    { id:'edit', title:'Edit Distance: the DP Grid', icon:'📝', blocks:[
      {t:'p', x:"<span class='kw'>Edit distance</span> counts the minimum insertions, deletions, and substitutions to turn one string into another — the engine behind spell-check and DNA alignment. The DP fills a grid where cell [i][j] = edit distance between the first i letters of A and first j of B. Watch it fill for <b>SAT → CATS</b>:"},
      {t:'demo', kind:'grid', accent:'#a6ff5c', rows:4, cols:5, cap:'∅ C A T S',
        rowLabels:['∅','S','A','T'], colLabels:['∅','C','A','T','S'],
        frames:[
          {title:'Base row & column', cells:{'0,0':{v:0,state:'done'},'0,1':{v:1,state:'done'},'0,2':{v:2,state:'done'},'0,3':{v:3,state:'done'},'0,4':{v:4,state:'done'},'1,0':{v:1,state:'done'},'2,0':{v:2,state:'done'},'3,0':{v:3,state:'done'}}, note:"Turning any string into '' costs one deletion per letter — and vice versa. That seeds row 0 and column 0."},
          {cells:{'0,0':{v:0},'0,1':{v:1},'0,2':{v:2},'0,3':{v:3},'0,4':{v:4},'1,0':{v:1},'2,0':{v:2},'3,0':{v:3},'1,1':{v:1,state:'active'}}, note:"Cell [S,C]: letters differ. Take 1 + min of the three neighbours (↖ substitute, ← insert, ↑ delete) = 1 + min(0,1,1) = <b>1</b>."},
          {cells:{'0,0':{v:0},'0,1':{v:1},'0,2':{v:2},'0,3':{v:3},'0,4':{v:4},'1,0':{v:1},'2,0':{v:2},'3,0':{v:3},'1,1':{v:1,state:'done'},'1,2':{v:2,state:'done'},'1,3':{v:3,state:'done'},'1,4':{v:3,state:'active'}}, note:"Fill row by row. At [S,S] the letters <b>match</b>, so we copy the diagonal ↖ with no added cost."},
          {cells:{'0,0':{v:0},'0,1':{v:1},'0,2':{v:2},'0,3':{v:3},'0,4':{v:4},'1,0':{v:1},'1,1':{v:1},'1,2':{v:2},'1,3':{v:3},'1,4':{v:3},'2,0':{v:2},'2,1':{v:2},'2,2':{v:1,state:'done'},'2,3':{v:2},'2,4':{v:3},'3,0':{v:3},'3,1':{v:3},'3,2':{v:2},'3,3':{v:1},'3,4':{v:2,state:'active'}}, note:"The bottom-right cell holds the answer: edit distance(SAT, CATS) = <b>2</b> (insert C at front, keep rest; or sub + insert)."},
        ]},
      {t:'cx', items:[{k:'Time',v:'O(m·n)',cls:'t',note:'fill every cell once'},{k:'Space',v:'O(m·n)',cls:'s',note:'O(n) if row-rolled'}]},
      {t:'h', x:'Reconstructing the actual edits'},
      {t:'p', x:"The grid gives the <i>cost</i>; to recover the <i>operations</i> you <b>backtrack</b> from the bottom-right, following which neighbour each cell came from. Two ways to do this: store a <span class='kw'>decision array</span> as you fill (fast lookup, more memory), or recompute the comparison while backtracking (less memory, a little slower). Same trick reconstructs solutions for knapsack and most DP problems."},
      {t:'h', x:'House robber: 1D DP from applied classes'},
      {t:'p', x:"You plan to rob houses along a street. House i yields profit c[i], but you can't rob two adjacent houses (the neighbours will notice). Maximise profit. DP[i] = max profit from houses 1..i:"},
      {t:'code', x:"DP[0] = 0,  DP[1] = c[1]\nfor i = 2..n:\n    DP[i] = max(DP[i-1],          # skip house i\n                DP[i-2] + c[i])   # rob house i (can't have robbed i-1)\nreturn DP[n]"},
      {t:'demo', kind:'array', accent:'#a6ff5c', frames:[
        {title:'Houses: [50, 10, 12, 65, 40, 95, 100, 12, 20, 30]', cells:[{v:0,tag:'0'},{v:50,tag:'1'},{v:50,state:'active',tag:'2'},{v:62,state:'active',tag:'3'},{v:115,state:'compare',tag:'4'},{v:115,state:'compare',tag:'5'},{v:210,state:'compare',tag:'6'},{v:215,state:'compare',tag:'7'},{v:222,state:'done',tag:'8'},{v:222,state:'done',tag:'9'},{v:252,state:'done',tag:'10'}], note:"Fill DP[0..10]. DP[4]=max(DP[3],DP[2]+65)=max(62,115)=115. Final answer: DP[10]=<b>252</b>. Optimal: rob houses 1,4,6,8,10."},
      ]},
      {t:'check', q:"You've filled a DP table and know the optimal cost. Why might you still need a decision array or backtracking pass?", a:"The table gives the optimal <b>value</b>, but often you need the actual <b>solution</b> — which items, which edits, which path. Backtracking from the final cell through the choices that produced each value reconstructs that solution."},
    ]},
  ]
};
