import fs from 'fs'
import path from 'path'

export default function Exam({ recs }: { recs: any[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Exam Structure</h2>
      <p>35 marks — 3 hours — on paper, in person.</p>
      <div className="mt-4">
        <h3 className="font-semibold">Sections</h3>
        <ul className="list-disc ml-6 mt-2">
          <li><strong>Section 1</strong> — 10 marks: 10 × 1 mark. Short definitions/justifications. All-or-nothing marking.</li>
          <li><strong>Section 2</strong> — 10 marks: 5 × 2 marks. Apply understanding; partial marks possible.</li>
          <li><strong>Section 3</strong> — 15 marks: choose 3 × 5 marks from &gt;3 offered.</li>
        </ul>
        <p className="mt-2 text-sm text-slate-600">Caveat: a section label on a question only indicates the skills it exercises — it does not guarantee the difficulty or the question type.</p>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold">Recommended questions (from Exam-structure)</h3>
        <div className="grid gap-2 mt-2">
          {recs.map((r) => (
            <div key={`${r.week}-${r.problemLabel}`} className="p-3 border rounded bg-white/80">
              <div className="flex justify-between">
                <div>{r.problemLabel} — Week {r.week} — Section {r.section}</div>
                {r.isKeyQuestion && <div className="text-xs bg-red-300 px-2 py-1 rounded">Key</div>}
              </div>
              <div className="text-sm text-slate-600 mt-1">Linked question IDs: {r.questionIds.length ? r.questionIds.join(', ') : 'none in provided sheets'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const recs = JSON.parse(fs.readFileSync(path.join(dataPath, 'exam_recommended_questions_linked.json'), 'utf-8'))
  return { props: { recs } }
}
