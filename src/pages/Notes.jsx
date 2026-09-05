import { useState } from 'react';
import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';

export default function Notes() {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'general' });

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateNote(editingId, form);
    } else {
      addNote(form);
    }
    setForm({ title: '', content: '', category: 'general' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (note) => {
    setForm({ title: note.title, content: note.content || '', category: note.category || 'general' });
    setEditingId(note.id);
    setShowForm(true);
  };

  const categoryColors = {
    general: 'bg-gray-100 text-gray-600',
    work: 'bg-blue-100 text-blue-600',
    personal: 'bg-green-100 text-green-600',
    ideas: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Notes</h2>
          <p className="text-gray-500">{notes.length} notes</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', content: '', category: 'general' }); }} className="btn-primary">
          + New Note
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg">
            <h3 className="font-semibold text-dark mb-4">{editingId ? 'Edit Note' : 'New Note'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Title *" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" />
              <textarea placeholder="Write your note..." value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input h-40 resize-none" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="input">
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="ideas">Ideas</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Save'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="card text-center py-8 text-gray-400 md:col-span-2 lg:col-span-3">
            {search ? 'No notes match your search' : 'No notes yet. Create your first note!'}
          </div>
        ) : (
          filtered.map(note => (
            <div key={note.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-dark truncate flex-1">{note.title}</h4>
                <div className="flex gap-1 ml-2">
                  <button onClick={() => handleEdit(note)} className="p-1 hover:bg-neutral rounded">✏️</button>
                  <button onClick={() => { if(confirm('Delete?')) deleteNote(note.id); }} className="p-1 hover:bg-red-50 rounded">🗑️</button>
                </div>
              </div>
              <p className="text-sm text-gray-500 line-clamp-3 mb-3">{note.content || 'No content'}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-0.5 rounded ${categoryColors[note.category]}`}>{note.category}</span>
                <span className="text-xs text-gray-400">{dates.format(note.createdAt)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
