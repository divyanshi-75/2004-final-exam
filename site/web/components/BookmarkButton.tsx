import useLocalStorage from '../hooks/useLocalStorage'

export default function BookmarkButton({ id }: { id: string }) {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('bookmarks', [])
  const active = bookmarks.includes(id)

  function toggle() {
    if (active) setBookmarks(bookmarks.filter((b) => b !== id))
    else setBookmarks([...bookmarks, id])
  }

  return (
    <button onClick={toggle} className={`px-2 py-1 text-sm rounded ${active ? 'bg-yellow-400' : 'bg-white/10'} ml-2`}>
      {active ? 'Bookmarked' : 'Bookmark'}
    </button>
  )
}
