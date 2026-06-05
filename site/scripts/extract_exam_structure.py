"""Extract exam structure and curated list from Exam-structure.pdf.

This script extracts raw text from the PDF and writes it to data_raw/exam-structure.txt
and attempts to locate the curated recommended-question list as plain text blocks.
It does NOT interpret or assign sections beyond what's present in the text; the
output is intentionally conservative and should be reviewed.

Usage:
    python3 scripts/extract_exam_structure.py --pdf ../materials/Exam-structure.pdf --out data_raw
"""
from pathlib import Path
from pypdf import PdfReader
import argparse


def extract_text(pdf_path: Path):
    reader = PdfReader(str(pdf_path))
    pages = []
    for page in reader.pages:
        pages.append(page.extract_text() or "")
    return "\n\n---PAGE_BREAK---\n\n".join(pages)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--pdf", required=True)
    p.add_argument("--out", default="data_raw")
    args = p.parse_args()

    pdf = Path(args.pdf)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    text = extract_text(pdf)
    (out / "exam-structure.txt").write_text(text, encoding="utf-8")
    print("Written exam-structure.txt to", out)


if __name__ == "__main__":
    main()
