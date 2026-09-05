import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { v4 as uuidv4 } from 'uuid';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setContacts(storage.get('contacts') || []);
    setTasks(storage.get('tasks') || []);
    setNotes(storage.get('notes') || []);
    setEvents(storage.get('events') || []);
  }, []);

  const saveContacts = (data) => {
    setContacts(data);
    storage.set('contacts', data);
  };

  const saveTasks = (data) => {
    setTasks(data);
    storage.set('tasks', data);
  };

  const saveNotes = (data) => {
    setNotes(data);
    storage.set('notes', data);
  };

  const saveEvents = (data) => {
    setEvents(data);
    storage.set('events', data);
  };

  // Contacts
  const addContact = (contact) => {
    const newContact = { ...contact, id: uuidv4(), createdAt: new Date().toISOString() };
    saveContacts([...contacts, newContact]);
    return newContact;
  };

  const updateContact = (id, updates) => {
    saveContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id) => {
    saveContacts(contacts.filter(c => c.id !== id));
  };

  // Tasks
  const addTask = (task) => {
    const newTask = { ...task, id: uuidv4(), createdAt: new Date().toISOString(), status: 'todo' };
    saveTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = (id, updates) => {
    saveTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  // Notes
  const addNote = (note) => {
    const newNote = { ...note, id: uuidv4(), createdAt: new Date().toISOString() };
    saveNotes([...notes, newNote]);
    return newNote;
  };

  const updateNote = (id, updates) => {
    saveNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  // Events
  const addEvent = (event) => {
    const newEvent = { ...event, id: uuidv4(), createdAt: new Date().toISOString() };
    saveEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updates) => {
    saveEvents(events.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id) => {
    saveEvents(events.filter(e => e.id !== id));
  };

  return (
    <DataContext.Provider value={{
      contacts, tasks, notes, events,
      addContact, updateContact, deleteContact,
      addTask, updateTask, deleteTask,
      addNote, updateNote, deleteNote,
      addEvent, updateEvent, deleteEvent
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
export default DataContext;
