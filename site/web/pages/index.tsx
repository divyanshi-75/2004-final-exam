import fs from 'fs'
import path from 'path'

export default function Dashboard({ stats }: { stats: any }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Weeks" value={stats.weeks} />
        <StatCard label="Questions" value={stats.questions} />
        <StatCard label="Recommended" value={stats.recommended} />
        <StatCard label="Key Questions" value={stats.key} />
      </div>
      <section className="mt-6">
        <h3 className="text-xl font-semibold">Exam summary</h3>
        <p className="mt-2">35 marks total — 3 hours; Sections 1–3 (see Exam Structure page).</p>
        <div className="mt-4">
          <h4 className="font-semibold">Score bands</h4>
          <ul className="list-disc ml-6">
            <li>Credit: 0–4 marks</li>
            <li>Distinction: 5–14 marks</li>
            <li>High Distinction: 15–35 marks</li>
          </ul>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="border rounded p-4 bg-white/80 shadow">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  )
}

export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), '..', 'data')
  // fallback paths if run from project root
  const fallback = path.join(process.cwd(), '..', '..', 'site', 'data')
  const dataPath = fs.existsSync(path.join(dataDir, 'questions_master.json')) ? dataDir : fallback

  const qs = JSON.parse(fs.readFileSync(path.join(dataPath, 'questions_master.json'), 'utf-8'))
  const rec = JSON.parse(fs.readFileSync(path.join(dataPath, 'exam_recommended_questions_linked.json'), 'utf-8'))

  const stats = {
    weeks: new Set(qs.map((q: any) => q.week)).size,
    questions: qs.length,
    recommended: rec.length,
    key: rec.filter((r: any) => r.isKeyQuestion).length,
  }

  return { props: { stats } }
}
