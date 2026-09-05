import { useState } from 'react';
import { useData } from '../context/DataContext';
import { dates } from '../utils/dates';

export default function Calendar() {
  const { events, addEvent, updateEvent, deleteEvent } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: '', date: '', time: '', description: '' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = dates.getCalendarDays(year, month);
  const weekDays = dates.getWeekDays();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (date) => {
    if (!date) return [];
    return events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (day) => {
    if (day.date) {
      setSelectedDate(day.date);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dateTime = form.time ? `${form.date}T${form.time}` : form.date;
    const eventData = { title: form.title, date: dateTime, description: form.description };
    
    if (editingId) {
      updateEvent(editingId, eventData);
    } else {
      addEvent(eventData);
    }
    setForm({ title: '', date: '', time: '', description: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (event) => {
    const eventDate = new Date(event.date);
    setForm({
      title: event.title,
      date: eventDate.toISOString().split('T')[0],
      time: eventDate.toTimeString().slice(0, 5),
      description: event.description || ''
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-dark">Calendar</h2>
          <p className="text-gray-500">{events.length} events</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditingId(null); setForm({ title: '', date: new Date().toISOString().split('T')[0], time: '', description: '' }); }} className="btn-primary">
          + Add Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h3 className="font-semibold text-dark mb-4">{editingId ? 'Edit Event' : 'New Event'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Event title *" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" />
              <div className="flex gap-3">
                <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="input flex-1" />
                <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="input flex-1" />
              </div>
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input h-20 resize-none" />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingId ? 'Update' : 'Add'}</button>
                <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="p-2 hover:bg-neutral rounded-lg">←</button>
            <h3 className="font-semibold text-dark">{dates.getMonthName(month)} {year}</h3>
            <button onClick={nextMonth} className="p-2 hover:bg-neutral rounded-lg">→</button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
            ))}
            {calendarDays.map((day, i) => {
              const dayEvents = getEventsForDate(day.date);
              const isToday = day.date && dates.isToday(day.date);
              const isSelected = selectedDate && day.date && selectedDate.toDateString() === day.date.toDateString();
              
              return (
                <button
                  key={i}
                  onClick={() => handleDateClick(day)}
                  disabled={!day.date}
                  className={`aspect-square p-1 rounded-lg text-sm flex flex-col items-center justify-center relative
                    ${!day.date ? 'invisible' : ''}
                    ${isToday ? 'bg-primary text-white' : ''}
                    ${isSelected && !isToday ? 'bg-primary/20' : ''}
                    ${day.date && !isToday ? 'hover:bg-neutral' : ''}
                  `}
                >
                  {day.day}
                  {dayEvents.length > 0 && (
                    <div className={`w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-primary'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="card">
          <h3 className="font-semibold text-dark mb-4">
            {selectedDate ? dates.format(selectedDate, 'long') : 'Select a date'}
          </h3>
          {selectedDate ? (
            selectedEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">No events on this date</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(event => (
                  <div key={event.id} className="p-3 bg-light rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-sm">{event.title}</p>
                        {event.time && <p className="text-xs text-gray-500">{event.time}</p>}
                        {event.description && <p className="text-xs text-gray-400 mt-1">{event.description}</p>}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEdit(event)} className="p-1 hover:bg-neutral rounded text-xs">✏️</button>
                        <button onClick={() => { if(confirm('Delete?')) deleteEvent(event.id); }} className="p-1 hover:bg-red-50 rounded text-xs">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <p className="text-gray-400 text-sm">Click a date to see events</p>
          )}
        </div>
      </div>
    </div>
  );
}
