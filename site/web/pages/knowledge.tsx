import fs from 'fs'
import path from 'path'

export default function Knowledge({ notes, algorithms, dataStructures }: { notes: string, algorithms: any[], dataStructures: any[] }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Knowledge Base</h2>
      <p className="text-sm text-slate-600">Lecture notes and course notes extracted from materials.</p>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Algorithms</h3>
        <div className="grid gap-3 mt-2">
          {algorithms.map((a: any) => (
            <div key={a.name} className="p-3 border rounded bg-white/80">
              <div className="font-medium">{a.name.replace(/\.+$/, '')}</div>
              <div className="text-sm text-slate-600">{a.timeComplexity || ''} {a.spaceComplexity || ''}</div>
              <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{a.purpose.slice(0,400)}{a.purpose.length>400?'...':''}</div>
              {a.relatedQuestionIds && a.relatedQuestionIds.length>0 && (
                <div className="mt-2 text-sm">
                  <div className="text-xs text-slate-500">Related problems</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {a.relatedQuestionIds.map((id: string)=> (
                      <a key={id} href={`/questions#${id}`} className="text-primary text-sm underline">{id}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Data Structures</h3>
        <div className="grid gap-3 mt-2">
          {dataStructures.map((d: any) => (
            <div key={d.name} className="p-3 border rounded bg-white/80">
              <div className="font-medium">{d.name}</div>
              <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{d.description && d.description.slice(0,400)}{d.description && d.description.length>400?'...':''}</div>
              {d.relatedQuestionIds && d.relatedQuestionIds.length>0 && (
                <div className="mt-2 text-sm">
                  <div className="text-xs text-slate-500">Related problems</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {d.relatedQuestionIds.map((id: string)=> (
                      <a key={id} href={`/questions#${id}`} className="text-primary text-sm underline">{id}</a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Course notes (excerpt)</h3>
        <div className="mt-4">
          <pre className="whitespace-pre-wrap bg-white/80 p-4 rounded text-sm">{notes}</pre>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const notesPath = path.join(dataPath, 'course-note__FIT2004_course_notes_20260321.pdf.txt')
  const notes = fs.existsSync(notesPath) ? fs.readFileSync(notesPath, 'utf-8').slice(0, 20000) : ''
  const algorithms = fs.existsSync(path.join(dataPath, 'algorithms.json')) ? JSON.parse(fs.readFileSync(path.join(dataPath, 'algorithms.json'), 'utf-8')) : []
  const dataStructures = fs.existsSync(path.join(dataPath, 'data_structures.json')) ? JSON.parse(fs.readFileSync(path.join(dataPath, 'data_structures.json'), 'utf-8')) : []
  return { props: { notes, algorithms, dataStructures } }
}
