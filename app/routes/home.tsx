import { useEffect, useState } from 'react'
import { getCategories } from '../lib/db'

export default function HomePage() {
  const [categories, setCategories] = useState<{ id: number, name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data || [])
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <p>Ładowanie kategorii...</p>
  if (error) return <p>Błąd: {error}</p>

  return (
    <div>
      <h1>Witam Cię w Scan & Cook!</h1>
      <h2>Kategorie:</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat.id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  )
}
