"""Conservatively extract algorithms, data-structures, and concept blocks from course notes.

Outputs:
 - site/data/algorithms.json
 - site/data/data_structures.json
 - site/data/concepts.json

Method:
 - Parse the 'List of Algorithms' section to get algorithm names.
 - For each name, find the first occurrence in the main text and capture surrounding lines as purpose/description.
 - Attempt to extract any explicit complexity mentions (Θ(...), O(...), Ω(...)).
 - For data structures, look for section headings from the table of contents that match common DS names.

This is intentionally conservative and does not invent content; missing fields are left empty.
"""
from pathlib import Path
import re
import json


def read_notes():
    p = Path('site/data_raw/course-note__FIT2004_course_notes_20260321.pdf.txt')
    return p.read_text(encoding='utf-8')


def extract_list_of_algorithms(text: str):
    # find 'List of Algorithms' section
    m = re.search(r'List of Algorithms\n(.*?)\n\n', text, re.S)
    if not m:
        # fallback: find the heading and take the following ~4000 chars
        m2 = re.search(r'List of Algorithms', text)
        if not m2:
            return []
        start = m2.start()
        snippet = text[start:start+8000]
    else:
        # expand until next page break marker
        snippet = text[m.start():]
    # get numbered lines like '1 Binary Search . . . 2'
    lines = []
    for line in snippet.splitlines():
        if re.match(r'\s*\d+\s+\S', line):
            lines.append(line.strip())
        # stop when chapter text begins
        if line.strip().startswith('Chapter'):
            break
    algs = []
    for ln in lines:
        # remove page numbers at end
        ln2 = re.sub(r'\s+\.*\s*\d+$', '', ln)
        # split leading number
        m = re.match(r'^(\d+)\s+(.*)$', ln2)
        if m:
            name = m.group(2).strip()
            algs.append(name)
    return algs


def find_context(text: str, name: str, window=250):
    # find first occurrence of name (case-insensitive)
    idx = text.lower().find(name.lower())
    if idx == -1:
        return ''
    start = max(0, idx - window)
    end = min(len(text), idx + window)
    return text[start:end].strip()


def extract_complexities(snippet: str):
    # find Θ(...), O(...), Ω(...), or phrases like 'time complexity is'
    comps = re.findall(r'(?:Θ|O|Ω)\([^\)]+\)', snippet)
    if not comps:
        # try common text patterns
        m = re.search(r'time complexity[^\n\.:]*[:\-–]?\s*([^\n\.]*)', snippet, re.I)
        if m:
            comps.append(m.group(1).strip())
    return comps


def extract_data_structures_from_toc(text: str):
    # look for headings in the contents that are typical DS (e.g., 'Binary Search Trees', 'AVL Trees', 'Prefix Trie')
    ds = []
    toc_lines = []
    # find the 'Contents' area (already present early in file)
    m = re.search(r'Contents\n(.*?)\n\n', text, re.S)
    if m:
        toc_snip = m.group(1)
    else:
        toc_snip = text[:4000]
    for ln in toc_snip.splitlines():
        if any(k in ln for k in ['Tree', 'Trie', 'Heap', 'Stack', 'Queue', 'Disjoint', 'Union', 'Graph', 'Suffix']):
            toc_lines.append(ln.strip())
    # clean and unique
    for ln in toc_lines:
        name = re.sub(r'\s+\.+\s*\d+$', '', ln)
        name = re.sub(r'\d+\.', '', name).strip()
        if name and name not in ds:
            ds.append(name)
    return ds


def main():
    text = read_notes()
    alg_names = extract_list_of_algorithms(text)
    algorithms = []
    for name in alg_names:
        context = find_context(text, name, window=400)
        comps = extract_complexities(context)
        algorithms.append({
            'name': name,
            'source': 'course notes',
            'purpose': context,
            'timeComplexity': comps[0] if comps else '',
            'spaceComplexity': '',
            'relatedTopics': [],
            'relatedQuestionIds': []
        })

    ds_names = extract_data_structures_from_toc(text)
    data_structures = []
    for name in ds_names:
        context = find_context(text, name, window=400)
        data_structures.append({
            'name': name,
            'source': 'course notes',
            'operations': [],
            'complexities': [],
            'relatedQuestionIds': [],
            'description': context
        })

    # Extract concept headings: lines like '1.1 Program Verification' or 'Invariant: Binary Search'
    concepts = []
    for m in re.finditer(r'(^[^\n]{0,80}\n)([A-Z][A-Za-z\-\s]{2,80})\n', text, re.M):
        # crude capture; skip common headings like 'Chapter' or 'Contents'
        heading = m.group(2).strip()
        if len(heading) < 5 or heading in ['Chapter', 'Contents', 'List of Algorithms']:
            continue
        ctx = find_context(text, heading, window=300)
        concepts.append({'name': heading, 'definition': ctx, 'weekRef': None, 'relatedAlgorithmIds': []})

    outdir = Path('site/data')
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / 'algorithms.json').write_text(json.dumps(algorithms, indent=2), encoding='utf-8')
    (outdir / 'data_structures.json').write_text(json.dumps(data_structures, indent=2), encoding='utf-8')
    (outdir / 'concepts.json').write_text(json.dumps(concepts, indent=2), encoding='utf-8')
    print('Wrote algorithms.json, data_structures.json, concepts.json')

if __name__ == '__main__':
    main()
