import fs from 'fs'
import path from 'path'
import { useEffect, useMemo, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'
import BookmarkButton from '../components/BookmarkButton'

// Auto-scroll to hash if present
function useScrollToHash() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const h = window.location.hash
    if (h) {
      const el = document.getElementById(h.replace('#',''))
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])
}

export default function Questions({ questions }: { questions: any[] }) {
  useScrollToHash()
  const [query, setQuery] = useState('')
  const [weekFilter, setWeekFilter] = useState<string>('all')
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({})

  const [bookmarks] = useLocalStorage<string[]>('bookmarks', [])
  const [completed, setCompleted] = useLocalStorage<string[]>('completed', [])
  const [difficult, setDifficult] = useLocalStorage<string[]>('difficult', [])

  const weeks = useMemo(() => Array.from(new Set(questions.map((q) => q.week))).sort((a,b)=>a-b), [questions])
  const sections = useMemo(() => Array.from(new Set(questions.map((q) => q.section || '—'))), [questions])

  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (weekFilter !== 'all' && String(q.week) !== weekFilter) return false
      if (sectionFilter !== 'all' && String(q.section || '—') !== sectionFilter) return false
      if (query) {
        const s = `${q.problemLabel} ${q.solution || ''}`.toLowerCase()
        if (!s.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [questions, weekFilter, sectionFilter, query])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Question Bank</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search problems or solutions" className="flex-1 p-2 border rounded" />
        <select className="p-2 border rounded" value={weekFilter} onChange={(e)=>setWeekFilter(e.target.value)}>
          <option value="all">All weeks</option>
          {weeks.map(w=> <option key={w} value={String(w)}>Week {w}</option>)}
        </select>
        <select className="p-2 border rounded" value={sectionFilter} onChange={(e)=>setSectionFilter(e.target.value)}>
          <option value="all">All sections</option>
          {sections.map(s=> <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="text-sm text-slate-600 mb-4">Showing {filtered.length} of {questions.length} problems — {bookmarks.length} bookmarked</div>

      <div className="grid gap-4">
          {filtered.map((q) => {
          const isCompleted = completed.includes(q.id)
          const isDifficult = difficult.includes(q.id)
          return (
              <div id={q.id} key={q.id} className="border rounded p-4 bg-white/80">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">{q.problemLabel}</div>
                  <div className="text-sm text-slate-600">Week {q.week} — {q.section || '—'}</div>
                </div>
                <div className="flex items-center">
                  {q.onRecommendedList && <span className="text-xs bg-yellow-300 px-2 py-1 rounded">Recommended</span>}
                  {q.isKeyQuestion && <span className="text-xs bg-red-300 px-2 py-1 rounded ml-2">Key</span>}
                  <BookmarkButton id={q.id} />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <button className={`px-2 py-1 text-sm rounded ${isCompleted ? 'bg-green-300' : 'bg-white/10'}`} onClick={()=> setCompleted(isCompleted ? completed.filter(c=>c!==q.id) : [...completed, q.id]) }>{isCompleted ? 'Completed' : 'Mark completed'}</button>
                <button className={`px-2 py-1 text-sm rounded ${isDifficult ? 'bg-rose-300' : 'bg-white/10'}`} onClick={()=> setDifficult(isDifficult ? difficult.filter(d=>d!==q.id) : [...difficult, q.id]) }>{isDifficult ? 'Marked difficult' : 'Mark difficult'}</button>
                <button className="text-sm text-primary ml-auto" onClick={() => setShowSolution({ ...showSolution, [q.id]: !showSolution[q.id] })}>
                  {showSolution[q.id] ? 'Hide solution' : 'Show solution'}
                </button>
              </div>
              {showSolution[q.id] && (
                <pre className="mt-2 bg-slate-50 p-3 rounded text-sm overflow-auto dark:bg-slate-800">{q.solution || 'solution unavailable'}</pre>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const qs = JSON.parse(fs.readFileSync(path.join(dataPath, 'questions_master.json'), 'utf-8'))
  return { props: { questions: qs } }
}
