# FIT2004 Revision Site — README

This repository contains scripts and a static Next.js site to serve extracted course materials for FIT2004.

Key folders
- `site/data_raw/` — raw text extracted from PDFs (already present)
- `site/data/` — typed JSON data produced by extraction scripts
- `site/scripts/` — Python scripts for extraction and refinement
- `site/web/` — Next.js + TypeScript + Tailwind web scaffold

Python extraction (recommended)
1. Activate the included virtualenv (if present):

```bash
# from repo root
source site/.venv/bin/activate
```

2. Run refinement/extraction scripts (they write into `site/data/`):

```bash
python3 site/scripts/extract_all.py
python3 site/scripts/parse_applied_sheets.py
python3 site/scripts/link_recommended_to_questions.py
python3 site/scripts/refine_algorithms.py
python3 site/scripts/refine_data_structures.py
```

Note: scripts are conservative and only extract text present in `site/data_raw/`. They will not invent missing content.

Next.js site (build & export)
- The site is a static Next.js app under `site/web/`.
- To build and export you need Node.js and npm installed.

```bash
# from site/web
npm install
npm run build
npm run export    # produces out/ for static hosting
```

If `npm` is not available in your environment (e.g., this runner), run the above commands locally where Node is installed.

Local testing
- You can view the generated JSON files directly under `site/data/`.
- The Next.js pages read data at build time from `site/data/`.

If you want, I can:
- polish the README with environment-specific notes (macOS, using Homebrew for Node), or
- write a lightweight Dockerfile to build the static site reproducibly.

