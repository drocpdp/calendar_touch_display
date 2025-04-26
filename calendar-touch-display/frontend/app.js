
// frontend/app.js

// Replace these with your actual calendar IDs and labels
const calendars = [
    { id: 'e504865c0a6f405c8e4ce1551e1e490a319c2314cfe9a3cd9194e05266adc84a@group.calendar.google.com',  label: 'PRYCE CALENDAR'    },
    { id: '800befe0801aff4cff4875bdac241b751ebc523f180b359baf4def5387756af8@group.calendar.google.com',   label: 'PEYTON CALENDAR'   }
  ];
// frontend/app.js
  
  let currentView = 'weekly';
  let currentCal   = calendars[0].id;
  
  // Element references
  const homeBtn       = document.getElementById('homeBtn');
  const weeklyBtn     = document.getElementById('weeklyBtn');
  const refreshBtn    = document.getElementById('refreshBtn');
  const calBtnsDiv    = document.getElementById('calendarBtns');
  const currentLabelEl = document.getElementById('currentCalLabel');
  
  // Wire view buttons
  homeBtn.onclick    = () => { currentView = 'daily';  setActiveStates(); loadCalendar(); };
  weeklyBtn.onclick  = () => { currentView = 'weekly'; setActiveStates(); loadCalendar(); };
  refreshBtn.onclick = () => loadData();
  
  // Build calendar-switch buttons dynamically
  calendars.forEach((cal, idx) => {
    const btn = document.createElement('button');
    btn.textContent = cal.label;
    btn.classList.add('cal-btn');
    btn.onclick = () => {
      currentCal = cal.id;
      setActiveStates();
      loadCalendar();
    };
    calBtnsDiv.appendChild(btn);
  });
  
  // Helper to highlight active buttons
  function setActiveStates() {
    // View buttons
    homeBtn.classList.toggle('active', currentView === 'daily');
    weeklyBtn.classList.toggle('active', currentView === 'weekly');
    // Calendar buttons
    Array.from(calBtnsDiv.children).forEach((btn, i) => {
      btn.classList.toggle('active', calendars[i].id === currentCal);
    });
  }
  
  // Helper to format ISO date/time
  function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
  }
  
  // Fetch and display next events
  async function loadData() {
    const res  = await fetch(`/api/next?cal=${currentCal}`);
    const data = await res.json();
  
    document.getElementById('nextEvent1').innerHTML = `
      <div class="next-title">NEXT EVENT</div>
      <div class="next-details">
        <b>${data.next1.summary}</b><br>
        ${ data.next1.start 
            ? new Date(data.next1.start).toLocaleString() 
            : 'No upcoming events' }
      </div>
    `;
    document.getElementById('nextEvent2').innerHTML = `
      <div class="next-title">NEXT EVENT</div>
      <div class="next-details">
        <b>${data.next2.summary}</b><br>
        ${ data.next2.start 
            ? new Date(data.next2.start).toLocaleString() 
            : 'No upcoming events' }
      </div>
    `;
  }
  
  // Load & display calendar iframe and data
  async function loadCalendar() {
    // Update header label
    const calObj = calendars.find(c => c.id === currentCal);
    currentLabelEl.textContent = `Showing: ${calObj.label} (${currentView.charAt(0).toUpperCase() + currentView.slice(1)})`;
  
    // Embed the calendar iframe
    document.getElementById('calendarContainer').innerHTML = `
      <iframe
        src="/api/calendar?cal=${encodeURIComponent(currentCal)}&view=${currentView}"
        frameborder="0"
        style="width:100%; height:100%;"
      ></iframe>
    `;
  
    // Refresh next events
    await loadData();
  }
  
  // Initial setup
  setActiveStates();
  loadCalendar();
  setInterval(loadData, 30000);  // auto-refresh every 30 seconds
  