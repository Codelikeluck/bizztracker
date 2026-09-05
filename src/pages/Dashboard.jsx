import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';

export default function Dashboard() {
  const { contacts, tasks, notes, events } = useData();

  const stats = [
    { label: 'Contacts', value: contacts.length, color: 'bg-blue-500' },
    { label: 'Tasks', value: tasks.length, color: 'bg-green-500' },
    { label: 'Notes', value: notes.length, color: 'bg-yellow-500' },
    { label: 'Events', value: events.length, color: 'bg-purple-500' },
  ];

  const pendingTasks = tasks.filter(t => t.status === 'todo').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;

  const upcomingEvents = events
    .filter(e => dates.isFuture(e.date))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  const recentNotes = notes
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark">Dashboard</h2>
        <p className="text-gray-500">Welcome back to BizzTrack</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="card">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <span className="text-white font-bold text-lg">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-dark">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Task Progress */}
        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Task Progress</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-400 text-sm">No tasks yet</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Pending: {pendingTasks}</span>
                <span className="text-green-500">Completed: {completedTasks}</span>
              </div>
              <div className="w-full bg-neutral rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${tasks.length ? (completedTasks / tasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <h3 className="font-semibold text-dark mb-4">Upcoming Events</h3>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-400 text-sm">No upcoming events</p>
          ) : (
            <div className="space-y-2">
              {upcomingEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 p-2 bg-light rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{event.title}</p>
                    <p className="text-xs text-gray-500">{dates.format(event.date, 'datetime')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Notes */}
        <div className="card md:col-span-2">
          <h3 className="font-semibold text-dark mb-4">Recent Notes</h3>
          {recentNotes.length === 0 ? (
            <p className="text-gray-400 text-sm">No notes yet</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-3">
              {recentNotes.map(note => (
                <div key={note.id} className="p-3 bg-light rounded-lg">
                  <p className="font-medium text-sm truncate">{note.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-2">{dates.format(note.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
