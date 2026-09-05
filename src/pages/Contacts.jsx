import { useState } from 'react';
import { useData } from '../context/DataContext';

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', group: 'general' });

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.company?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateContact(editingId, form);
    } else {
      addContact(form);
    }
    setForm({ name: '', email: '', phone: '', company: '', group: 'general' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (contact) => {
    setForm({ name: contact.name, email: contact.email || '', phone: contact.phone || '', company: contact.company || '', group: contact.group || 'general' });
    setEditingId(contact.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this contact?')) deleteContact(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Contacts</h2>
          <p className="text-gray-500">{contacts.length} contacts</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ name: '', email: '', phone: '', company: '', group: 'general' }); }} className="btn-primary">
          + Add Contact
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search contacts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input"
      />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h3 className="font-semibold text-dark mb-4">{editingId ? 'Edit Contact' : 'New Contact'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Name *" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input" />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input" />
              <input type="text" placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="input" />
              <select value={form.group} onChange={e => setForm({...form, group: e.target.value})} className="input">
                <option value="general">General</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="family">Family</option>
              </select>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8 text-gray-400">
            {search ? 'No contacts match your search' : 'No contacts yet. Add your first contact!'}
          </div>
        ) : (
          filtered.map(contact => (
            <div key={contact.id} className="card flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                {contact.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark truncate">{contact.name}</p>
                <p className="text-sm text-gray-500 truncate">{contact.email || contact.phone || contact.company || 'No details'}</p>
              </div>
              <span className="text-xs bg-neutral px-2 py-1 rounded">{contact.group}</span>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(contact)} className="p-2 hover:bg-neutral rounded-lg">✏️</button>
                <button onClick={() => handleDelete(contact.id)} className="p-2 hover:bg-red-50 rounded-lg">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
