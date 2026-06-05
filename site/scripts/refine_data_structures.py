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
    while True:
        idx = s.find(key, start)
        if idx == -1:
            return ''
        tail = note_text[idx:idx+200]
        if '.....' in tail or '---page_break---' in tail.lower():
            start = idx + len(key)
            continue
        after = note_text[idx: idx + 2000]
        lines = after.splitlines()
        cleaned = []
        for ln in lines[1:40]:
            if re.search(r'\.{3,}\s*\d+$', ln.strip()):
                continue
            cleaned.append(ln)
            if ln.strip() == '':
                break
        if cleaned:
            text = '\n'.join(cleaned).strip()
            return text[:1500]
        start = idx + len(key)


def link_questions(name, questions):
    name_words = [w for w in re.findall(r"[A-Za-z0-9']+", name.lower()) if len(w) > 2]
    related = set()
    for q in questions:
        hay = (q.get('statement','') + ' ' + q.get('solution','')).lower()
        for w in name_words:
            if w in hay:
                related.add(q.get('id'))
                break
    return sorted([r for r in related if r is not None])


def main():
    note_file = DATA_RAW / 'course-note__FIT2004_course_notes_20260321.pdf.txt'
    note_text = note_file.read_text(encoding='utf-8')

    ds = load('data_structures.json')
    questions = []
    qm = DATA / 'questions_master.json'
    if qm.exists():
        questions = json.loads(qm.read_text(encoding='utf-8'))

    for d in ds:
        short = d['name'].strip()
        snippet = snippet_from_course(note_text, short)
        if snippet:
            d['description'] = snippet
        related = link_questions(short, questions)
        d['relatedQuestionIds'] = related

    save('data_structures.json', ds)
    print('Refined data_structures.json written')


if __name__ == '__main__':
    main()
