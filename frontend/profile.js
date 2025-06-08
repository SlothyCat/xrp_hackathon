const currentUser = localStorage.getItem('currentUser');

const donations = [
    { date: '2025-06-05', charity: 'Clean Water',         xrp: 5,  fiatAmt: 6.1,  fiatCurr: 'EUR' },
    { date: '2025-06-07', charity: 'Education for All',    xrp: 10, fiatAmt: 12.0, fiatCurr: 'SGD' },
    { date: '2025-06-08', charity: 'Gaza Latest Charity',  xrp: 25, fiatAmt: 27.3, fiatCurr: 'USD' },
    { date: '2025-06-08', charity: 'Healthcare Access',    xrp: 50, fiatAmt: 54.5, fiatCurr: 'USD' },
  ];
  

  
// Calendar functionality
  let current = new Date();      
  let selectedDate = '';         
  
  function pad(n) { return n < 10 ? '0'+n : n; }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    }   
  
  function renderDonations(filterDate = '') {
    const list = document.getElementById('donation-list');
    list.innerHTML = '';  
  
    const toShow = filterDate
      ? donations.filter(d => d.date === filterDate)
      : donations;
  
    toShow.forEach(d => {
      const card = document.createElement('div');
      card.className = 'donation-item';
      card.innerHTML = `
        <div class="date">${formatDate(d.date)}</div>
        <div class="xrp">${d.xrp} XRP donated</div>
        <div class="charity">${d.charity}</div>
        <div class="fiat">(${d.fiatAmt.toFixed(2)} ${d.fiatCurr})</div>
      `;
      list.appendChild(card);
    });
  }
  
// Calendar grid 
  function renderCalendar() {
    const year = current.getFullYear();
    const month = current.getMonth();       
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();
  
    document.getElementById('calendar-month-year')
      .textContent = current.toLocaleString('default', { month: 'long', year: 'numeric' });
  
    const cal = document.getElementById('calendar');
    cal.innerHTML = '';  
  
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      cal.appendChild(empty);
    }
  
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day';
      const dateStr = `${year}-${pad(month+1)}-${pad(d)}`;
      cell.textContent = d;
  
      if (dateStr === selectedDate) {
        cell.classList.add('selected');
      }
  
      cell.addEventListener('click', () => {
        selectedDate = dateStr;
        renderDonations(selectedDate);
        renderCalendar(); 
      });
  
      cal.appendChild(cell);
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    // Auth bar
    document.getElementById('user-name').textContent = currentUser;
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    });
  
    // Month navigation
    document.getElementById('prev-month').addEventListener('click', () => {
      current.setMonth(current.getMonth() - 1);
      renderCalendar();
    });
    document.getElementById('next-month').addEventListener('click', () => {
      current.setMonth(current.getMonth() + 1);
      renderCalendar();
    });
    
    renderCalendar();
    renderDonations();  
  });
  