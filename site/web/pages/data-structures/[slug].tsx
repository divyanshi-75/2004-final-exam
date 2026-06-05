import fs from 'fs'
import path from 'path'

export default function DSDetail({ ds }: { ds: any }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">{ds.name}</h2>
      <div className="text-sm text-slate-600 mb-4">Source: {ds.source}</div>
      <div className="prose max-w-none dark:prose-invert">
        <pre className="whitespace-pre-wrap bg-white/80 p-4 rounded">{ds.description}</pre>
      </div>
      {ds.relatedQuestionIds && ds.relatedQuestionIds.length>0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Related problems</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {ds.relatedQuestionIds.map((id:string)=> (
              <a key={id} href={`/questions#${id}`} className="text-primary underline">{id}</a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export async function getStaticPaths() {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const dataStructures = JSON.parse(fs.readFileSync(path.join(dataPath, 'data_structures.json'), 'utf-8'))
  const paths = dataStructures.map((d:any)=> ({ params: { slug: d.name.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase().replace(/(^-|-$)/g,'') } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }: any) {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const dataStructures = JSON.parse(fs.readFileSync(path.join(dataPath, 'data_structures.json'), 'utf-8'))
  const slug = params.slug
  const ds = dataStructures.find((d:any)=> d.name.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase().replace(/(^-|-$)/g,'') === slug)
  return { props: { ds } }
}
