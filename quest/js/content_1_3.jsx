/* ============================================================
   COURSE CONTENT — Weeks 1–3  (authored from the real lectures)
   window.WEEK_LESSONS[week] = { hook, chapters:[{id,title,icon,blocks:[]}] }
   ============================================================ */
window.WEEK_LESSONS = window.WEEK_LESSONS || {};

/* ---------- WEEK 1 · Divide & Conquer ---------- */
WEEK_LESSONS[1] = {
  hook: "Every hard problem hides smaller copies of itself. Learn to split, solve, and stitch — then measure how fast your spell runs.",
  chapters: [
    { id:'dc', title:'The Divide & Conquer Spellbook', icon:'⚔️', blocks:[
      {t:'p', x:"Divide-and-conquer is the first big <span class='kw'>algorithm design paradigm</span> of the unit. The recipe is always three moves:"},
      {t:'p', x:"<b>1 · Divide</b> the problem into smaller subproblems of the same kind.&nbsp; <b>2 · Conquer</b> each subproblem by solving it recursively.&nbsp; <b>3 · Combine</b> the sub-answers into the answer for the whole."},
      {t:'analogy', title:'Think of it like a guild quest', x:"A dragon too big to fight alone? Split the party, each hero clears a wing of the dungeon, then you regroup and combine the loot. The magic is that each wing is just a <i>smaller version of the same dungeon</i>."},
      {t:'h', x:'The hook: multiplying faster than grade-school'},
      {t:'p', x:"Grade-school multiplication of two <b>n</b>-digit numbers costs <span class='kw'>O(n²)</span>. Splitting each number in half looks like it should help, but the naive split still needs <b>4</b> half-size multiplications — and that's <i>still</i> O(n²). No progress!"},
      {t:'p', x:"<b>Karatsuba's trick</b> computes the same result with only <b>3</b> half-size multiplications instead of 4, by cleverly reusing one product. That single saved multiplication drops the cost to about <span class='kw'>O(n^1.585)</span> — a genuine win, and the template for all D&C analysis to come."},
      {t:'insight', title:'Why fewer subproblems matters', x:"In D&C, the <b>number</b> of recursive calls (not their size) usually decides the exponent in your final complexity. Karatsuba going 4→3 is the whole ball game."},
      {t:'h', x:"Karatsuba's three multiplications"},
      {t:'p', x:"Given two n-digit numbers split as a = aM·10^(n/2) + aL and b = bM·10^(n/2) + bL, compute: <b>(1)</b> aM·bM, <b>(2)</b> aL·bL, <b>(3)</b> (aM+aL)·(bM+bL). Then the cross term is (3)−(1)−(2). Watch how three recursive calls reconstruct a·b:"},
      {t:'demo', kind:'array', accent:'#ffce4d', frames:[
        {title:'Split: a=1234, b=5678  (n=4, split at 2)', cells:[{v:'aM=12',state:'active'},{v:'aL=34',state:'compare'},{v:'bM=56',state:'active'},{v:'bL=78',state:'compare'}], note:"Split each 4-digit number at the midpoint. aM=12, aL=34, bM=56, bL=78."},
        {title:'Three recursive calls', cells:[{v:'(1)',state:'done'},{v:'12×56',state:'done'},{v:'=672',state:'done'}], aux:[{v:'(2)',state:'done'},{v:'34×78',state:'done'},{v:'=2652',state:'done'}], auxLabel:'call 2', note:"Call (1): aM×bM = 12×56 = 672.  Call (2): aL×bL = 34×78 = 2652. These are our two 'end' products."},
        {title:'Third call: (aM+aL)×(bM+bL)', cells:[{v:'12+34',state:'active'},{v:'=46',state:'active'},{v:'56+78',state:'active'},{v:'=134',state:'active'}], out:[{v:'46×134',state:'compare'},{v:'=6164',state:'compare'}], outLabel:'(3)', note:"Call (3): (12+34)×(56+78) = 46×134 = 6164. No new recursive depth — just one more half-size multiply."},
        {title:'Reconstruct: cross = (3)−(1)−(2)', cells:[{v:'6164',state:'done'},{v:'−672',state:'compare'},{v:'−2652',state:'compare'},{v:'=2840',state:'active'}], note:"Cross term = 6164 − 672 − 2652 = <b>2840</b>. This equals aM·bL + aL·bM — extracted with zero extra recursion!"},
        {title:'Final answer: sum the three pieces', cells:[{v:'672',state:'done',tag:'×10⁴'},{v:'2840',state:'active',tag:'×10²'},{v:'2652',state:'done',tag:'×10⁰'}], out:[{v:'6720000+284000+2652',state:'done'},{v:'=7006652',state:'done'}], outLabel:'1234×5678', note:"a·b = (1)×10⁴ + cross×10² + (2) = <b>7006652</b>. Verify: 1234 × 5678 = 7,006,652. ✔  Three half-size calls instead of four."},
      ]},
      {t:'check', q:"Merge sort splits an array in two, sorts each half, then merges. Which step is the 'combine'?", a:"<b>The merge.</b> Dividing is trivial (just split at the middle); the real work is combining two sorted halves into one sorted whole in O(N)."},
    ]},
    { id:'merge', title:'Worked Spell: Merge Sort', icon:'🪄', blocks:[
      {t:'p', x:"Merge sort is the cleanest D&C example. Split until pieces are size 1 (already sorted), then <b>merge</b> sorted runs upward. Step through the merge of two sorted halves:"},
      {t:'demo', kind:'array', accent:'#3ee0ff', frames:[
        {title:'Two sorted halves to merge', cells:[{v:2,state:'less'},{v:5,state:'less'},{v:8,state:'less'},{v:1,state:'greater'},{v:4,state:'greater'},{v:7,state:'greater'}], brackets:[{from:0,to:2,label:'left (sorted)',state:'less'},{from:3,to:5,label:'right (sorted)',state:'greater'}], out:[], outLabel:'merged', note:"Two sorted runs. Compare their <b>front</b> elements and take the smaller."},
        {cells:[{v:2,state:'active'},{v:5,state:'less'},{v:8,state:'less'},{v:1,state:'active'},{v:4,state:'greater'},{v:7,state:'greater'}], pointers:[{i:0,label:'L',state:'less'},{i:3,label:'R',state:'greater'}], out:[{v:1,state:'done'}], outLabel:'merged', note:"2 vs 1 → <b>1</b> is smaller. Take from right, advance R."},
        {cells:[{v:2,state:'active'},{v:5,state:'less'},{v:8,state:'less'},{v:1,muted:true},{v:4,state:'active'},{v:7,state:'greater'}], pointers:[{i:0,label:'L',state:'less'},{i:4,label:'R',state:'greater'}], out:[{v:1,state:'done'},{v:2,state:'done'}], outLabel:'merged', note:"2 vs 4 → <b>2</b>. Take from left, advance L."},
        {cells:[{v:2,muted:true},{v:5,state:'active'},{v:8,state:'less'},{v:1,muted:true},{v:4,state:'active'},{v:7,state:'greater'}], pointers:[{i:1,label:'L',state:'less'},{i:4,label:'R',state:'greater'}], out:[{v:1,state:'done'},{v:2,state:'done'},{v:4,state:'done'}], outLabel:'merged', note:"5 vs 4 → <b>4</b>. Take from right."},
        {cells:[{v:2,muted:true},{v:5,state:'done'},{v:8,state:'done'},{v:1,muted:true},{v:4,muted:true},{v:7,state:'done'}], out:[{v:1,state:'done'},{v:2,state:'done'},{v:4,state:'done'},{v:5,state:'done'},{v:7,state:'done'},{v:8,state:'done'}], outLabel:'merged', note:"Continue until one run empties, then copy the rest. <b>Merged in O(N).</b>"},
      ]},
      {t:'p', x:"Each level of recursion does O(N) total merging work, and there are <span class='kw'>log N</span> levels (halving each time). That's the famous <b>O(N log N)</b>."},
      {t:'cx', items:[{k:'Time',v:'O(N log N)',cls:'t',note:'all cases'},{k:'Space',v:'O(N)',cls:'s',note:'not in-place'},{k:'Stable?',v:'Yes',note:'keeps equal order'}]},
      {t:'p', x:"<b>Counting inversions</b> is a classic D&C application: count pairs (i, j) with i &lt; j but A[i] &gt; A[j]. Brute force is O(N²); adapted merge sort does it in O(N log N) by counting cross-inversions during each merge step. This is a common interview and exam question."},
      {t:'check', q:"During the merge-sort-based inversion count, when do you count inversions?", a:"When you take from the <b>right</b> half — that element is smaller than everything remaining in the left half, so it forms one inversion with each remaining left element. You add the count of remaining left elements at that moment."},
    ]},
    { id:'cx', title:'Reading the Runes: Big-O', icon:'📏', blocks:[
      {t:'p', x:"<span class='kw'>Asymptotic notation</span> describes how cost grows as input size <b>n</b> heads to infinity — ignoring constants and small terms, because those wash out at scale."},
      {t:'p', x:"<b>O(f)</b> — upper bound ('no worse than'). &nbsp;<b>Ω(f)</b> — lower bound ('no better than'). &nbsp;<b>Θ(f)</b> — tight bound (both at once)."},
      {t:'insight', title:'The formal definition (you WILL be asked this)', x:"T(n) = O(f(n)) means there exist constants <b>c &gt; 0</b> and <b>n₀</b> such that T(n) ≤ c·f(n) for all n ≥ n₀. To prove a bound, you literally produce a c and an n₀."},
      {t:'h', x:'Time, space, and "in-place"'},
      {t:'p', x:"<b>Time complexity</b> counts basic operations. <b>Space complexity</b> counts total memory; <b>auxiliary space</b> counts only the <i>extra</i> memory beyond the input. An algorithm is <span class='kw'>in-place</span> if it uses O(1) auxiliary space — like binary search, which just moves a couple of indices."},
      {t:'check', q:"Binary search runs in O(log N) time. What's its auxiliary space complexity?", a:"<b>O(1)</b> — it only keeps a few index variables (lo, hi, mid). It rewrites nothing and allocates nothing proportional to N, so it's in-place."},
    ]},
    { id:'rec', title:'Taming Recurrences', icon:'🌀', blocks:[
      {t:'p', x:"A recursive algorithm's cost is a <span class='kw'>recurrence relation</span> — it defines T(n) in terms of T of something smaller. Solving it gives the closed-form complexity."},
      {t:'code', x:"# power(a, n): compute a^n\nT(n) = T(n-1) + O(1)        # one recursive call, constant combine\n\n# unroll it:\nT(n) = T(n-1) + c\n     = T(n-2) + 2c\n     = ...\n     = T(0) + n·c   ⟶   O(n)"},
      {t:'p', x:"Now a <b>smarter</b> power function that squares: a^n = (a^(n/2))² halves the exponent each call, giving T(n) = T(n/2) + O(1) ⟶ <span class='kw'>O(log n)</span>. Same problem, exponentially faster — purely from a better recurrence."},
      {t:'insight', title:'Always sanity-check by substitution', x:"Guessed a solution? Plug it back into the recurrence and confirm both sides match. The lectures hammer this: a guess isn't a proof until substitution verifies it."},
      {t:'check', q:"You see T(n) = 2·T(n/2) + O(n). Which classic algorithm is this, and what does it solve to?", a:"That's <b>merge sort</b>: two half-size calls plus O(n) to merge. It solves to <b>O(n log n)</b>."},
    ]},
    { id:'master', title:'The Master Theorem', icon:'📜', blocks:[
      {t:'p', x:"Most D&C recurrences have the shape T(n) = <b>a</b>·T(n/b) + O(n^c) — <b>a</b> subproblems of size n/<b>b</b>, combined in O(n^c) work. The <span class='kw'>Master Theorem</span> gives a direct answer in three cases, all comparing n^(log_b a) (the 'subproblem' term) with n^c (the 'combine' term):"},
      {t:'code', x:"Case 1: c < log_b(a)   →  T(n) = Θ(n^(log_b a))   # subproblems dominate\nCase 2: c = log_b(a)   →  T(n) = Θ(n^c · log n)   # balanced — log factor\nCase 3: c > log_b(a)   →  T(n) = Θ(n^c)           # combine step dominates\n\nExamples:\n  Merge sort:    a=2, b=2, c=1  → log_2(2)=1 = c  → Case 2 → Θ(n log n)\n  Karatsuba:     a=3, b=2, c=1  → log_2(3)≈1.585 > 1 → Case 1 → Θ(n^1.585)\n  Binary search: a=1, b=2, c=0  → log_2(1)=0 = c  → Case 2 → Θ(log n)"},
      {t:'insight', title:'The Master Theorem is a shortcut, not magic', x:"It only applies when the recurrence has <i>exactly</i> the form T(n) = a·T(n/b) + Θ(n^c). Recurrences like T(n) = T(n-1) + … or ones with variable split sizes need telescoping or a different method. Always check the form before applying it."},
      {t:'warn', title:'Exam trap: T(n) = 4·T(n/2) + O(n)', x:"Here a=4, b=2, c=1. log₂(4) = 2 &gt; 1 = c → Case 1 → <b>Θ(n²)</b>. Students often panic and think 'four calls must be bad'. The key question is always: how does the subproblem count compare to the combine cost?"},
      {t:'check', q:"Strassen's matrix multiplication uses a=7 recursive calls on n/2-sized submatrices with O(n²) combining. What's its complexity?", a:"a=7, b=2, c=2. log₂(7) ≈ 2.807 &gt; 2 → <b>Case 1 → Θ(n^log₂7) ≈ Θ(n^2.807)</b>. Better than naïve O(n³) matrix multiplication."},
    ]},
  ]
};

/* ---------- WEEK 2 · Sorting & Correctness ---------- */
WEEK_LESSONS[2] = {
  hook: "Testing can't prove an algorithm correct — there are infinitely many inputs. Logic can. Then we sort faster than everyone says is possible.",
  chapters: [
    { id:'inv', title:'Proof Armor: Loop Invariants', icon:'🛡️', blocks:[
      {t:'p', x:"To <b>prove</b> an algorithm correct you show two things: (1) it always <span class='kw'>terminates</span>, and (2) it gives the right answer <i>when</i> it terminates. Testing can't do this — you can't test infinitely many inputs."},
      {t:'p', x:"The master tool is the <span class='kw'>loop invariant</span>: a statement that stays true at three checkpoints — <b>before</b> the loop (initialisation), <b>after every iteration</b> (maintenance), and <b>when the loop ends</b> (termination), where it must imply the result you want."},
      {t:'code', x:"min = array[1]; index = 2\n# LI: min = minimum of array[1 .. index-1]\nwhile index <= N:\n    if array[index] < min: min = array[index]\n    index = index + 1\nreturn min"},
      {t:'p', x:"<b>Initialisation:</b> before the loop, array[1..index-1] = array[1..1], and min = array[1]. ✔&nbsp; <b>Maintenance:</b> if min was the min of the first k, then after checking element k+1, min is the min of the first k+1. ✔&nbsp; <b>Termination:</b> index = N+1, so the invariant says min = minimum of array[1..N]. ✔ That's the proof."},
      {t:'analogy', title:'An invariant is a promise you never break', x:"Like a paladin's oath that holds at every step of the journey. If the oath is true at the start, stays true each stride, and the destination oath is exactly the goal — you've arrived correctly, guaranteed."},
      {t:'p', x:"<b>Binary search</b> is the classic invariant-driven algorithm — its invariant is 'if the target exists, it lies inside the active range'. Watch the range halve while that promise holds, searching for <b>35</b>:"},
      {t:'demo', kind:'array', accent:'#3ee0ff', frames:[
        {cells:[{v:5,state:'active'},{v:10,state:'active'},{v:15,state:'active'},{v:20,state:'active'},{v:25,state:'compare'},{v:30,state:'active'},{v:35,state:'active'},{v:40,state:'active'},{v:45,state:'active'},{v:50,state:'active'}], pointers:[{i:0,label:'lo',state:'active'},{i:4,label:'mid',state:'compare'},{i:9,label:'hi',state:'active'}], note:"Active range is the whole array. Check the middle: arr[mid] = 25. Target 35 &gt; 25 → the answer must be in the <b>right</b> half. Discard the left."},
        {cells:[{v:5,muted:true},{v:10,muted:true},{v:15,muted:true},{v:20,muted:true},{v:25,muted:true},{v:30,state:'active'},{v:35,state:'active'},{v:40,state:'compare'},{v:45,state:'active'},{v:50,state:'active'}], pointers:[{i:5,label:'lo',state:'active'},{i:7,label:'mid',state:'compare'},{i:9,label:'hi',state:'active'}], note:"Range halved to [30..50]. Middle arr[mid] = 40. Target 35 &lt; 40 → discard the <b>right</b>."},
        {cells:[{v:5,muted:true},{v:10,muted:true},{v:15,muted:true},{v:20,muted:true},{v:25,muted:true},{v:30,state:'compare'},{v:35,state:'active'},{v:40,muted:true},{v:45,muted:true},{v:50,muted:true}], pointers:[{i:5,label:'lo',state:'active'},{i:5,label:'mid',state:'compare'},{i:6,label:'hi',state:'active'}], note:"Range [30, 35]. Middle arr[mid] = 30. Target 35 &gt; 30 → go right once more."},
        {cells:[{v:5,muted:true},{v:10,muted:true},{v:15,muted:true},{v:20,muted:true},{v:25,muted:true},{v:30,muted:true},{v:35,state:'done'},{v:40,muted:true},{v:45,muted:true},{v:50,muted:true}], pointers:[{i:6,label:'found',state:'done'}], note:"One element left: arr = 35. <b>Found!</b> Four checks on ten elements — each step halved the range, giving <span style='color:#3ee0ff'>O(log N)</span>."},
      ]},
      {t:'h', x:'Variant: rightmost binary search'},
      {t:'p', x:"A trickier invariant problem: find the <b>rightmost</b> occurrence of a target. The insight: set hi = N+1 (exclusive upper bound), use loop condition <b>lo &lt; hi−1</b>, and always keep the target in range [lo, hi). When target ≥ A[mid], move lo up (not hi down), so the rightmost stays in range."},
      {t:'code', x:"lo = 1; hi = N + 1\n# Invariant: if target exists, its rightmost is in A[lo..hi-1]\nwhile lo < hi - 1:\n    mid = (lo + hi) // 2\n    if target >= A[mid]:\n        lo = mid          # target is at mid or to the right\n    else:\n        hi = mid          # target is strictly to the left\n# At termination: lo == hi-1, so A[lo] is the rightmost candidate\nreturn lo if A[lo] == target else -1"},
      {t:'insight', title:'Design from the invariant outward', x:"The exact code (lo vs. hi update, &lt; vs. ≤, +1 vs. not) is derived directly from the invariant. Ask: does my update preserve the invariant? That's the only thing you need to check."},
      {t:'check', q:"A stronger invariant for selection sort is 'arr[1..i-1] is sorted AND every element there ≤ everything in arr[i..N]'. Why isn't the weaker 'arr[1..i-1] is sorted' enough?", a:"Because selection sort <b>pulls the global minimum</b> forward each round. The weaker invariant (just 'sorted prefix') is actually <b>insertion sort's</b> invariant — it doesn't capture that the prefix is also smaller than the entire rest, which is what selection sort guarantees."},
    ]},
    { id:'sorts', title:'Classic Comparison Sorts', icon:'🗂️', blocks:[
      {t:'p', x:"Three O(N²) sorts you must know cold — not because they're fast, but because exam questions love their invariants, demos, and correctness proofs. Watch each one sort <b>[5, 2, 8, 1, 9, 3]</b>:"},
      {t:'h', x:'Selection sort'},
      {t:'demo', kind:'array', accent:'#b49bff', frames:[
        {cells:[{v:5},{v:2},{v:8},{v:1,state:'frontier'},{v:9},{v:3}], pointers:[{i:0,label:'i=1',state:'done'},{i:3,label:'min',state:'frontier'}], brackets:[{from:0,to:5,label:'unsorted',state:'compare'}], note:"Round 1: scan for the global minimum in A[1..6]. Min = <b>1</b> at index 4."},
        {cells:[{v:1,state:'done'},{v:2},{v:8},{v:5,state:'compare'},{v:9},{v:3}], brackets:[{from:1,to:5,label:'unsorted',state:'compare'}], note:"Swap min into position 1. Now A[1] = 1 is settled forever. Round 2 begins scanning A[2..6]."},
        {cells:[{v:1,state:'done'},{v:2,state:'done'},{v:8},{v:5},{v:9},{v:3,state:'frontier'}], pointers:[{i:2,label:'i=3',state:'done'},{i:5,label:'min',state:'frontier'}], note:"Round 3: min of A[3..6] = <b>3</b> at index 6. Swap into A[3]."},
        {cells:[{v:1,state:'done'},{v:2,state:'done'},{v:3,state:'done'},{v:4,state:'done'},{v:5,state:'done'},{v:6,state:'done'}], note:"After N−1 rounds every element is in its sorted position. Time: <b>O(N²)</b> comparisons, O(N) swaps — always, regardless of input."},
      ]},
      {t:'h', x:'Insertion sort'},
      {t:'demo', kind:'array', accent:'#54f0c8', frames:[
        {cells:[{v:5,state:'done'},{v:2,state:'active'},{v:8},{v:1},{v:9},{v:3}], pointers:[{i:1,label:'key',state:'active'}], brackets:[{from:0,to:0,label:'sorted',state:'done'}], note:"Key = <b>2</b>. Sorted prefix is [5]. Slide key left past anything bigger."},
        {cells:[{v:2,state:'done'},{v:5,state:'done'},{v:8,state:'active'},{v:1},{v:9},{v:3}], brackets:[{from:0,to:1,label:'sorted',state:'done'}], note:"Key = <b>8</b>. 8 &gt; 5, so it stays. Sorted prefix grows to [2, 5, 8]."},
        {cells:[{v:2,state:'done'},{v:5,state:'done'},{v:8,state:'compare'},{v:1,state:'active'},{v:9},{v:3}], pointers:[{i:3,label:'key=1',state:'active'}], note:"Key = <b>1</b>. Shift 8, 5, 2 right until we find 1's spot at the front."},
        {cells:[{v:1,state:'done'},{v:2,state:'done'},{v:5,state:'done'},{v:8,state:'done'},{v:9,state:'done'},{v:3,state:'active'}], brackets:[{from:0,to:4,label:'sorted',state:'done'}], note:"Key = <b>3</b>. Shifts past 9, 8, 5 and lands after 2. Final pass — array sorted."},
        {cells:[{v:1,state:'done'},{v:2,state:'done'},{v:3,state:'done'},{v:5,state:'done'},{v:8,state:'done'},{v:9,state:'done'}], note:"Done. Best case O(N) on nearly-sorted input; worst O(N²). <b>Stable</b> and <b>in-place</b>."},
      ]},
      {t:'cx', items:[{k:'Selection',v:'O(N²)',cls:'s',note:'all cases, not stable'},{k:'Insertion',v:'O(N) best',cls:'t',note:'O(N²) worst, stable'},{k:'Heap Sort',v:'O(N log N)',cls:'t',note:'in-place, not stable'}]},
      {t:'check', q:"Insertion sort is O(N) on an already-sorted array. Why?", a:"Each new element is bigger than the sorted prefix, so the inner 'shift left' loop exits immediately after one comparison. N elements × 1 comparison each = <b>O(N)</b> total."},
    ]},
    { id:'cmp', title:'Comparison Sorts & the N log N Wall', icon:'🧱', blocks:[
      {t:'p', x:"<b>Comparison-based</b> sorts decide order only by comparing pairs of elements. A sort is <span class='kw'>stable</span> if equal keys keep their original relative order, and <span class='kw'>in-place</span> if it needs only O(1) extra space."},
      {t:'p', x:"Know this table cold — it's frequent exam fuel:"},
      {t:'code', x:"                 Best        Worst       Stable?  In-place?\nSelection Sort   O(N^2)      O(N^2)      No       Yes\nInsertion Sort   O(N)        O(N^2)      Yes      Yes\nHeap Sort        O(N log N)  O(N log N)  No       Yes\nMerge Sort       O(N log N)  O(N log N)  Yes      No"},
      {t:'insight', title:'The lower bound', x:"<b>Any</b> comparison-based sort needs Ω(N log N) comparisons in the worst case — proven via a decision tree with N! leaves. So merge/heap sort are asymptotically optimal among comparison sorts. (The proof isn't examinable, but the <b>bound is</b>.)"},
      {t:'h', x:'Making any comparison sort stable'},
      {t:'p', x:"Trick from the applied classes: replace each element <b>a[i]</b> with a pair <b>(a[i], i)</b>. Compare pairs by value first, then by original index when values are equal. This forces tie-breaking by arrival order, making any sort behave stably. Cost: O(N) extra space and a constant overhead per comparison — time complexity unchanged."},
      {t:'check', q:"If Ω(N log N) is a hard wall, how do counting and radix sort run in O(N)?", a:"They're <b>not comparison-based</b> — they never compare two elements. By using the values as array indices instead, they sidestep the decision-tree argument entirely, so the Ω(N log N) lower bound doesn't apply."},
    ]},
    { id:'count', title:'Breaking the Wall: Counting & Radix Sort', icon:'🗳️', blocks:[
      {t:'p', x:"Counting sort sorts integers in a known range <b>[1..U]</b> without a single comparison. Tally how many times each value appears, then read the tallies out in order. Watch it build a count array:"},
      {t:'demo', kind:'array', accent:'#b49bff', frames:[
        {title:'Tally each value into count[ ]', cells:[{v:3,state:'active'},{v:1},{v:3},{v:7},{v:5},{v:3},{v:7},{v:8}], label:'input', aux:[{v:0,tag:'1'},{v:0,tag:'2'},{v:0,tag:'3'},{v:0,tag:'4'},{v:0,tag:'5'},{v:0,tag:'6'},{v:0,tag:'7'},{v:0,tag:'8'}], auxLabel:'count', note:"For each input value <b>v</b>, increment <b>count[v]</b>. Start at the first 3."},
        {cells:[{v:3,muted:true},{v:1,muted:true},{v:3,muted:true},{v:7,muted:true},{v:5,muted:true},{v:3,muted:true},{v:7,muted:true},{v:8,state:'active'}], label:'input', aux:[{v:1,tag:'1'},{v:0,tag:'2'},{v:3,tag:'3',state:'done'},{v:0,tag:'4'},{v:1,tag:'5'},{v:0,tag:'6'},{v:2,tag:'7'},{v:1,tag:'8'}], auxLabel:'count', note:"After one pass: value <b>3</b> appeared three times, <b>7</b> twice, and so on. <b>O(N)</b> to count."},
        {title:'Prefix sums → starting positions', cells:[{v:0,tag:'1'},{v:1,tag:'2'},{v:1,tag:'3'},{v:4,tag:'4'},{v:4,tag:'5'},{v:5,tag:'6'},{v:5,tag:'7'},{v:7,tag:'8'}], label:'position', out:[{v:1,state:'done'},{v:3,state:'done'},{v:3,state:'done'},{v:3,state:'done'},{v:5,state:'done'},{v:7,state:'done'},{v:7,state:'done'},{v:8,state:'done'}], outLabel:'output', note:"Convert counts to start positions via prefix sums. Value i starts at position[i] = position[i-1] + count[i-1]. Now place records stably."},
        {title:'Read counts out in order', cells:[{v:1,state:'done'},{v:3,state:'done'},{v:3,state:'done'},{v:3,state:'done'},{v:5,state:'done'},{v:7,state:'done'},{v:7,state:'done'},{v:8,state:'done'}], label:'output', note:"Walk output left-to-right: sorted! Total <b>O(N + U)</b>."},
      ]},
      {t:'cx', items:[{k:'Time',v:'O(N + U)',cls:'t',note:'U = value range'},{k:'Space',v:'O(N + U)',cls:'s'},{k:'Comparisons',v:'Zero',note:'not comparison-based'}]},
      {t:'warn', title:'Plain counting sort is unstable — and loses data', x:"Bare tallies forget <i>which</i> record had each key. The <b>stable</b> variant uses a prefix-sum position array: position[i] gives each value's starting slot, so you place full (key, data) records in original order. This stability is exactly what makes radix sort possible."},
      {t:'h', x:'Radix sort: counting sort, digit by digit'},
      {t:'p', x:"Radix sort runs <b>stable</b> counting sort on each digit, from least-significant to most-significant. With <b>d</b> digits over base <b>k</b>, the cost is <span class='kw'>O(d·(N + k))</span> — linear when d and k are small. Stability is non-negotiable here: it's what preserves the ordering from earlier digits."},
      {t:'p', x:"<b>Variable-length strings</b>: sort strings by length first (counting sort in O(N+ℓ)), then run radix passes only on strings long enough to have a character at that position. This keeps total work O(N) where N is the total number of characters across all strings."},
      {t:'check', q:"Why must radix sort process digits from least-significant first, and why must the per-digit sort be stable?", a:"Sorting LSD-first means each later (more significant) digit pass only needs to break ties — and <b>stability</b> preserves the order established by all the less-significant digits already processed. Lose stability and you scramble that hard-won order."},
    ]},
  ]
};

/* ---------- WEEK 3 · Quicksort & Select ---------- */
WEEK_LESSONS[3] = {
  hook: "Pick a pivot, split the world around it, recurse. Simple — but the pivot you choose decides whether you fly at N log N or crawl at N².",
  chapters: [
    { id:'qs', title:'The Pivot Gambit: Quicksort', icon:'🎯', blocks:[
      {t:'p', x:"Quicksort's idea in four lines: if the list has ≤1 element, done. Otherwise pick a <span class='kw'>pivot p</span>, <b>partition</b> so everything ≤ p is left and everything &gt; p is right (p lands in its final sorted spot), then quicksort each side."},
      {t:'p', x:"Partitioning is the engine. Step through an in-place Hoare partition on <b>[2, 8, 7, 1, 3, 4, 5, 6]</b> with pivot <b>4</b>:"},
      {t:'demo', kind:'array', accent:'#ffce4d', frames:[
        {cells:[{v:2},{v:8},{v:7},{v:1},{v:3},{v:5},{v:6},{v:4,state:'pivot'}], note:"Pivot <b>p = 4</b> (last element). Pointer <b>i</b> tracks the boundary of the '≤ p' region. Scan <b>j</b> left to right.", pointers:[{i:7,label:'p',state:'pivot'}]},
        {cells:[{v:2,state:'less'},{v:8,state:'compare'},{v:7},{v:1},{v:3},{v:5},{v:6},{v:4,state:'pivot'}], pointers:[{i:0,label:'i',state:'less'},{i:1,label:'j',state:'compare'}], note:"2 ≤ 4 → swap into 'small' region (i=0), advance i. Now j=1: 8 &gt; 4 → just advance j."},
        {cells:[{v:2,state:'less'},{v:8,state:'greater'},{v:7,state:'greater'},{v:1,state:'active'},{v:3},{v:5},{v:6},{v:4,state:'pivot'}], pointers:[{i:1,label:'i',state:'less'},{i:3,label:'j',state:'compare'}], note:"7 &gt; 4 → skip. 1 ≤ 4 → swap A[j] with A[i+1] and advance i. Small zone now has [2,1]."},
        {cells:[{v:2,state:'less'},{v:1,state:'less'},{v:7,state:'greater'},{v:8,state:'greater'},{v:3,state:'active'},{v:5},{v:6},{v:4,state:'pivot'}], pointers:[{i:2,label:'i',state:'less'},{i:4,label:'j',state:'compare'}], note:"3 ≤ 4 → swap into small region. Now small = [2,1,3], large = [7,8]."},
        {cells:[{v:2,state:'less'},{v:1,state:'less'},{v:3,state:'less'},{v:8,state:'greater'},{v:7,state:'greater'},{v:5,state:'greater'},{v:6,state:'greater'},{v:4,state:'pivot'}], pointers:[{i:2,label:'i',state:'less'},{i:7,label:'p',state:'pivot'}], note:"5, 6 &gt; 4 → skip. Scan complete. Now swap the pivot into position i+1."},
        {cells:[{v:2,state:'less'},{v:1,state:'less'},{v:3,state:'less'},{v:4,state:'done'},{v:7,state:'greater'},{v:5,state:'greater'},{v:6,state:'greater'},{v:8,state:'greater'}], note:"<b>4 is now in its final sorted position.</b> Recurse on [2,1,3] and [7,5,6,8]. That's one complete quicksort pass."},
      ]},
      {t:'insight', title:'Hoare vs. Dutch National Flag', x:"<b>Hoare partition</b> does the in-place swapping above — only two regions (≤p and &gt;p). With many duplicate keys, the <b>Dutch National Flag</b> partition splits into <i>three</i> regions (&lt;p, =p, &gt;p) — equal elements never get recursed on. Big win on duplicate-heavy inputs."},
    ]},
    { id:'dnf', title:'Dutch National Flag: 3-Way Partition', icon:'🇳🇱', blocks:[
      {t:'p', x:"When the input has many duplicates, two-way partition still recurses on equal elements — wasting O(N²) on all-same arrays. The <span class='kw'>Dutch National Flag (DNF)</span> algorithm partitions into three bands in a single pass: elements <b>&lt; pivot</b>, elements <b>= pivot</b>, elements <b>&gt; pivot</b>. Watch it work on <b>[3,1,4,1,5,9,2,6,5,3]</b> with pivot 3:"},
      {t:'demo', kind:'array', accent:'#ffce4d', frames:[
        {cells:[{v:3},{v:1},{v:4},{v:1},{v:5},{v:9},{v:2},{v:6},{v:5},{v:3}], pointers:[{i:0,label:'lo',state:'less'},{i:0,label:'mid',state:'active'},{i:9,label:'hi',state:'greater'}], note:"Three pointers: <b>lo</b> = start of 'equal' zone, <b>mid</b> = unknown cursor, <b>hi</b> = end of unknown zone. Pivot = 3."},
        {cells:[{v:1,state:'less'},{v:3,state:'active'},{v:4},{v:1},{v:5},{v:9},{v:2},{v:6},{v:5},{v:3}], pointers:[{i:0,label:'lo',state:'less'},{i:1,label:'mid',state:'active'},{i:9,label:'hi',state:'greater'}], note:"A[mid]=3 → equal → keep here, advance mid. Lo stays."},
        {cells:[{v:1,state:'less'},{v:1,state:'less'},{v:3,state:'active'},{v:4},{v:5},{v:9},{v:2},{v:6},{v:5},{v:3}], pointers:[{i:1,label:'lo',state:'less'},{i:2,label:'mid',state:'active'},{i:9,label:'hi',state:'greater'}], note:"A[mid]=4 &gt; 3 → swap with hi, shrink hi. 4 goes to the far right unknown zone. mid stays put."},
        {cells:[{v:1,state:'less'},{v:1,state:'less'},{v:2,state:'less'},{v:3,state:'active'},{v:3,state:'active'},{v:9,state:'greater'},{v:5,state:'greater'},{v:6,state:'greater'},{v:5,state:'greater'},{v:4,state:'greater'}], pointers:[{i:2,label:'lo',state:'less'},{i:3,label:'mid',state:'active'},{i:4,label:'hi',state:'greater'}], note:"After processing all unknowns: lo..mid-1 = {1,1,2}, mid..hi = {3,3}, hi+1..N = {4,5,5,6,9}. Three bands ✔. Both [=pivot] cells are already finalised — zero redundant recursion."},
      ]},
      {t:'cx', items:[{k:'Time',v:'O(N)',cls:'t',note:'single pass'},{k:'Space',v:'O(1)',cls:'s',note:'in-place'},{k:'Recursion',v:'Skips =pivot',note:'crucial speedup'}]},
      {t:'check', q:"After DNF partition, which region(s) still need to be recursed on?", a:"Only the <b>&lt; pivot</b> and <b>&gt; pivot</b> regions. The middle <b>= pivot</b> region is already in its final positions — all copies of the pivot land exactly where they belong."},
    ]},
    { id:'analysis', title:'Best, Worst & Average', icon:'🎲', blocks:[
      {t:'p', x:"Quicksort's cost is all about the pivot. A <b>good</b> pivot near the median splits the array in half: T(N) = 2·T(N/2) + O(N) ⟶ <span class='kw'>O(N log N)</span>. A <b>terrible</b> pivot (always the min or max) peels off one element at a time: T(N) = T(N-1) + O(N) ⟶ <span class='kw'>O(N²)</span>."},
      {t:'cx', items:[{k:'Best',v:'O(N log N)',cls:'t',note:'balanced splits'},{k:'Average',v:'O(N log N)',cls:'t',note:'random pivot'},{k:'Worst',v:'O(N²)',cls:'s',note:'sorted + bad pivot'}]},
      {t:'p', x:"The beautiful part: even a <b>random</b> pivot gives O(N log N) <i>expected</i> time. After partitioning, the pivot has a 50% chance of landing in the comfortable middle half, so on average the tree stays shallow — about 2·log N deep."},
      {t:'warn', title:'The classic trap', x:"Quicksort with 'pick the first element as pivot' hits its O(N²) worst case on <b>already-sorted</b> input — exactly the case people forget to test. Randomised or median-of-three pivots dodge this."},
      {t:'check', q:"Quicksort is often faster in practice than merge sort despite the same average complexity. Give one reason.", a:"It's <b>in-place</b> (O(log N) stack space vs merge sort's O(N) extra array) and has excellent <b>cache locality</b> — it works on contiguous sub-ranges. Lower constant factors win on real hardware."},
    ]},
    { id:'select', title:'Quickselect & Median of Medians', icon:'🏅', blocks:[
      {t:'p', x:"What if you only want the <span class='kw'>k-th smallest</span> element (an order statistic), not the whole sorted array? <b>Quickselect</b> partitions like quicksort but then recurses into <i>only the side containing k</i> — throwing away the other half. That one-sided recursion gives T(N) = T(N/2) + O(N) ⟶ <span class='kw'>O(N)</span> expected."},
      {t:'demo', kind:'array', accent:'#54f0c8', frames:[
        {cells:[{v:7},{v:2},{v:9},{v:1},{v:5},{v:4},{v:8},{v:3},{v:6}], note:"Find the <b>4th smallest</b> element in [7,2,9,1,5,4,8,3,6]. Pick a random pivot — say 5 (index 4)."},
        {cells:[{v:2,state:'less'},{v:1,state:'less'},{v:4,state:'less'},{v:3,state:'less'},{v:5,state:'pivot'},{v:7,state:'greater'},{v:9,state:'greater'},{v:8,state:'greater'},{v:6,state:'greater'}], pointers:[{i:4,label:'pivot=5',state:'pivot'}], note:"After partition: pivot 5 lands at index 4 (0-based). Sizes: left has 4 elements, right has 4. We want k=4 (1-based), so we recurse on the <b>left side</b> [2,1,4,3]."},
        {cells:[{v:1,state:'less'},{v:2,state:'less'},{v:3,state:'pivot'},{v:4,state:'greater'},{v:5,muted:true},{v:7,muted:true},{v:9,muted:true},{v:8,muted:true},{v:6,muted:true}], pointers:[{i:2,label:'pivot=3',state:'pivot'}], note:"Recurse on [2,1,4,3]. Pivot 3 lands at index 2 (local). We need position 3 (local) → recurse right into [4]."},
        {cells:[{v:1,muted:true},{v:2,muted:true},{v:3,muted:true},{v:4,state:'done'},{v:5,muted:true},{v:7,muted:true},{v:9,muted:true},{v:8,muted:true},{v:6,muted:true}], note:"One element remaining: <b>4</b>. That's the 4th smallest. ✔  We never sorted the other 8 elements."},
      ]},
      {t:'insight', title:'Median of Medians: a guaranteed-good pivot', x:"Split into groups of 5, find each group's median, then recursively find the <b>median of those medians</b>. This pivot is provably better than at least 30% of elements on each side — guaranteeing <b>O(N) worst-case</b> selection. Plug it into quicksort and you even get O(N log N) <i>worst-case</i> sorting."},
      {t:'demo', kind:'array', accent:'#ff9be0', frames:[
        {cells:[{v:3,state:'active'},{v:8,state:'active'},{v:1,state:'active'},{v:5,state:'active'},{v:7,state:'active'},{v:2,state:'compare'},{v:9,state:'compare'},{v:4,state:'compare'},{v:6,state:'compare'},{v:0,state:'compare'}], brackets:[{from:0,to:4,label:'group 1',state:'active'},{from:5,to:9,label:'group 2',state:'compare'}], note:"Groups of 5. Group 1 = [3,8,1,5,7], Group 2 = [2,9,4,6,0]. Step 1: sort each group of 5 and find its median."},
        {cells:[{v:1,state:'done'},{v:3,state:'done'},{v:5,state:'pivot'},{v:7,state:'done'},{v:8,state:'done'},{v:0,state:'done'},{v:2,state:'done'},{v:4,state:'pivot'},{v:6,state:'done'},{v:9,state:'done'}], brackets:[{from:0,to:4,label:'sorted g1: median=5',state:'active'},{from:5,to:9,label:'sorted g2: median=4',state:'compare'}], note:"Group 1 sorted: [1,3,5,7,8] → median <b>5</b>.  Group 2 sorted: [0,2,4,6,9] → median <b>4</b>. Collect medians."},
        {cells:[{v:5,state:'pivot'},{v:4,state:'pivot'}], note:"Recursively find the median of the medians list [5, 4]: it's <b>4</b> or <b>5</b> (either). Use this as the pivot for the main quickselect — guaranteed to split at least 30/70."},
        {cells:[{v:5,state:'active'}], note:"<b>Anticlimax:</b> Median-of-Medians guarantees O(N) <i>worst case</i>, but the constant factor is large. In practice, random pivots with expected O(N) are used instead. The algorithm is a theoretical triumph — know it for the guarantee, not the speed."},
      ]},
      {t:'check', q:"Quickselect recurses into one side; quicksort into both. How does that change the recurrence from O(N log N) to O(N)?", a:"Quicksort's T(N) = <b>2</b>·T(N/2) + O(N) sums O(N) work across log N levels = O(N log N). Quickselect's T(N) = <b>1</b>·T(N/2) + O(N) is a geometric series N + N/2 + N/4 + … = <b>O(N)</b>. Discarding half the work each time collapses the log factor."},
    ]},
  ]
};
