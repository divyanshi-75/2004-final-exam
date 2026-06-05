#!/usr/bin/env python3
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_RAW = ROOT / 'data_raw'
DATA = ROOT / 'data'


def load(name):
    return json.loads((DATA / name).read_text(encoding='utf-8'))


def save(name, obj):
    (DATA / name).write_text(json.dumps(obj, indent=2, ensure_ascii=False), encoding='utf-8')


def snippet_from_course(note_text, shortname):
    s = note_text.lower()
    key = shortname.lower()
    start = 0
    # Prefer occurrences that look like section headings followed by prose.
    while True:
        idx = s.find(key, start)
        if idx == -1:
            return ''
        tail = note_text[idx:idx+800]
        # reject TOC-like lines (lots of dots or immediate digits)
        if re.search(r'\.{3,}|\.{2,}\s*\d', tail[:120]):
            start = idx + len(key)
            continue
        # extract until next double newline or page break
        after = note_text[idx: idx + 2000]
        # split into paragraphs
        paras = re.split(r'\n\s*\n', after)
        if len(paras) >= 2:
            # first paragraph is often the heading line; pick the first paragraph that contains a verb
            for p in paras[1:4]:
                p_strip = p.strip()
                if not p_strip:
                    continue
                # heuristic: contains 'is'/'are'/'use'/'comput' or length > 50
                if re.search(r'\b(is|are|use|uses|using|compute|computes|complexity|algorithm)\b', p_strip, re.I) or len(p_strip) > 60:
                    return p_strip[:1500]
        # fallback: take first non-empty line-block after the name
        lines = after.splitlines()
        cleaned = []
        for ln in lines[1:60]:
            if re.search(r'\.{3,}\s*\d+$', ln.strip()):
                continue
            cleaned.append(ln)
            if ln.strip() == '':
                break
        if cleaned:
            text = '\n'.join(cleaned).strip()
            if re.search(r'\b(is|are|use|compute|algorithm)\b', text, re.I):
                return text[:1500]
        start = idx + len(key)


def extract_complexities(text):
    if not text:
        return '', ''
    # Find O(...) patterns
    o_match = re.search(r'\bO\s*\([^\)]{1,60}\)', text)
    theta_match = re.search(r'Θ\([^\)]{1,60}\)|Theta\s*\([^\)]{1,60}\)', text)
    tc = theta_match.group(0) if theta_match else (o_match.group(0) if o_match else '')
    # space complexity heuristic
    s_match = re.search(r'space[^\.\n]{0,60}\bO\s*\([^\)]{1,60}\)', text, re.I)
    sc = s_match.group(0) if s_match else ''
    return tc, sc


def clean_toc_noise(text):
    if not text:
        return text
    # remove leading TOC-like lines: lines with many dots and a trailing number
    lines = text.splitlines()
    i = 0
    for i, ln in enumerate(lines):
        if re.search(r'\.{3,}\s*\d+$', ln.strip()):
            continue
        # if the line looks like a heading (short) skip it, but look for next paragraph with verb
        if len(ln.strip()) < 80 and not re.search(r'\b(is|are|use|compute|algorithm|data|structure|complexity)\b', ln, re.I):
            continue
        break
    cleaned = '\n'.join(lines[i:]).strip()
    # remove any leading short lines that are all uppercase headings
    cleaned = re.sub(r'^[A-Z\s]{2,}\n', '', cleaned)
    return cleaned


def link_questions(alg_name, questions):
    name_words = [w for w in re.findall(r"[A-Za-z0-9']+", alg_name.lower()) if len(w) > 2]
    related = set()
    for q in questions:
        hay = (q.get('statement','') + ' ' + q.get('solution','')).lower()
        if all(w in hay for w in name_words[:3]):
            related.add(q.get('id'))
        else:
            # fallback: any one word match
            for w in name_words:
                if w in hay:
                    related.add(q.get('id'))
                    break
    return sorted([r for r in related if r is not None])


def main():
    note_file = DATA_RAW / 'course-note__FIT2004_course_notes_20260321.pdf.txt'
    note_text = note_file.read_text(encoding='utf-8')

    algorithms = load('algorithms.json')
    questions = []
    qm = DATA / 'questions_master.json'
    if qm.exists():
        questions = json.loads(qm.read_text(encoding='utf-8'))
    # build map of recommended question ids
    recommended_set = set(q['id'] for q in questions if q.get('onRecommendedList'))

    for a in algorithms:
        short = a['name'].rstrip('. ').strip()
        # remove leading numbering if present
        short = re.sub(r'^\d+\s+', '', short)
        short = re.sub(r'\s+\.\.\.+$', '', short).strip()
        snippet = snippet_from_course(note_text, short)
        if snippet:
            cleaned = clean_toc_noise(snippet)
            a['purpose'] = cleaned
        # final clean of existing purpose too
        a['purpose'] = clean_toc_noise(a.get('purpose',''))
        tc, sc = extract_complexities(a.get('purpose',''))
        a['timeComplexity'] = a.get('timeComplexity') or tc
        a['spaceComplexity'] = a.get('spaceComplexity') or sc
        related = link_questions(short, questions)
        a['relatedQuestionIds'] = related
        # mark recommended links
        a['recommendedQuestionIds'] = [r for r in related if r in recommended_set]
        a['hasRecommended'] = len(a['recommendedQuestionIds']) > 0

    save('algorithms.json', algorithms)
    print('Refined algorithms.json written')


if __name__ == '__main__':
    main()
