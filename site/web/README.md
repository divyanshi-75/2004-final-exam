FIT2004 D/HD Revision Site (minimal scaffold)

This is a minimal Next.js + TypeScript + Tailwind scaffold that consumes the
extracted JSON data in `site/data/`.

Quick start:

```bash
cd site/web
npm install
npm run build
npx serve out
```

Notes:
- The site is exported statically to `out/` by `next export`.
- The app reads pre-generated JSON files from `site/data/` during build time.
- This scaffold focuses on the Dashboard, Knowledge Base, Question Bank, and Exam Structure pages.
