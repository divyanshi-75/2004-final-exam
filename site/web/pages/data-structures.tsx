import fs from 'fs'
import path from 'path'
import Link from 'next/link'

export default function DataStructures({ dataStructures }: { dataStructures: any[] }) {
  const slug = (s: string) => s.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase().replace(/(^-|-$)/g, '')
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Data Structures</h2>
      <div className="grid gap-4">
        {dataStructures.map((d) => (
          <div key={d.name} className="border rounded p-4 bg-white/80">
            <div className="flex justify-between items-center">
              <div>
                <Link href={`/data-structures/${slug(d.name)}`} className="font-semibold text-primary underline">{d.name}</Link>
                <div className="text-sm text-slate-600">Source: {d.source}</div>
              </div>
            </div>
            <div className="mt-2 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{(d.description||'').slice(0, 600)}{d.description && d.description.length>600? '...':''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const dataStructures = JSON.parse(fs.readFileSync(path.join(dataPath, 'data_structures.json'), 'utf-8'))
  return { props: { dataStructures } }
}
