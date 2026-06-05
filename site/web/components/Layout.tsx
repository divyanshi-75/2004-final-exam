import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <header className="bg-primary text-white p-4 shadow">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">FIT2004 D/HD Revision</h1>
          <div className="flex items-center gap-6">
            <nav className="space-x-4 hidden sm:inline">
              <Link href="/">Dashboard</Link>
              <Link href="/knowledge">Knowledge Base</Link>
              <Link href="/algorithms">Algorithms</Link>
              <Link href="/questions">Question Bank</Link>
              <Link href="/exam">Exam Structure</Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 p-6">{children}</main>
      <footer className="bg-slate-100 dark:bg-slate-800 p-4 text-sm text-center">
        Built from provided materials — no content invented.
      </footer>
    </div>
  )
}
