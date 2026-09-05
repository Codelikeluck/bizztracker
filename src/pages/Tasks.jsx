import { useState } from 'react';
import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });

  const filtered = tasks.filter(t => {
    if (filter === 'todo') return t.status === 'todo';
    if (filter === 'done') return t.status === 'done';
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTask(editingId, form);
    } else {
      addTask(form);
    }
    setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setForm({ title: task.title, description: task.description || '', priority: task.priority || 'medium', dueDate: task.dueDate || '' });
    setEditingId(task.id);
    setShowForm(true);
  };

  const toggleStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    updateTask(id, { status: task.status === 'todo' ? 'done' : 'todo' });
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Tasks</h2>
          <p className="text-gray-500">{tasks.filter(t => t.status === 'todo').length} pending</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', description: '', priority: 'medium', dueDate: '' }); }} className="btn-primary">
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'todo', 'done'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-sm ${filter === f ? 'bg-primary text-white' : 'bg-neutral text-gray-600'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h3 className="font-semibold text-dark mb-4">{editingId ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Task title *" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input h-20 resize-none" />
              <div className="flex gap-3">
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="input flex-1">
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="input flex-1" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center py-8 text-gray-400">
            {filter === 'all' ? 'No tasks yet' : `No ${filter} tasks`}
          </div>
        ) : (
          filtered.map(task => (
            <div key={task.id} className={`card flex items-start gap-3 ${task.status === 'done' ? 'opacity-60' : ''}`}>
              <button onClick={() => toggleStatus(task.id)} className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${task.status === 'done' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                {task.status === 'done' && <span className="text-white text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.status === 'done' ? 'line-through text-gray-400' : 'text-dark'}`}>{task.title}</p>
                {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>{task.priority}</span>
                  {task.dueDate && (
                    <span className={`text-xs px-2 py-0.5 rounded ${dates.isPast(task.dueDate) && task.status === 'todo' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      Due: {dates.format(task.dueDate)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(task)} className="p-2 hover:bg-neutral rounded-lg">✏️</button>
                <button onClick={() => { if(confirm('Delete?')) deleteTask(task.id); }} className="p-2 hover:bg-red-50 rounded-lg">🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
