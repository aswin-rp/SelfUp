import { FormEvent, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { JournalEntry } from '../types'

export default function Journal() {
  const { session } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [entryDate, setEntryDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadEntries()
  }, [])

  async function loadEntries() {
    setLoading(true)
    const { data } = await supabase
      .from('journal_entries')
      .select('*')
      .order('entry_date', { ascending: false })
    setEntries((data as JournalEntry[]) ?? [])
    setLoading(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!content.trim() || !session) return

    if (editingId) {
      await supabase
        .from('journal_entries')
        .update({ content, entry_date: entryDate, updated_at: new Date().toISOString() })
        .eq('id', editingId)
    } else {
      await supabase.from('journal_entries').insert({
        content,
        entry_date: entryDate,
        user_id: session.user.id
      })
    }

    setContent('')
    setEntryDate(format(new Date(), 'yyyy-MM-dd'))
    setEditingId(null)
    loadEntries()
  }

  function startEdit(entry: JournalEntry) {
    setEditingId(entry.id)
    setEntryDate(entry.entry_date)
    setContent(entry.content)
  }

  async function deleteEntry(id: string) {
    await supabase.from('journal_entries').delete().eq('id', id)
    if (editingId === id) {
      setEditingId(null)
      setContent('')
    }
    loadEntries()
  }

  const filtered = entries.filter((e) =>
    e.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Journal</h1>
      </div>

      <form className="journal-form" onSubmit={handleSubmit}>
        <input
          type="date"
          value={entryDate}
          onChange={(e) => setEntryDate(e.target.value)}
        />
        <textarea
          placeholder="What happened today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <div className="form-actions">
          {editingId && (
            <button
              type="button"
              className="secondary"
              onClick={() => { setEditingId(null); setContent(''); setEntryDate(format(new Date(), 'yyyy-MM-dd')) }}
            >
              Cancel edit
            </button>
          )}
          <button type="submit">{editingId ? 'Save changes' : 'Add entry'}</button>
        </div>
      </form>

      <input
        className="search-input"
        placeholder="Search entries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="muted">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="muted">No entries found.</p>
      ) : (
        <div className="journal-list">
          {filtered.map((entry) => (
            <div key={entry.id} className="journal-entry">
              <div className="journal-entry-header">
                <strong>{format(new Date(entry.entry_date), 'MMMM d, yyyy')}</strong>
                <div>
                  <button className="link-button" onClick={() => startEdit(entry)}>Edit</button>
                  <button className="link-button" onClick={() => deleteEntry(entry.id)}>Delete</button>
                </div>
              </div>
              <p>{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
