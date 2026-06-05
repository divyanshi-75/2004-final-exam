import fs from 'fs'
import path from 'path'
import BookmarkButton from '../../components/BookmarkButton'

export default function AlgorithmDetail({ alg }: { alg: any }) {
  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-2">{alg.name.replace(/\.+$/, '')}</h2>
          <div className="text-sm text-slate-600">Source: {alg.source} — {alg.timeComplexity || ''} {alg.spaceComplexity || ''}</div>
        </div>
        <div className="text-right">
          <BookmarkButton id={`alg:${alg.name.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase()}`} />
          {alg.hasRecommended && (
            <div className="text-sm mt-2 text-yellow-600">{alg.recommendedQuestionIds.length} recommended problem(s) linked</div>
          )}
        </div>
      </div>

      <div className="prose max-w-none dark:prose-invert mt-4">
        <pre className="whitespace-pre-wrap bg-white/80 p-4 rounded">{alg.purpose}</pre>
      </div>
      {alg.relatedQuestionIds && alg.relatedQuestionIds.length>0 && (
        <div className="mt-4">
          <h3 className="font-semibold">Related problems</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {alg.relatedQuestionIds.map((id:string)=> (
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
  const algorithms = JSON.parse(fs.readFileSync(path.join(dataPath, 'algorithms.json'), 'utf-8'))
  const paths = algorithms.map((a:any)=> ({ params: { slug: a.name.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase().replace(/(^-|-$)/g,'') } }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }: any) {
  const dataPath = path.join(process.cwd(), '..', '..', 'site', 'data')
  const algorithms = JSON.parse(fs.readFileSync(path.join(dataPath, 'algorithms.json'), 'utf-8'))
  const slug = params.slug
  const alg = algorithms.find((a:any)=> a.name.replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase().replace(/(^-|-$)/g,'') === slug)
  return { props: { alg } }
}
