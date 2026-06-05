"""Parse applied-sheet raw texts into question entries.

Scans site/data_raw for files named applied-questions__appliedNN-(problems|solutions).pdf.txt
and extracts Problem headers and their following content. Outputs site/data/questions_from_applied.json
"""
import re
import json
from pathlib import Path


def parse_file(path: Path, week: int, has_solutions: bool):
    text = path.read_text(encoding='utf-8')
    # Normalize different 'Problem' casings
    # Find headers like 'Problem 1.' or 'Problem 3a.' or 'Problem 9.2.'
    # Multiline and DOTALL flags: ^ matches line starts and . matches newlines
    pattern = re.compile(r"^Problem\s+([0-9]+(?:\.[0-9]+)?[a-z]?)\.(.*?)(?=^Problem\s+[0-9]|\Z)", re.S | re.M)
    entries = []
    for m in pattern.finditer(text):
        label = m.group(1).strip()
        body = m.group(2).strip()
        # Trim leading whitespace/newlines
        body = re.sub(r'^\s+', '', body)
        entry = {
            'id': f"{path.stem}__Problem{label}",
            'title': f"Problem {label}",
            'source': str(path),
            'week': week,
            'problemLabel': f"Problem {label}",
            'section': None,  # will be filled from exam_recommended_questions mapping later
            'onRecommendedList': False,
            'isKeyQuestion': False,
            'solution': body if has_solutions else 'unavailable'
        }
        entries.append(entry)
    return entries


def infer_week_from_filename(name: str):
    m = re.search(r'applied(\d{2})', name)
    if m:
        return int(m.group(1))
    return None


def main():
    data_raw = Path('site/data_raw')
    out = []
    for f in sorted(data_raw.glob('applied-questions__*.txt')):
        fname = f.name
        week = infer_week_from_filename(fname)
        has_solutions = 'solutions' in fname
        if week is None:
            continue
        entries = parse_file(f, week, has_solutions)
        out.extend(entries)
    out_path = Path('site/data/questions_from_applied.json')
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(out, indent=2), encoding='utf-8')
    print('Wrote', out_path)

if __name__ == '__main__':
    main()
