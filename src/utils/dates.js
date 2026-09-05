export const dates = {
  format(date, format = 'short') {
    const d = new Date(date);
    const options = {
      short: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
      time: { hour: '2-digit', minute: '2-digit' },
      datetime: { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    };
    return d.toLocaleDateString('en-US', options[format] || options.short);
  },

  isToday(date) {
    const d = new Date(date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  },

  isPast(date) {
    return new Date(date) < new Date();
  },

  isFuture(date) {
    return new Date(date) > new Date();
  },

  addDays(date, days) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  },

  getMonthName(month) {
    const names = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return names[month];
  },

  getWeekDays() {
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  },

  getCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = this.getDaysInMonth(year, month);
    const days = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: null, date: null });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, date: new Date(year, month, i) });
    }
    
    return days;
  }
};

export default dates;
