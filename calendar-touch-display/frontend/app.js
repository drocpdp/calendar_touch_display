
// frontend/app.js

// Replace these with your actual calendar IDs and labels
const calendars = [
    { id: 'e504865c0a6f405c8e4ce1551e1e490a319c2314cfe9a3cd9194e05266adc84a@group.calendar.google.com',  label: 'PRYCE CALENDAR'    },
    { id: '800befe0801aff4cff4875bdac241b751ebc523f180b359baf4def5387756af8@group.calendar.google.com',   label: 'PEYTON CALENDAR'   }
  ];
  
  
  let currentView = 'weekly';
  let currentCal  = calendars[0].id;
  
  // Elements
  const homeBtn    = document.getElementById('homeBtn');
  const weeklyBtn  = document.getElementById('weeklyBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const calBtnsDiv = document.getElementById('calendarBtns');
  const currentLabelEl = document.getElementById('currentCalLabel');
  
  // Wire view buttons
  homeBtn.onclick    = () => { currentView = 'daily';  setActiveStates(); loadCalendar(); };
  weeklyBtn.onclick  = () => { currentView = 'weekly'; setActiveStates(); loadCalendar(); };
  refreshBtn.onclick = () => loadData();
  
  // Build calendar-switch buttons
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
    homeBtn   .classList.toggle('active', currentView === 'daily');
    weeklyBtn.classList.toggle('active', currentView === 'weekly');
    // Calendar buttons
    Array.from(calBtnsDiv.children).forEach((btn, i) => {
      btn.classList.toggle('active', calendars[i].id === currentCal);
    });
  }
  
  // Load & display calendar
  async function loadCalendar() {
    // Update header label
    const calObj = calendars.find(c => c.id === currentCal);
    currentLabelEl.textContent = `Showing: ${calObj.label} (${currentView.charAt(0).toUpperCase()+currentView.slice(1)})`;
  
    // Embed the iframe
    document.getElementById('calendarContainer').innerHTML = `
      <iframe
        src="/api/calendar?cal=${encodeURIComponent(currentCal)}&view=${currentView}"
        frameborder="0"
        style="width:100%; height:100%;"
      ></iframe>
    `;
  
    // Update next-event panels
    await loadData();
  }
  
  // Fetch and display next events
  async function loadData() {
    const res  = await fetch(`/api/next?cal=${currentCal}`);
    const data = await res.json();
    document.getElementById('nextEvent1').textContent = `${calendars[0].label}: ${data.next1}`;
    document.getElementById('nextEvent2').textContent = `${calendars[1].label}: ${data.next2}`;
  }
  
  // Initial setup
  setActiveStates();
  loadCalendar();
  setInterval(loadData, 300000);  // auto-refresh every 5 minutes
  