"""Extract text from all PDFs in the materials folder and save raw text files.

This is a conservative extractor: it does NOT interpret or synthesize content — it
only writes raw extracted text and stores per-PDF metadata. Use this as the
first step before building parsers to populate the typed JSON dataset.

Usage:
    python3 scripts/extract_all.py --materials ../materials --out data_raw
"""
import argparse
from pathlib import Path
from pypdf import PdfReader
from tqdm import tqdm
import json


def extract_pdf_to_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    texts = []
    for page in reader.pages:
        try:
            texts.append(page.extract_text() or "")
        except Exception:
            texts.append("")
    return "\n\n---PAGE_BREAK---\n\n".join(texts)


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--materials", required=True, help="path to materials folder")
    p.add_argument("--out", default="data_raw", help="output folder")
    args = p.parse_args()

    materials = Path(args.materials)
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)

    index = []
    for pdf in sorted(materials.rglob("*.pdf")):
        rel = pdf.relative_to(materials)
        dest = out / ("__".join(rel.parts) + ".txt")
        dest.parent.mkdir(parents=True, exist_ok=True)
        print(f"Extracting {rel} -> {dest}")
        text = extract_pdf_to_text(pdf)
        dest.write_text(text, encoding="utf-8")
        index.append({"source": str(rel), "out": str(dest.relative_to(out))})

    (out / "index.json").write_text(json.dumps(index, indent=2), encoding="utf-8")
    print("Done. Raw texts written to", out)


if __name__ == "__main__":
    main()
