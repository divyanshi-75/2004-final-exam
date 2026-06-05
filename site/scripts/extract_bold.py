"""Extract text with bold detection from a PDF using pdfminer.six.

Outputs a JSON list of {'text': line_text, 'bold': bool, 'page': int}.

Usage:
    python3 extract_bold.py --pdf ../materials/Exam-structure.pdf --out data_raw/exam-structure-styled.json
"""
import argparse
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextContainer, LTChar
from pathlib import Path
import json


def line_is_bold(textline):
    # Determine if a textline contains any character with a bold font name
    for obj in textline:
        if isinstance(obj, LTChar):
            if 'Bold' in obj.fontname or 'Black' in obj.fontname:
                return True
    return False


def extract(pdf_path: Path):
    pages_output = []
    for page_num, page_layout in enumerate(extract_pages(str(pdf_path)), start=1):
        for element in page_layout:
            if isinstance(element, LTTextContainer):
                for textline in element:
                    text = textline.get_text().strip()
                    if not text:
                        continue
                    # Detect bold by inspecting LTChar children
                    bold = False
                    chars = [c for c in textline if isinstance(c, LTChar)]
                    for ch in chars:
                        fname = getattr(ch, 'fontname', '')
                        if fname and ('Bold' in fname or 'Black' in fname):
                            bold = True
                            break
                    pages_output.append({'page': page_num, 'text': text, 'bold': bold})
    return pages_output


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--pdf', required=True)
    p.add_argument('--out', default='data_raw/exam-structure-styled.json')
    args = p.parse_args()

    pdf = Path(args.pdf)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    data = extract(pdf)
    out.write_text(json.dumps(data, indent=2), encoding='utf-8')
    print('Wrote', out)


if __name__ == '__main__':
    main()
