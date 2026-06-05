import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function Algorithms({ algorithms }: { algorithms: any[] }) {
  const slug = (s: string) => s.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().replace(/(^-|-$)/g, '')
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Algorithms</h2>
      <div className="grid gap-4">
        {algorithms.map((a) => (
          <div key={a.name} className="border rounded p-4 bg-white/80">
            <div className="flex justify-between items-center">
              <div>
                <Link href={`/algorithms/${slug(a.name)}`} className="font-semibold text-primary underline">{a.name.replace(/\.+$/, '')}</Link>
                <div className="text-sm text-slate-600">Source: {a.source}</div>
              </div>
              <div className="text-sm text-slate-500">{a.timeComplexity || ''}</div>
            </div>
            <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{a.purpose.slice(0, 600)}{a.purpose.length>600? '...':''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const algorithms = JSON.parse(fs.readFileSync(path.join(dataPath, 'algorithms.json'), 'utf-8'))
  return { props: { algorithms } }
}
