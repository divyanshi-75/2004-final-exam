"""Link recommended questions from exam-structure to parsed applied-sheet questions.

Produces:
- site/data/questions_master.json (questions with section, onRecommendedList, isKeyQuestion updated)
- site/data/exam_recommended_questions_linked.json (recommended entries with question id references)
"""
import json
from pathlib import Path
import re


def normalize_label(lbl: str) -> str:
    # normalize 'Problem 16a' or 'problem 16a' -> 'problem 16a'
    return re.sub(r"\s+"," ", lbl.strip().lower())


def main():
    rec_path = Path('site/data/exam_recommended_questions.json')
    q_path = Path('site/data/questions_from_applied.json')
    recs = json.loads(rec_path.read_text(encoding='utf-8'))
    qs = json.loads(q_path.read_text(encoding='utf-8'))

    # build lookup by (week, label)
    lookup = {}
    for q in qs:
        key = (q.get('week'), normalize_label(q.get('problemLabel','')))
        lookup.setdefault(key, []).append(q)

    linked = []
    for r in recs:
        key = (r.get('week'), normalize_label(r.get('problemLabel','')))
        matches = lookup.get(key, [])
        r2 = dict(r)
        r2['questionIds'] = [m['id'] for m in matches]
        linked.append(r2)
        # update matched questions
        for m in matches:
            m['section'] = r.get('section')
            m['onRecommendedList'] = True
            m['isKeyQuestion'] = r.get('isKeyQuestion', False)

    out_q = Path('site/data/questions_master.json')
    out_r = Path('site/data/exam_recommended_questions_linked.json')
    out_q.write_text(json.dumps(qs, indent=2), encoding='utf-8')
    out_r.write_text(json.dumps(linked, indent=2), encoding='utf-8')
    print('Wrote', out_q, 'and', out_r)

if __name__ == '__main__':
    main()
