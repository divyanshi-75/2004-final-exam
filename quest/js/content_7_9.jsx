/* ============================================================
   COURSE CONTENT — Weeks 7–9
   ============================================================ */
window.WEEK_LESSONS = window.WEEK_LESSONS || {};

/* ---------- WEEK 7 · DP on Graphs ---------- */
WEEK_LESSONS[7] = {
  hook: "Dijkstra chokes on negative edges. This week, dynamic programming rides to the rescue — relaxing edges over and over until shortest paths fall out.",
  chapters: [
    { id:'bf', title:'Bellman-Ford: Shortest Paths with Negatives', icon:'➖', blocks:[
      {t:'p', x:"When edges can be <b>negative</b>, Dijkstra's greedy 'finalise and forget' breaks. <span class='kw'>Bellman-Ford</span> takes a DP view instead: a shortest path uses at most <b>V−1</b> edges, so if we <b>relax every edge</b> V−1 times, all shortest distances settle."},
      {t:'insight', title:'The DP subproblem', x:"dist(i, v) = shortest path from source s to v using <b>at most i edges</b>. The recurrence: dist(i, v) = min(dist(i−1, v), min over all (u,v) edges of dist(i−1, u) + w(u,v)). After i = V−1 iterations, all paths are finalized."},
      {t:'demo', kind:'graph', accent:'#ff7ac0', w:480, h:220, directed:true,
        nodes:[{id:'S',x:50,y:110,label:'S'},{id:'A',x:185,y:45,label:'A'},{id:'B',x:185,y:175,label:'B'},{id:'C',x:340,y:110,label:'C'}],
        edges:[{u:'S',v:'A',w:4},{u:'S',v:'B',w:5},{u:'A',v:'C',w:3},{u:'B',v:'A',w:-3},{u:'B',v:'C',w:4}],
        frames:[
          {nodeState:{S:'active'}, dist:{S:0,A:'∞',B:'∞',C:'∞'}, note:"S = 0, rest ∞. Bellman-Ford relaxes <b>all edges every pass</b> — no heap, no greedy finalization."},
          {nodeState:{S:'done',A:'frontier',B:'frontier'}, edgeState:{'S-A':'active','S-B':'active'}, dist:{S:0,A:4,B:5,C:'∞'}, note:"Pass 1: relax S→A (A=4), S→B (B=5). A looks settled at 4…"},
          {nodeState:{A:'frontier',B:'done'}, edgeState:{'B-A':'active'}, dist:{S:0,A:2,B:5,C:'∞'}, note:"…but B→A has weight <b>−3</b>: 5+(−3)=2 &lt; 4. A drops to <b>2</b>. A greedy algorithm would have finalised A at 4 and missed this."},
          {nodeState:{A:'done',C:'frontier'}, edgeState:{'A-C':'active'}, dist:{S:0,A:2,B:5,C:5}, note:"Pass 2 continues: relax A→C with the improved A distance: 2+3 = <b>5</b>. After V−1=3 passes with no further change, all distances are final."},
        ]},
      {t:'cx', items:[{k:'Time',v:'O(V·E)',cls:'t',note:'V−1 passes × E edges'},{k:'Space',v:'O(V)',cls:'s'},{k:'Handles',v:'Negatives',note:'unlike Dijkstra'}]},
      {t:'h', x:'Detecting negative cycles'},
      {t:'p', x:"If a <b>V-th</b> relaxation pass still improves some distance, a <span class='kw'>negative-weight cycle</span> is reachable from the source — shortest paths become undefined (you could loop forever). That one extra pass is a free negative-cycle detector."},
      {t:'demo', kind:'graph', accent:'#ff7ac0', w:420, h:220, directed:true,
        nodes:[{id:'S',x:50,y:110,label:'S'},{id:'A',x:175,y:50,label:'A'},{id:'B',x:295,y:50,label:'B'},{id:'C',x:295,y:170,label:'C'},{id:'D',x:400,y:110,label:'D'}],
        edges:[{u:'S',v:'A',w:1},{u:'A',v:'B',w:2},{u:'B',v:'C',w:-5},{u:'C',v:'A',w:1},{u:'B',v:'D',w:3}],
        frames:[
          {nodeState:{S:'active'}, dist:{S:0,A:'∞',B:'∞',C:'∞',D:'∞'}, note:"Start BF. Look for cycle: A→B→C→A has weight 2+(−5)+1 = <b>−2</b>. It is negative — shortest paths through this cycle are undefined."},
          {nodeState:{S:'done',A:'done',B:'done',C:'bad',D:'done'}, edgeState:{'B-C':'bad','C-A':'bad','A-B':'bad'}, dist:{S:0,A:'−∞',B:'−∞',C:'−∞',D:'−∞'}, note:"After V−1 passes, run one more pass. If any distance still decreases (A, B, C all do), a negative cycle is reachable — report <b>error / −∞</b>. D is also affected since you can reach it from the cycle."},
        ]},
      {t:'warn', title:'Dijkstra vs Bellman-Ford', x:"Dijkstra is O(E log V) but <b>requires non-negative weights</b>. Bellman-Ford is O(VE) but handles negatives and detects negative cycles. Always ask: are there negative edges?"},
      {t:'check', q:"Bellman-Ford has an early-stop optimisation. What is it?", a:"If a full pass relaxes <b>nothing</b> (no distance changes), all shortest paths are already final — stop early. On many graphs it finishes well before V−1 passes. The V-th pass for cycle detection only runs if earlier passes actually changed something."},
    ]},
    { id:'fw', title:'Floyd-Warshall: All-Pairs Shortest Paths', icon:'🌐', blocks:[
      {t:'p', x:"Need the shortest path between <b>every</b> pair of vertices? <span class='kw'>Floyd-Warshall</span> is a three-line DP miracle. Its subproblem: the shortest path from i to j using only intermediate vertices drawn from {1..k}."},
      {t:'code', x:"# dist[i][j] starts as direct edge weights (∞ if none), 0 on diagonal\nfor k in 1..V:              # allow vertex k as a waypoint\n    for i in 1..V:\n        for j in 1..V:\n            dist[i][j] = min(dist[i][j],\n                             dist[i][k] + dist[k][j])"},
      {t:'demo', kind:'grid', accent:'#5eead4', rows:3, cols:3, cap:'i \\ j',
        rowLabels:['1','2','3'], colLabels:['1','2','3'],
        frames:[
          {title:'Initial — direct edges only (1→2=4, 2→3=1, 1→3=10)', cells:{'0,0':{v:0,state:'done'},'0,1':{v:4,state:'done'},'0,2':{v:10,state:'done'},'1,0':{v:'∞',state:'idle'},'1,1':{v:0,state:'done'},'1,2':{v:1,state:'done'},'2,0':{v:'∞',state:'idle'},'2,1':{v:'∞',state:'idle'},'2,2':{v:0,state:'done'}}, note:"dist[i][j] = direct edge weight, or ∞ if none. We'll allow each vertex as a waypoint, one at a time."},
          {title:'k=1: waypoint vertex 1 (nothing can reach 1 here)', cells:{'0,0':{v:0},'0,1':{v:4},'0,2':{v:10},'1,0':{v:'∞'},'1,1':{v:0},'1,2':{v:1},'2,0':{v:'∞'},'2,1':{v:'∞'},'2,2':{v:0}}, note:"No vertex can reach 1 from somewhere else in this example. No updates."},
          {title:'k=2: waypoint vertex 2 → updates dist[1][3]', cells:{'0,0':{v:0},'0,1':{v:4},'0,2':{v:5,state:'active'},'1,0':{v:'∞'},'1,1':{v:0},'1,2':{v:1},'2,0':{v:'∞'},'2,1':{v:'∞'},'2,2':{v:0}}, note:"1→3 directly costs 10. But 1→2→3 = 4+1 = <b>5</b>. Routing through vertex 2 wins! dist[1][3] ← 5."},
          {title:'k=3: final — no further improvements', cells:{'0,0':{v:0,state:'done'},'0,1':{v:4,state:'done'},'0,2':{v:5,state:'done'},'1,0':{v:'∞'},'1,1':{v:0,state:'done'},'1,2':{v:1,state:'done'},'2,0':{v:'∞'},'2,1':{v:'∞'},'2,2':{v:0,state:'done'}}, note:"Vertex 3 as waypoint doesn't help anything. Done in <b>O(V³)</b>. Every cell is a true shortest-path distance."},
        ]},
      {t:'cx', items:[{k:'Time',v:'O(V³)',cls:'t',note:'triple loop'},{k:'Space',v:'O(V²)',cls:'s',note:'the matrix'}]},
      {t:'insight', title:'The loop order is sacred', x:"<b>k must be the outermost loop.</b> It represents 'which waypoints are allowed yet' — the DP dimension. Putting i or j outside k computes garbage. This is the single most common Floyd-Warshall exam mistake."},
      {t:'h', x:'Negative cycle detection with Floyd-Warshall'},
      {t:'p', x:"After running Floyd-Warshall, check the diagonal: if any <b>dist[i][i] &lt; 0</b>, vertex i lies on a negative-weight cycle. This is because the algorithm found a path from i back to i with negative total weight."},
      {t:'h', x:'Transitive closure'},
      {t:'p', x:"Swap min/plus for OR/AND and Floyd-Warshall becomes <b>Warshall's algorithm</b> for <span class='kw'>transitive closure</span>: is j reachable from i at all? reach[i][j] = reach[i][j] OR (reach[i][k] AND reach[k][j]). Same O(V³) skeleton, boolean payload."},
      {t:'check', q:"When would you choose Floyd-Warshall over running Dijkstra from every vertex?", a:"For <b>dense</b> graphs and when you need <b>all pairs</b>: Floyd-Warshall's O(V³) is simple and beats V × Dijkstra (O(V·E log V)) when E approaches V². It also handles negative edges (no negative cycles). Dijkstra-from-each-vertex wins on sparse graphs."},
    ]},
  ]
};

/* ---------- WEEK 8 · Strings & Tries ---------- */
WEEK_LESSONS[8] = {
  hook: "Text is everywhere — and special structures make searching it lightning-fast. Meet the trie and its powerful cousins, the suffix trie and suffix tree.",
  chapters: [
    { id:'trie', title:'The Trie (ReTRIEval Tree)', icon:'🌴', blocks:[
      {t:'p', x:"A <span class='kw'>trie</span> stores a set of strings as a tree of shared <b>prefixes</b>. Each edge is a character; each root-to-node path spells a prefix. Words that start the same way share the same early branches."},
      {t:'p', x:"Every stored string ends with a special <b>terminal character '$'</b>. This tells the trie 'a word ends here' and prevents shorter words from being invisible inside longer ones (e.g. 'bank' hiding inside 'banks')."},
      {t:'demo', kind:'tree', accent:'#3ee0ff', w:440, h:300,
        frames:[
          {nodes:[{id:'r',x:220,y:30,label:'•'},{id:'c',x:150,y:90,label:'C',state:'active'},{id:'a',x:150,y:150,label:'A',state:'active'},{id:'t',x:95,y:215,label:'T',state:'active'},{id:'te',x:95,y:275,label:'$',state:'done'}], edges:[['r','c','active'],['c','a','active'],['a','t','active'],['t','te','active']], note:"Insert <b>CAT$</b>: create a path C → A → T → $. The $ node marks end-of-word."},
          {nodes:[{id:'r',x:220,y:30,label:'•'},{id:'c',x:150,y:90,label:'C',state:'done'},{id:'a',x:150,y:150,label:'A',state:'done'},{id:'t',x:95,y:215,label:'T',state:'done'},{id:'te',x:95,y:275,label:'$'},{id:'rr',x:210,y:215,label:'R',state:'active'},{id:'rre',x:210,y:275,label:'$',state:'done'}], edges:[['r','c','done'],['c','a','done'],['a','t','done'],['t','te'],['a','rr','active'],['rr','rre','active']], note:"Insert <b>CAR$</b>: C→A already exist — reuse them! Add only R→$. Shared prefixes cost nothing extra."},
          {nodes:[{id:'r',x:220,y:30,label:'•'},{id:'c',x:150,y:90,label:'C',state:'done'},{id:'a',x:150,y:150,label:'A',state:'done'},{id:'t',x:95,y:215,label:'T',state:'done'},{id:'te',x:95,y:275,label:'$'},{id:'rr',x:210,y:215,label:'R',state:'done'},{id:'rre',x:210,y:275,label:'$'},{id:'d2',x:320,y:90,label:'D',state:'active'},{id:'o',x:320,y:150,label:'O',state:'active'},{id:'g',x:320,y:215,label:'G',state:'active'},{id:'ge',x:320,y:275,label:'$',state:'done'}], edges:[['r','c','done'],['c','a','done'],['a','t','done'],['t','te'],['a','rr','done'],['rr','rre'],['r','d2','active'],['d2','o','active'],['o','g','active'],['g','ge','active']], note:"Insert <b>DOG$</b>: no shared prefix with C-words, so a fresh branch grows from the root."},
          {nodes:[{id:'r',x:220,y:30,label:'•',state:'active'},{id:'c',x:150,y:90,label:'C',state:'active'},{id:'a',x:150,y:150,label:'A',state:'active'},{id:'t',x:95,y:215,label:'T',state:'frontier'},{id:'te',x:95,y:275,label:'$'},{id:'rr',x:210,y:215,label:'R',state:'frontier'},{id:'rre',x:210,y:275,label:'$'},{id:'d2',x:320,y:90,label:'D'},{id:'o',x:320,y:150,label:'O'},{id:'g',x:320,y:215,label:'G'},{id:'ge',x:320,y:275,label:'$'}], edges:[['r','c','active'],['c','a','active'],['a','t','active'],['t','te'],['a','rr','active'],['rr','rre']], note:"<b>Prefix search 'CA'</b>: walk C→A in O(|prefix|). All words in the subtree share this prefix: CAT and CAR. Return the subtree in O(|prefix| + output size)."},
        ]},
      {t:'cx', items:[{k:'Insert / Search',v:'O(L)',cls:'t',note:'L = word length'},{k:'Prefix match',v:'O(L + U)',cls:'t',note:'U = output chars'},{k:'Space',v:'O(Σ·N)',cls:'s',note:'Σ = alphabet size'}]},
      {t:'insight', title:"Why tries beat hash tables for prefixes", x:"A trie's lookup time depends on the <b>word length</b>, not the number of words stored. And unlike a hash table, it answers <b>prefix</b> queries ('all words starting with CA') for free — just descend and collect. Hash tables can't do prefix search efficiently."},
      {t:'check', q:"A trie over an alphabet of size Σ can store a child pointer array of size Σ per node. What's the trade-off vs. storing children in a list?", a:"<b>Array children:</b> O(1) child lookup but O(Σ) space per node (wasteful for sparse nodes). <b>List/map children:</b> compact space but slower lookup. It's the classic time-vs-space dial, tuned to your alphabet size and density."},
    ]},
    { id:'suffix', title:'Suffix Tries & Suffix Trees', icon:'🧬', blocks:[
      {t:'p', x:"Insert <b>every suffix</b> of a single string T into a trie (each ending with $) and you get a <span class='kw'>suffix trie</span> — a structure that can answer 'does pattern P occur in text T?' by just walking P from the root in O(|P|) time, regardless of |T|."},
      {t:'p', x:"The insight: every substring of T is a <b>prefix of some suffix</b> of T. So any substring search becomes a simple root-to-node walk in the suffix trie. Watch a suffix trie for <b>T = 'ABAB$'</b>:"},
      {t:'demo', kind:'tree', accent:'#3ee0ff', w:460, h:300,
        frames:[
          {nodes:[{id:'r',x:230,y:30,label:'•'},{id:'a1',x:110,y:90,label:'A'},{id:'b1',x:350,y:90,label:'B'}], edges:[['r','a1'],['r','b1']], note:"Root has two children: A (for suffixes starting with A) and B (for suffixes starting with B). T='ABAB$' has suffixes: ABAB$, BAB$, AB$, B$, $."},
          {nodes:[{id:'r',x:230,y:30,label:'•'},{id:'a1',x:110,y:90,label:'A'},{id:'b1',x:350,y:90,label:'B'},{id:'ab1',x:60,y:160,label:'B'},{id:'a2',x:160,y:160,label:'$'},{id:'bb1',x:300,y:160,label:'A'},{id:'b2',x:400,y:160,label:'$'}], edges:[['r','a1'],['r','b1'],['a1','ab1'],['a1','a2'],['b1','bb1'],['b1','b2']], note:"Expand one more level. Path A→B represents prefix 'AB' shared by both ABAB$ and AB$."},
          {nodes:[{id:'r',x:230,y:30,label:'•',state:'active'},{id:'a1',x:110,y:90,label:'A',state:'active'},{id:'b1',x:350,y:90,label:'B'},{id:'ab1',x:60,y:160,label:'B',state:'active'},{id:'a2',x:160,y:160,label:'$'},{id:'bb1',x:300,y:160,label:'A'},{id:'b2',x:400,y:160,label:'$'},{id:'aba',x:30,y:230,label:'A',state:'frontier'},{id:'abs',x:95,y:230,label:'$'}], edges:[['r','a1','active'],['r','b1'],['a1','ab1','active'],['a1','a2'],['b1','bb1'],['b1','b2'],['ab1','aba','active'],['ab1','abs']], note:"<b>Search 'ABA'</b>: walk A→B→A. Node found — 'ABA' occurs in T. The descendants show exactly where. O(|P|) regardless of |T|."},
        ]},
      {t:'p', x:"A suffix trie can have <b>O(n²)</b> nodes. The <span class='kw'>suffix tree</span> fixes this by <b>compressing</b> every non-branching chain of nodes into a single edge labelled with a substring — squeezing down to <b>O(n)</b> space."},
      {t:'cx', items:[{k:'Suffix trie space',v:'O(n²)',cls:'s',note:'all suffixes'},{k:'Suffix tree space',v:'O(n)',cls:'s',note:'path-compressed'},{k:'Pattern search',v:'O(|P|)',cls:'t'}]},
      {t:'h', x:'Applications of the suffix tree'},
      {t:'p', x:"With a suffix tree you can solve in <b>linear time</b>: finding the <b>longest repeated substring</b> (deepest internal node), the <b>longest common substring of two strings</b> (build a joint suffix tree, find the deepest node with descendants from both strings), and <b>all occurrences</b> of a pattern P (walk to P's node, collect the subtree leaves — each leaf is an occurrence position)."},
      {t:'insight', title:'Compression is the whole trick', x:"Suffix tree = suffix trie with every chain of single-child nodes collapsed into one edge. Same search power, linear space. Specialised algorithms (Ukkonen's) even build it in O(n) time — but the build algorithm is <i>not</i> examinable, only the uses."},
      {t:'check', q:"Why does a suffix tree make substring search so fast, regardless of text length?", a:"Every substring of T is a <b>prefix of some suffix</b> of T — and all suffixes live in the tree. So matching a pattern P is just walking P down from the root in <b>O(|P|)</b> time, completely independent of how long T is."},
    ]},
  ]
};

/* ---------- WEEK 9 · Search Trees ---------- */
WEEK_LESSONS[9] = {
  hook: "A binary search tree gives you O(log N) lookups — but only if it stays balanced. This week is the art of keeping trees from degenerating into slow, lanky lists.",
  chapters: [
    { id:'bst', title:'Binary Search Trees & Deletion', icon:'🌳', blocks:[
      {t:'p', x:"A <span class='kw'>binary search tree</span> keeps its keys ordered: for every node, all keys in the <b>left</b> subtree are smaller and all keys in the <b>right</b> are larger. That ordering turns search, insert, and delete into a single root-to-leaf walk."},
      {t:'cx', items:[{k:'Balanced',v:'O(log N)',cls:'t',note:'search/insert/delete'},{k:'Degenerate',v:'O(N)',cls:'s',note:'a glorified linked list'}]},
      {t:'warn', title:'The danger: degeneration', x:"Insert keys in sorted order (10, 20, 30, …) into a plain BST and it grows into a straight line — height N, lookups O(N). All the benefit evaporates. The fix is <b>self-balancing</b> trees."},
      {t:'h', x:'BST Deletion — three cases'},
      {t:'p', x:"Deletion is the trickiest BST operation. There are three cases depending on the node's children:"},
      {t:'demo', kind:'tree', accent:'#3ee0ff', w:440, h:300,
        frames:[
          {nodes:[{id:'r',x:220,y:40,label:'15'},{id:'b',x:130,y:110,label:'8'},{id:'c',x:310,y:110,label:'20'},{id:'d',x:80,y:185,label:'5'},{id:'e',x:175,y:185,label:'12'},{id:'f',x:270,y:185,label:'18'},{id:'g',x:360,y:185,label:'25'},{id:'h',x:130,y:260,label:'10'},{id:'k',x:220,y:260,label:'14'}], edges:[['r','b'],['r','c'],['b','d'],['b','e'],['c','f'],['c','g'],['e','h'],['e','k']], note:"A BST. We'll delete three nodes, one of each case. First: delete <b>5</b> (leaf node)."},
          {nodes:[{id:'r',x:220,y:40,label:'15'},{id:'b',x:130,y:110,label:'8'},{id:'c',x:310,y:110,label:'20'},{id:'e',x:175,y:185,label:'12'},{id:'f',x:270,y:185,label:'18'},{id:'g',x:360,y:185,label:'25'},{id:'h',x:130,y:260,label:'10'},{id:'k',x:220,y:260,label:'14'}], edges:[['r','b'],['r','c'],['b','e'],['c','f'],['c','g'],['e','h'],['e','k']], note:"<b>Case 1 — leaf:</b> just delete it. Node 5 had no children, so simply remove it. O(1) pointer surgery."},
          {nodes:[{id:'r',x:220,y:40,label:'15'},{id:'b',x:130,y:110,label:'8',state:'compare'},{id:'c',x:310,y:110,label:'20'},{id:'e',x:175,y:185,label:'12',state:'active'},{id:'f',x:270,y:185,label:'18'},{id:'g',x:360,y:185,label:'25'},{id:'h',x:130,y:260,label:'10'},{id:'k',x:220,y:260,label:'14'}], edges:[['r','b'],['r','c'],['b','e','active'],['c','f'],['c','g'],['e','h'],['e','k']], note:"Now delete <b>8</b> (one child: 12). <b>Case 2:</b> promote the only child — replace 8 with 12 in 15's left slot."},
          {nodes:[{id:'r',x:220,y:40,label:'15'},{id:'e',x:130,y:110,label:'12',state:'done'},{id:'c',x:310,y:110,label:'20'},{id:'f',x:270,y:185,label:'18'},{id:'g',x:360,y:185,label:'25'},{id:'h',x:80,y:185,label:'10'},{id:'k',x:180,y:185,label:'14'}], edges:[['r','e','done'],['r','c'],['c','f'],['c','g'],['e','h'],['e','k']], note:"12 promoted. BST property preserved (10 &lt; 12 &lt; 14, all &lt; 15). Now delete <b>15</b> (two children)."},
          {nodes:[{id:'r2',x:220,y:40,label:'18',state:'done'},{id:'e',x:130,y:110,label:'12'},{id:'c',x:310,y:110,label:'20'},{id:'f2',x:270,y:185,label:'19',state:'compare'},{id:'g',x:360,y:185,label:'25'},{id:'h',x:80,y:185,label:'10'},{id:'k',x:180,y:185,label:'14'}], edges:[['r2','e','done'],['r2','c'],['c','f2'],['c','g'],['e','h'],['e','k']], note:"<b>Case 3 — two children:</b> replace 15 with its <b>in-order successor</b> (smallest value in right subtree = 18). Delete 18 from its original position (it had at most one right child, so Case 1 or 2 applies there)."},
        ]},
      {t:'insight', title:'In-order successor is always the leftmost of the right subtree', x:"For a node with two children, go right once, then left as far as possible. That node has no left child (Case 1 or 2), so its deletion is simple. Then copy its key to replace the deleted node. BST property is always maintained."},
      {t:'check', q:"Why doesn't BST deletion in Case 3 require a rotation?", a:"Because you replace the deleted node's key with its in-order successor (or predecessor) — which has no left child. Deleting <i>that</i> node is Case 1 or 2, which never violates BST order. No rebalancing needed <i>for correctness</i> (though you may need it later for <i>balance</i> in AVL trees)."},
    ]},
    { id:'avl', title:'AVL Trees: All Four Rotations', icon:'⚖️', blocks:[
      {t:'p', x:"An <span class='kw'>AVL tree</span> is a BST that keeps every node's <b>balance factor</b> — the height difference between its subtrees — in {−1, 0, +1}. The moment an insertion violates this, a <b>rotation</b> restores balance. There are four imbalance cases:"},
      {t:'code', x:"# Balance factor: BF(node) = height(left) - height(right)\n# Violation: BF ≥ +2 or BF ≤ −2\n\nLeft-Left  (BF=+2 at node, BF≥0 at node.left)  → single right rotation\nLeft-Right (BF=+2 at node, BF<0  at node.left)  → left rotation on child, then right\nRight-Right(BF=−2 at node, BF≤0 at node.right) → single left rotation\nRight-Left (BF=−2 at node, BF>0  at node.right) → right rotation on child, then left"},
      {t:'demo', kind:'tree', accent:'#b49bff', w:440, h:300,
        frames:[
          {nodes:[{id:'a',x:220,y:60,label:'30',bf:0,state:'done'}], edges:[], note:"Insert <b>30</b> — root. Balance factor 0. All calm."},
          {nodes:[{id:'a',x:220,y:60,label:'30',bf:'+1'},{id:'b',x:140,y:140,label:'20',bf:0,state:'active'}], edges:[['a','b','active']], note:"Insert <b>20</b> — goes left. 30's BF tips to +1. Still within {−1,0,+1}. OK."},
          {nodes:[{id:'a',x:220,y:60,label:'30',bf:'+2',state:'bad'},{id:'b',x:140,y:140,label:'20',bf:'+1'},{id:'c',x:70,y:220,label:'10',bf:0,state:'active'}], edges:[['a','b','done'],['b','c','active']], note:"Insert <b>10</b> — left of 20. Node 30 has BF=+2: <b>Left-Left case</b>. Right-rotate around 30."},
          {nodes:[{id:'b',x:220,y:70,label:'20',bf:0,state:'done'},{id:'c',x:140,y:150,label:'10',bf:0,state:'done'},{id:'a',x:300,y:150,label:'30',bf:0,state:'done'}], edges:[['b','c','done'],['b','a','done']], note:"<b>LL fix → single right rotation:</b> 20 rises to root, 10 and 30 become its children. Height drops from 3 to 2. All BF = 0. ✔"},
        ]},
      {t:'demo', kind:'tree', accent:'#b49bff', w:440, h:300,
        frames:[
          {nodes:[{id:'a',x:220,y:60,label:'30',bf:'+1'},{id:'b',x:130,y:140,label:'10',bf:0,state:'active'}], edges:[['a','b']], note:"Now insert <b>20</b> after [30,10]. 20 goes right of 10 — a <b>Left-Right</b> case. BF of 30 = +2, but 10's BF = −1 (right-heavy child)."},
          {nodes:[{id:'a',x:220,y:60,label:'30',bf:'+2',state:'bad'},{id:'b',x:130,y:140,label:'10',bf:'-1'},{id:'c',x:195,y:220,label:'20',bf:0,state:'active'}], edges:[['a','b','done'],['b','c','active']], note:"<b>LR imbalance:</b> first do a <b>left rotation on 10</b> (the imbalanced child) to turn it into an LL case."},
          {nodes:[{id:'a',x:220,y:60,label:'30',bf:'+2',state:'bad'},{id:'c',x:130,y:140,label:'20',bf:'+1',state:'active'},{id:'b',x:65,y:220,label:'10',bf:0}], edges:[['a','c','active'],['c','b']], note:"After left-rotation on 10: structure is now LL (30 has BF +2, left child 20 has BF +1). Now right-rotate around 30."},
          {nodes:[{id:'c',x:220,y:70,label:'20',bf:0,state:'done'},{id:'b',x:130,y:150,label:'10',bf:0,state:'done'},{id:'a',x:310,y:150,label:'30',bf:0,state:'done'}], edges:[['c','b','done'],['c','a','done']], note:"<b>LR fix → double rotation (left then right):</b> 20 becomes root. All balanced. ✔ Note: Right-Right and Right-Left are the mirror images."},
        ]},
      {t:'cx', items:[{k:'Height',v:'O(log N)',cls:'t',note:'guaranteed balanced'},{k:'All ops',v:'O(log N)',cls:'t'},{k:'Rotations',v:'1 or 2 per insert',note:'O(1) each'}]},
      {t:'insight', title:'Balance is a height guarantee', x:"By forcing balance factors into {−1,0,+1}, AVL trees keep height ≤ ~1.44·log N — so search, insert, and delete are <b>always</b> O(log N), even on adversarial insert orders. LL/RR need one rotation; LR/RL need two."},
      {t:'check', q:"After an AVL insertion causes an LR imbalance, why are two rotations needed instead of one?", a:"An LR imbalance means the heavy subtree 'bends the wrong way' — a single right rotation would make things worse. The first rotation (left on the child) straightens it into an LL shape; the second rotation (right on the node) then fixes that LL case. You need to <i>align</i> before you can <i>lift</i>."},
    ]},
    { id:'rbt', title:'2-3 Trees & Red-Black Trees', icon:'🔴', blocks:[
      {t:'p', x:"A <span class='kw'>2-3 tree</span> takes a different route to balance: nodes may hold <b>one key with two children</b> (2-node) or <b>two keys with three children</b> (3-node), and <i>all leaves sit at the same depth</i> — perfect balance by construction. Growth happens by splitting overfull nodes upward."},
      {t:'p', x:"<span class='kw'>Red-black trees</span> are a binary encoding of 2-3 trees: each node is coloured red or black, and a handful of colour rules guarantee the longest root-to-leaf path is at most twice the shortest — keeping height O(log N)."},
      {t:'code', x:"Red-Black tree invariants:\n1. Every node is red or black.\n2. The root is black.\n3. Every leaf (nil) is black.\n4. If a node is red, both its children are black.\n5. All paths from a node to its nil descendants contain the same number of black nodes."},
      {t:'insight', title:'AVL vs Red-Black — the real-world trade-off', x:"<b>AVL</b> trees are more rigidly balanced → faster lookups, but more rotations on insert/delete. <b>Red-black</b> trees balance more loosely → slightly taller, but fewer restructurings, so faster updates. That's why language libraries (C++ map, Java TreeMap) pick red-black: update-heavy workloads."},
      {t:'check', q:"Both AVL and red-black trees guarantee O(log N) operations. Why do most standard libraries choose red-black?", a:"Red-black trees require <b>fewer rotations per update</b> on average (at most a constant, with less rebalancing than AVL). For the insert/delete-heavy workloads typical of general-purpose maps, that makes them faster overall, even though AVL trees offer marginally quicker pure lookups."},
    ]},
  ]
};
