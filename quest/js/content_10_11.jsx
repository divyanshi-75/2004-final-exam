/* ============================================================
   COURSE CONTENT — Weeks 10–11
   ============================================================ */
window.WEEK_LESSONS = window.WEEK_LESSONS || {};

/* ---------- WEEK 10 · Network Flow ---------- */
WEEK_LESSONS[10] = {
  hook: "How much water can you push through a network of pipes? This single question — maximum flow — secretly solves matching, scheduling, and segmentation problems.",
  chapters: [
    { id:'flow', title:'Flow Networks & Max-Flow', icon:'🚰', blocks:[
      {t:'p', x:"A <span class='kw'>flow network</span> is a directed graph where each edge has a <b>capacity</b>, plus a designated <b>source</b> s (produces flow) and <b>sink</b> t (absorbs it). A valid <b>flow</b> obeys two rules: never exceed any edge's capacity, and at every intermediate vertex flow in = flow out (conservation)."},
      {t:'p', x:"The <span class='kw'>maximum-flow problem</span> asks: what's the greatest total flow you can push from s to t? It models traffic, bandwidth, supply chains — and many problems that look nothing like pipes."},
      {t:'analogy', title:'Pipes and water', x:"Picture water mains. Each pipe has a max throughput. You're pumping from a reservoir (s) to a city (t). Max-flow is the city's peak water supply — limited by the network's tightest bottleneck."},
      {t:'h', x:'The residual network'},
      {t:'p', x:"The key concept: the <span class='kw'>residual network</span> G_f shows, for each edge, how much more flow can be pushed. If an edge (u,v) has capacity c and currently carries flow f, the residual has: a <b>forward</b> edge (u,v) with capacity c−f (remaining room), and a <b>backward</b> edge (v,u) with capacity f (can undo this much). The backward edge is what lets the algorithm correct earlier choices."},
      {t:'demo', kind:'graph', accent:'#5eead4', w:400, h:240, directed:true,
        nodes:[{id:'S',x:45,y:120,label:'S'},{id:'A',x:185,y:55,label:'A'},{id:'B',x:185,y:185,label:'B'},{id:'T',x:345,y:120,label:'T'}],
        edges:[{u:'S',v:'A'},{u:'S',v:'B'},{u:'A',v:'B'},{u:'A',v:'T'},{u:'B',v:'T'}],
        frames:[
          {edgeLabel:{'S-A':'0/3','S-B':'0/2','A-B':'0/1','A-T':'0/2','B-T':'0/3'}, note:"Initial state: all flows = 0. Each edge shows flow/capacity. Find any augmenting path s→t with spare capacity."},
          {nodeState:{S:'active',A:'active',T:'active'}, edgeState:{'S-A':'active','A-T':'active'}, edgeLabel:{'S-A':'2/3','S-B':'0/2','A-B':'0/1','A-T':'2/2','B-T':'0/3'}, note:"Augment along <b>S→A→T</b>: bottleneck = A→T (cap 2). Push <b>2</b> units. A→T is now saturated."},
          {nodeState:{S:'active',B:'active',T:'active'}, edgeState:{'S-B':'active','B-T':'active'}, edgeLabel:{'S-A':'2/3','S-B':'2/2','A-B':'0/1','A-T':'2/2','B-T':'2/3'}, note:"Augment along <b>S→B→T</b>: bottleneck = S→B (cap 2). Push <b>2</b> more. Total flow so far: 4."},
          {nodeState:{S:'active',A:'active',B:'active',T:'active'}, edgeState:{'S-A':'active','A-B':'active','B-T':'active'}, edgeLabel:{'S-A':'3/3','S-B':'2/2','A-B':'1/1','A-T':'2/2','B-T':'3/3'}, note:"Last augmenting path: <b>S→A→B→T</b>, bottleneck A→B (cap 1). Push <b>1</b>. Total flow: <b>5</b>."},
          {nodeState:{S:'bad'}, edgeState:{'S-A':'bad','S-B':'bad'}, edgeLabel:{'S-A':'3/3','S-B':'2/2','A-B':'1/1','A-T':'2/2','B-T':'3/3'}, note:"No augmenting path remains — both edges out of S are saturated. <b>Max flow = 5</b>, equalling the min cut {S} | rest (3+2). ✔"},
        ]},
      {t:'cx', items:[{k:'Ford-Fulkerson',v:'O(E · f)',cls:'t',note:'f = max-flow value'},{k:'Edmonds-Karp',v:'O(V·E²)',cls:'t',note:'BFS augmentation'},{k:'Finds',v:'Min cut too',note:'see next chapter'}]},
      {t:'check', q:"Why does Ford-Fulkerson need backward (residual) edges to be correct?", a:"They let the algorithm <b>reroute</b> flow it committed earlier. An augmenting path can push flow <i>backward</i> along an existing edge, effectively cancelling a suboptimal choice and redirecting it. Without residual edges, greedy path-picking can get stuck below the true maximum."},
    ]},
    { id:'edmonds', title:"Edmonds-Karp: BFS Augmentation", icon:'🔁', blocks:[
      {t:'p', x:"Ford-Fulkerson with arbitrary path choices can run forever on irrational capacities. <span class='kw'>Edmonds-Karp</span> fixes this by always choosing the <b>shortest augmenting path</b> (fewest edges, found by BFS). This guarantees <b>O(V·E²)</b> time — polynomial regardless of capacities."},
      {t:'p', x:"The intuition: BFS augmentation ensures the shortest-path distances in the residual network never decrease. This bounds the number of augmentations to O(V·E), and each augmentation costs O(E), giving O(V·E²) total."},
      {t:'demo', kind:'graph', accent:'#5eead4', w:460, h:260, directed:true,
        nodes:[{id:'S',x:40,y:130,label:'S'},{id:'A',x:165,y:55,label:'A'},{id:'B',x:165,y:200,label:'B'},{id:'C',x:290,y:55,label:'C'},{id:'D',x:290,y:200,label:'D'},{id:'T',x:420,y:130,label:'T'}],
        edges:[{u:'S',v:'A'},{u:'S',v:'B'},{u:'A',v:'C'},{u:'A',v:'D'},{u:'B',v:'D'},{u:'C',v:'T'},{u:'D',v:'T'}],
        frames:[
          {edgeLabel:{'S-A':'0/3','S-B':'0/2','A-C':'0/3','A-D':'0/1','B-D':'0/2','C-T':'0/2','D-T':'0/3'}, note:"BFS from S finds the <b>shortest path by edges</b>. Here the 2-hop paths S→A→C are ignored until 3-hop paths are needed — but they're all the same length (3 edges here)."},
          {nodeState:{S:'active',A:'active',C:'active',T:'active'}, edgeState:{'S-A':'active','A-C':'active','C-T':'active'}, edgeLabel:{'S-A':'2/3','S-B':'0/2','A-C':'2/3','A-D':'0/1','B-D':'0/2','C-T':'2/2','D-T':'0/3'}, note:"BFS finds S→A→C→T (3 edges). Bottleneck = C→T (cap 2). Push <b>2</b>. C→T saturated."},
          {nodeState:{S:'active',B:'active',D:'active',T:'active'}, edgeState:{'S-B':'active','B-D':'active','D-T':'active'}, edgeLabel:{'S-A':'2/3','S-B':'2/2','A-C':'2/3','A-D':'0/1','B-D':'2/2','C-T':'2/2','D-T':'2/3'}, note:"BFS: S→B→D→T (3 edges). Push <b>2</b>. Total: 4."},
          {nodeState:{S:'active',A:'active',D:'active',T:'active'}, edgeState:{'S-A':'active','A-D':'active','D-T':'active'}, edgeLabel:{'S-A':'3/3','S-B':'2/2','A-C':'2/3','A-D':'1/1','B-D':'2/2','C-T':'2/2','D-T':'3/3'}, note:"BFS: S→A→D→T (3 edges). Push <b>1</b>. Total flow: <b>5</b>. No more augmenting paths. Max flow = 5. ✔"},
        ]},
      {t:'insight', title:'Why BFS is the right choice', x:"BFS always finds the shortest s→t path in the residual network. This monotonicity property — distances never shrink — is what gives Edmonds-Karp its polynomial guarantee. DFS (arbitrary path choice) can take O(f) augmentations where f is the max-flow value, which can be exponential."},
    ]},
    { id:'mincut', title:'The Min-Cut Max-Flow Theorem', icon:'✂️', blocks:[
      {t:'p', x:"A <span class='kw'>cut</span> splits the vertices into two sides — source-side S and sink-side T — and its capacity is the total capacity of edges crossing from S to T. The <b>minimum cut</b> is the cheapest such barrier separating s from t."},
      {t:'insight', title:'The theorem (a cornerstone result)', x:"<b>The maximum flow equals the minimum cut capacity.</b> The most you can push through is exactly the capacity of the network's tightest bottleneck. When Ford-Fulkerson stops, the saturated edges <i>are</i> a min-cut — that's also why the algorithm is provably correct."},
      {t:'p', x:"To find the min cut after running max flow: from the source s, do a BFS/DFS in the <b>residual network</b> using only edges with positive residual capacity. Vertices reachable from s form the source side S; the rest form the sink side T. All saturated edges from S to T form the min cut."},
      {t:'demo', kind:'graph', accent:'#5eead4', w:400, h:240, directed:true,
        nodes:[{id:'S',x:45,y:120,label:'S'},{id:'A',x:185,y:55,label:'A'},{id:'B',x:185,y:185,label:'B'},{id:'T',x:345,y:120,label:'T'}],
        edges:[{u:'S',v:'A'},{u:'S',v:'B'},{u:'A',v:'B'},{u:'A',v:'T'},{u:'B',v:'T'}],
        frames:[
          {edgeLabel:{'S-A':'3/3','S-B':'2/2','A-B':'1/1','A-T':'2/2','B-T':'3/3'}, note:"Max flow = 5 achieved. Now find the min cut: from S, which vertices are reachable in the residual graph (i.e., via edges with residual capacity > 0)?"},
          {nodeState:{S:'done',A:'compare'}, edgeState:{'S-A':'compare'}, edgeLabel:{'S-A':'3/3 (res=0)','S-B':'2/2 (res=0)'}, note:"S→A: residual = 3−3 = 0. <b>Cannot cross.</b>  S→B: residual = 2−2 = 0. <b>Cannot cross.</b> Only S is reachable from S in the residual network."},
          {nodeState:{S:'done',A:'bad',B:'bad',T:'bad'}, edgeState:{'S-A':'bad','S-B':'bad'}, note:"Min cut = {S} vs {A,B,T}. Cut edges: S→A (cap 3) + S→B (cap 2) = <b>5</b>. Min cut capacity = Max flow. ✔ These are the 'bottleneck' edges limiting the whole network."},
        ]},
      {t:'check', q:"Ford-Fulkerson terminates when no augmenting path exists. How does that prove the flow is maximum?", a:"When no augmenting path remains, the saturated edges form a <b>cut</b> whose capacity equals the current flow. Since <i>every</i> flow is ≤ <i>every</i> cut, a flow that equals some cut must be maximum — and that cut must be minimum. That's the min-cut max-flow theorem in action."},
    ]},
    { id:'projsel', title:'Project Selection: Flow in Disguise', icon:'📋', blocks:[
      {t:'p', x:"<b>Project selection:</b> each project has a profit or cost, and projects have dependencies ('to do project A you must also do project B'). Choose a subset maximising net profit. This looks nothing like flow — but it reduces to <b>min-cut</b>."},
      {t:'p', x:"<b>Construction:</b> add edges from source s to each profitable project (capacity = profit), from each costly resource to sink t (capacity = cost), and from each project to its required resources (capacity ∞). The min cut then separates 'selected' from 'not selected' projects, and the cut capacity equals the total costs and foregone profits — minimising loss."},
      {t:'insight', title:'The meta-lesson: reduction is the superpower', x:"<b>Reduction</b> transforms an unfamiliar problem into one you already know how to solve. The exam often rewards recognising 'this is secretly max-flow' more than remembering the algorithm. Key reduction patterns: bipartite matching, project selection, image segmentation — all are min-cut problems."},
      {t:'check', q:"In the project-selection flow network, why must dependency edges have capacity ∞?", a:"If you select project A, you <i>must</i> also pay for resource B (the dependency). An infinite-capacity edge from A to B ensures the min-cut never cuts this edge — it would cost too much — so any feasible cut that selects A automatically includes B."},
    ]},
  ]
};

/* ---------- WEEK 11 · Circulation with Demands ---------- */
WEEK_LESSONS[11] = {
  hook: "Max-flow is a master key. Reframe a problem as a flow network and suddenly matching, scheduling, and supply problems all fall to the same algorithm.",
  chapters: [
    { id:'match', title:'Maximum Bipartite Matching', icon:'💞', blocks:[
      {t:'p', x:"A <span class='kw'>bipartite graph</span> has two groups with edges only <i>between</i> them — applicants and jobs, students and projects. A <b>matching</b> pairs them up so no one is double-booked; the <b>maximum matching</b> pairs as many as possible."},
      {t:'demo', kind:'graph', accent:'#ff9be0', w:420, h:240,
        nodes:[{id:'L1',x:90,y:50,label:'1'},{id:'L2',x:90,y:120,label:'2'},{id:'L3',x:90,y:190,label:'3'},{id:'R1',x:330,y:50,label:'A'},{id:'R2',x:330,y:120,label:'B'},{id:'R3',x:330,y:190,label:'C'}],
        edges:[{u:'L1',v:'R1'},{u:'L1',v:'R2'},{u:'L2',v:'R1'},{u:'L2',v:'R3'},{u:'L3',v:'R2'},{u:'L3',v:'R3'}],
        frames:[
          {note:"Three applicants (1,2,3), three jobs (A,B,C). Each edge = 'willing to take'. Goal: fill the most jobs."},
          {nodeState:{L1:'done',R1:'done'}, edgeState:{'L1-R1':'done'}, note:"Match <b>1–A</b>. One pair locked in."},
          {nodeState:{L1:'done',R1:'done',L2:'done',R3:'done'}, edgeState:{'L1-R1':'done','L2-R3':'done'}, note:"Match <b>2–C</b> (2 also liked A, but A's taken — pick a free option)."},
          {nodeState:{L1:'done',R1:'done',L2:'done',R3:'done',L3:'done',R2:'done'}, edgeState:{'L1-R1':'done','L2-R3':'done','L3-R2':'done'}, note:"Match <b>3–B</b>. <b>Perfect matching of size 3</b> — everyone placed. ✔"},
        ]},
      {t:'h', x:'Solving it with max-flow'},
      {t:'p', x:"The trick: add a <b>super-source</b> s with capacity-1 edges to every left vertex, and a <b>super-sink</b> t with capacity-1 edges from every right vertex. Give each original edge capacity 1. The <span class='kw'>maximum flow equals the maximum matching</span> — each unit of flow is one pairing, and the capacity-1 edges guarantee nobody is matched twice."},
      {t:'demo', kind:'graph', accent:'#ff9be0', w:440, h:240, directed:true,
        nodes:[{id:'S',x:30,y:120,label:'s'},{id:'L1',x:135,y:50,label:'1'},{id:'L2',x:135,y:120,label:'2'},{id:'L3',x:135,y:190,label:'3'},{id:'R1',x:295,y:50,label:'A'},{id:'R2',x:295,y:120,label:'B'},{id:'R3',x:295,y:190,label:'C'},{id:'T',x:410,y:120,label:'t'}],
        edges:[{u:'S',v:'L1'},{u:'S',v:'L2'},{u:'S',v:'L3'},{u:'L1',v:'R1'},{u:'L1',v:'R2'},{u:'L2',v:'R1'},{u:'L2',v:'R3'},{u:'L3',v:'R2'},{u:'L3',v:'R3'},{u:'R1',v:'T'},{u:'R2',v:'T'},{u:'R3',v:'T'}],
        frames:[
          {edgeLabel:{'S-L1':'0/1','S-L2':'0/1','S-L3':'0/1','L1-R1':'0/1','L1-R2':'0/1','L2-R1':'0/1','L2-R3':'0/1','L3-R2':'0/1','L3-R3':'0/1','R1-T':'0/1','R2-T':'0/1','R3-T':'0/1'}, note:"Add super-source s and super-sink t. All edges have capacity 1 — each person and job is used at most once."},
          {edgeLabel:{'S-L1':'1/1','S-L2':'1/1','S-L3':'1/1','L1-R1':'1/1','L2-R3':'1/1','L3-R2':'1/1','R1-T':'1/1','R2-T':'1/1','R3-T':'1/1'}, nodeState:{S:'done',L1:'done',L2:'done',L3:'done',R1:'done',R2:'done',R3:'done',T:'done'}, note:"Max flow = <b>3</b>: three units flow through (1→A), (2→C), (3→B). The flow directly encodes the matching."},
        ]},
      {t:'insight', title:'Integer flows make it work', x:"Because all capacities are integers, Ford-Fulkerson produces an <b>integer-valued</b> max flow — every edge carries 0 or 1. That integrality is exactly what makes 'flow = matching' valid: you can't half-match someone."},
      {t:'check', q:"Why give every edge capacity exactly 1 in the matching-as-flow construction?", a:"Capacity 1 enforces the matching rule: each applicant sends at most 1 unit (one job) and each job receives at most 1 unit (one applicant). The integer max-flow then corresponds one-to-one with a valid maximum matching."},
    ]},
    { id:'circ', title:'Circulation with Demands', icon:'🔄', blocks:[
      {t:'p', x:"<span class='kw'>Circulation with demands</span> generalises flow: instead of one source and sink, every vertex has a <b>demand</b> d(v) — negative means it produces supply, positive means it consumes. The question flips from 'how much?' to <b>'is there a feasible flow at all?'</b>"},
      {t:'p', x:"You solve it by reduction: add a super-source feeding every supply node and a super-sink draining every demand node, then run max-flow. A feasible circulation exists <b>iff</b> that flow saturates all the added edges."},
      {t:'demo', kind:'graph', accent:'#ff9be0', w:460, h:260, directed:true,
        nodes:[{id:'A',x:100,y:130,label:'A\nd=−3'},{id:'B',x:230,y:60,label:'B\nd=−1'},{id:'C',x:360,y:60,label:'C\nd=+2'},{id:'D',x:360,y:200,label:'D\nd=+2'},{id:'S',x:45,y:60,label:'s',state:'active'},{id:'T',x:45,y:200,label:'t',state:'active'}],
        edges:[{u:'A',v:'C'},{u:'A',v:'D'},{u:'B',v:'C'},{u:'B',v:'D'}],
        frames:[
          {note:"Nodes A and B have demand −3 and −1 (they <b>supply</b> 3 and 1 units). Nodes C and D have demand +2 each (they <b>consume</b> 2 units). Supply = demand = 4. Is a feasible circulation possible?"},
          {nodeState:{S:'active',T:'active',A:'frontier',B:'frontier',C:'frontier',D:'frontier'}, edgeState:{'S-A':'active','S-B':'active','C-T':'active','D-T':'active'}, note:"Add super-source <b>s</b> connected to A (cap 3) and B (cap 1). Add super-sink <b>t</b> from C (cap 2) and D (cap 2). Run max-flow on this network."},
          {nodeState:{S:'done',T:'done',A:'done',B:'done',C:'done',D:'done'}, edgeState:{'S-A':'done','S-B':'done','C-T':'done','D-T':'done'}, note:"Max flow = <b>4</b> — all new edges are saturated. This means a feasible circulation <b>exists</b>. If max-flow &lt; sum of demands, no feasible circulation is possible."},
        ]},
      {t:'h', x:'Edges with lower bounds'},
      {t:'p', x:"Add <b>lower bounds</b> ℓ(u,v) to edges (the edge must carry <i>at least</i> ℓ units). The reduction: force ℓ units through upfront by adjusting demands at each endpoint (d(v) += ℓ, d(u) −= ℓ), and set the edge's effective capacity to cap − ℓ. This transforms a lower-bounded problem into a standard circulation problem."},
      {t:'code', x:"# Lower-bounded circulation reduction\nfor each edge (u,v) with lower bound l:\n    d[v] += l          # v now needs l more units\n    d[u] -= l          # u now supplies l more units\n    cap(u,v) -= l      # reduce available capacity by l\n\n# Now solve as ordinary circulation (no lower bounds)\n# A feasible lower-bounded flow exists iff the ordinary circulation is feasible"},
      {t:'insight', title:'The meta-lesson of the whole unit', x:"<b>Reduction</b> is the superpower. Survey design, airline crew scheduling, project selection — none mention flow, yet each becomes a flow network with the right construction. Recognising 'this is secretly max-flow' is the skill the exam rewards most."},
      {t:'check', q:"Circulation with demands has no single source or sink. How do we still use a max-flow algorithm to solve it?", a:"We <b>reduce</b> it: attach a super-source to every supply vertex and a super-sink to every demand vertex (capacities = the demands), then run ordinary max-flow. The original problem is feasible exactly when this flow saturates all the new edges — turning a new problem into one we've already solved."},
    ]},
    { id:'apps', title:'Flow Applications: A Field Guide', icon:'🗺️', blocks:[
      {t:'p', x:"The real exam skill is <b>recognising</b> which problems reduce to max-flow. Here is a cheat sheet of the most common reductions:"},
      {t:'code', x:"Problem                     → Network construction\n───────────────────────────────────────────────────────────\nBipartite matching          → s→left, right→t, all cap 1\nProject selection (profit)  → s→projects (profit), resources→t (cost)\n                               dep edges cap ∞\nImage segmentation          → pixels are nodes; neighbour edges = similarity\n                               s = foreground label, t = background label\nSurvey scheduling           → rows=tasks, cols=workers; feasibility via circ.\nCirculation (lower bounds)  → adjust demands, run ordinary circulation\nMax independent set         → bipartite graph → min vertex cover = max matching\n                               (König's theorem)"},
      {t:'p', x:"<b>Hall's theorem</b> also falls in this week: a bipartite graph has a perfect matching (every left vertex matched) <b>iff</b> for every subset S of left vertices, |N(S)| ≥ |S| (enough neighbours on the right). The max-flow proof of this is the cleanest."},
      {t:'insight', title:"If you can draw it as a graph and assign capacities, try max-flow", x:"The pattern for all reductions: (1) identify the 'supply' and 'demand' in the original problem, (2) map them to source/sink and edge capacities, (3) prove the max flow value equals the optimal answer. The hardest part is step 2 — the mapping — which comes from practice."},
      {t:'check', q:"Why does the min-cut / max-flow duality make max-flow so broadly useful?", a:"The min-cut is often a natural description of a <b>bottleneck or barrier</b> in the original problem (cheapest set of edges to cut, minimum cost to separate foreground from background, etc.). So computing a max-flow <i>also</i> finds the minimum barrier — two problems solved in one shot. That's the duality that makes it a universal tool."},
    ]},
  ]
};
