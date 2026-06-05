"""Parse exam-structure-styled.json into structured recommended-question JSON.

Output: site/data/exam_recommended_questions.json
"""
import json
from pathlib import Path
import re


def parse(styled):
    weeks = {}
    current_week = None
    for item in styled:
        text = item['text'].strip()
        bold = item.get('bold', False)
        # Week headers like 'Week 1'
        m = re.match(r'Week\s*(\d+)', text, re.IGNORECASE)
        if m:
            current_week = int(m.group(1))
            weeks.setdefault(current_week, [])
            continue
        # Bulleted problem lines start with a bullet
        if text.startswith('\u25cf') or text.startswith('•'):
            # remove bullet char and whitespace
            # skip bullets before a Week header
            if current_week is None:
                continue
            t = text.lstrip('\u25cf').lstrip().lstrip('•').lstrip()
            # Expect format like 'Problem 2 - section 2' or 'problem 5 - section 2 or 3'
            parts = [p.strip() for p in t.split(' - ')]
            if len(parts) >= 2:
                label = parts[0]
                section = parts[1].replace('section ', '').strip()
            else:
                # fallback: entire line as label
                label = t
                section = None
            entry = {
                'week': current_week,
                'problemLabel': label,
                'section': section,
                'onRecommendedList': True,
                'isKeyQuestion': bool(bold),
                'source': 'Exam-structure.pdf'
            }
            weeks.setdefault(current_week, []).append(entry)
            continue
    # flatten into list
    out = []
    for w in sorted(weeks.keys()):
        for e in weeks[w]:
            out.append(e)
    return out


def main():
    in_path = Path('site/data_raw/exam-structure-styled.json')
    styled = json.loads(in_path.read_text(encoding='utf-8'))
    parsed = parse(styled)
    out_path = Path('site/data/exam_recommended_questions.json')
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(parsed, indent=2), encoding='utf-8')
    print('Wrote', out_path)

if __name__ == '__main__':
    main()
