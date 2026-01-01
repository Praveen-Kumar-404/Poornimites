// Populate current date, day, and week number dynamically
const d = new Date();
document.getElementById('current-date').textContent = d.toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});
document.getElementById('current-day').textContent = d.toLocaleDateString('en-US', {
  weekday: 'long'
});

// Calculate week number
const startOfYear = new Date(d.getFullYear(), 0, 1);
const pastDaysOfYear = (d - startOfYear) / 86400000;
const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
document.getElementById('week-number').textContent = weekNumber;

// Mood tracker functionality
document.querySelectorAll('.mood-scale span').forEach(mood => {
  mood.addEventListener('click', function () {
    document.querySelectorAll('.mood-scale span').forEach(m => m.classList.remove('active'));
    this.classList.add('active');
  });
});

// View toggle functionality
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const view = this.dataset.view;
    // Here you would implement different layouts for daily/weekly/monthly views
    console.log('Switched to', view, 'view');
  });
});

// Habit tracker functionality
document.querySelectorAll('.habit-item').forEach(habit => {
  habit.addEventListener('click', function () {
    this.classList.toggle('completed');

    // Update progress
    const completed = document.querySelectorAll('.habit-item.completed').length;
    const total = document.querySelectorAll('.habit-item').length;
    const percentage = (completed / total) * 100;

    document.querySelector('.habit-grid + div .progress-fill').style.width = percentage + '%';
    document.querySelector('.habit-grid + div .progress-fill').parentElement.previousElementSibling.textContent =
      `${completed}/${total} habits completed`;
  });
});

// Water tracker functionality
document.querySelectorAll('.water-glass').forEach((glass, index) => {
  glass.addEventListener('click', function () {
    // Toggle this glass and all previous ones
    document.querySelectorAll('.water-glass').forEach((g, i) => {
      if (i <= index) {
        g.classList.add('filled');
      } else {
        g.classList.remove('filled');
      }
    });

    // Update counter
    const filled = document.querySelectorAll('.water-glass.filled').length;
    const total = document.querySelectorAll('.water-glass').length;
    glass.closest('.health-item').querySelector('.value').textContent = `${filled}/${total} glasses`;
  });
});

// Star rating functionality
document.querySelectorAll('.star').forEach((star, index) => {
  star.addEventListener('click', function () {
    document.querySelectorAll('.star').forEach((s, i) => {
      if (i <= index) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    const rating = index + 1;
    const ratingText = ['Poor', 'Fair', 'Good', 'Great', 'Excellent'][index];
    this.closest('.rating-section').querySelector('div:last-child').textContent =
      `${rating}/5 - ${ratingText} Day!`;
  });
});

// Auto-save functionality for textareas (placeholder)
document.querySelectorAll('textarea').forEach(textarea => {
  textarea.addEventListener('input', function () {
    // Here you would implement auto-save to localStorage or backend
    localStorage.setItem('planner_' + this.placeholder.slice(0, 10), this.value);
  });

  // Load saved content
  const saved = localStorage.getItem('planner_' + textarea.placeholder.slice(0, 10));
  if (saved && !textarea.value) {
    textarea.value = saved;
  }
});

// Dynamic Calendar Generation
const calendarDays = document.getElementById('calendar-days');
const currentMonthYear = document.getElementById('current-month-year');

function renderCalendar(year, month) {
  if (!calendarDays || !currentMonthYear) return; // Guard clause
  calendarDays.innerHTML = ''; // Clear previous days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const numDays = lastDay.getDate();
  const startDay = firstDay.getDay(); // 0 for Sunday, 1 for Monday, etc.

  currentMonthYear.textContent = `📅 ${firstDay.toLocaleString('en-US', { month: 'long', year: 'numeric' })}`;

  // Add empty divs for the days before the first day of the month
  for (let i = 0; i < startDay; i++) {
    const emptyDiv = document.createElement('div');
    calendarDays.appendChild(emptyDiv);
  }

  // Add days of the month
  for (let i = 1; i <= numDays; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = i;
    if (i === d.getDate() && month === d.getMonth() && year === d.getFullYear()) {
      dayDiv.classList.add('current-day');
    }
    calendarDays.appendChild(dayDiv);
  }
}

// Initial render for the current month
renderCalendar(d.getFullYear(), d.getMonth());