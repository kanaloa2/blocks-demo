  // 1. CONFIGURATION & GLOBAL STATE
  const SUPABASE_URL = 'https://rytmoxxpoegllfbusykt.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_r86loDzli-AOYkWFDKbe9A_X9-uATdk';
  const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  let allHouseholds = []; 

  // 2. GLOBAL UI FUNCTIONS (Accessible by HTML onclick)
  function toggleDropdown() {
      const menu = document.getElementById('account-dropdown');
      if (menu) {
          const isHidden = menu.style.display === 'none' || menu.style.display === '';
          menu.style.display = isHidden ? 'block' : 'none';
      }
  }

  async function toggleAdminModal() {
      const email = prompt("Enter Admin Email:");
      const password = prompt("Enter Admin Password:");
      if (email && password) {
          const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
          if (error) alert("Login failed: " + error.message);
          else window.location.reload();
      }
  }

  async function handleAdminLogout() {
      await _supabase.auth.signOut();
      window.location.reload();
  }

  async function deleteHousehold(id) {
      if (!confirm("Are you sure you want to delete this record?")) return;
      const { error } = await _supabase.from('households').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchHouseholds(); // Refresh table
  }

  // 3. IDENTITY & DATA FETCHING
  async function checkAdminStatus() {
      const { data: { user } } = await _supabase.auth.getUser();
      const avatar = document.getElementById('user-avatar');
      const statusLabel = document.getElementById('dropdown-status');
      const nameLabel = document.getElementById('dropdown-name');
      const logoutBtn = document.getElementById('logout-btn');

      if (user) {
          // ADMIN MODE (CJ BROWNING)
          document.body.classList.add('is-admin');
          if(avatar) {
              avatar.innerText = "CJ";
              avatar.style.background = "#000";
              avatar.style.color = "#fff";
          }
          if(statusLabel) statusLabel.innerText = "Admin Access";
          if(nameLabel) nameLabel.innerText = "CJ Browning";
          if(logoutBtn) {
              logoutBtn.style.color = "#ff4d4d";
              logoutBtn.style.cursor = "pointer";
              logoutBtn.style.pointerEvents = "auto";
          }
      } else {
          // DEMO MODE (JAMES DAVIDSON)
          document.body.classList.remove('is-admin');
          if(avatar) {
              avatar.innerText = "JD";
              avatar.style.background = "linear-gradient(135deg, #534AB7, #1D9E75)";
              avatar.style.color = "#fff";
          }
          if(statusLabel) statusLabel.innerText = "Demo Mode";
          if(nameLabel) nameLabel.innerText = "James Davidson, CFP";
      }
      
      fetchHouseholds();
  }

  async function fetchHouseholds() {
      try {
          const { data, error } = await _supabase.from('households').select('*');
          if (error) throw error;
          allHouseholds = data || [];
          updateMetrics(allHouseholds);
          renderTable(allHouseholds);
      } catch (err) {
          console.error("Fetch error:", err.message);
      }
  }

  // 4. TABLE RENDERING & FILTERS
  const formatAUM = (val) => {
      if (!val) return '$0.0M';
      return '$' + (Number(val) / 1000000).toFixed(1) + 'M';
  };

  const getSentimentTheme = (s) => {
      const themes = {
          'Confident': { bg: '#EAF3DE', dot: '#2E7D32', text: '#1B4D1E' },
          'Neutral':   { bg: '#E1F5EE', dot: '#1D9E75', text: '#0B5D46' },
          'Concerned': { bg: '#FEF3DC', dot: '#A06010', text: '#6D410B' },
          'Worried':   { bg: '#FAECE7', dot: '#C94E28', text: '#8A351B' },
          'Fearful':   { bg: '#FCEBEB', dot: '#B83232', text: '#7A2121' }
      };
      return themes[s] || { bg: '#f0efe9', dot: '#9a9994', text: '#5c5b57' };
  };

  function updateMetrics(data) {
      const totalAUM = data.reduce((sum, h) => sum + (Number(h.aum) || 0), 0);
      const avgYTD = data.length > 0 ? (data.reduce((sum, h) => sum + (Number(h.ytd_return) || 0), 0) / data.length) : 0;
      const rebalanceCount = data.filter(h => h.status === 'Rebalance').length;
      
      const metrics = document.querySelectorAll('.metric-val');
      if (metrics[0]) metrics[0].innerText = formatAUM(totalAUM);
      if (metrics[1]) metrics[1].innerText = data.length;
      if (metrics[2]) metrics[2].innerText = `${rebalanceCount} clients`;
      if (metrics[3]) metrics[3].innerText = `+${avgYTD.toFixed(1)}%`;
  }

  function renderTable(data) {
      const listContainer = document.getElementById('clients-list');
      if (!listContainer) return;
      listContainer.innerHTML = '';

      data.forEach(house => {
          const theme = getSentimentTheme(house.sentiment);
          const initials = house.name ? house.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : '??';
          const row = document.createElement('tr');

          row.innerHTML = `
            <td>
              <div class="client-cell">
                <div class="client-avatar" style="background:${theme.bg}; color:${theme.text}; font-weight:700; font-family:'Syne', sans-serif;">${initials}</div>
                <div>
                  <div class="client-cname" style="font-weight:500;">${house.name}</div>
                  <div class="client-type">Active Household</div>
                </div>
              </div>
            </td>
            <td><span style="font-size:12px;color:var(--text2);">Growth</span></td>
            <td><span class="mono">${formatAUM(house.aum)}</span></td>
            <td><span class="mono up">+${house.ytd_return}%</span></td>
            <td>
              <div class="sentiment-bar">
                <div class="sentiment-dot" style="background:${theme.dot};"></div>
                <span class="sentiment-label">${house.sentiment}</span>
              </div>
            </td>
            <td>
              <div class="drift-indicator">
                <div class="drift-bar-track">
                  <div class="drift-bar-fill" style="width:${Math.min(house.drift * 15, 100)}%; background:${house.drift > 3 ? '#D32F2F' : '#1D9E75'};"></div>
                </div>
                <span style="color:${house.drift > 3 ? '#D32F2F' : '#1D9E75'};">${house.drift}%</span>
              </div>
            </td>
            <td><span class="tag" style="background:${house.status === 'Rebalance' ? 'var(--red-lt)' : 'var(--teal-lt)'}; color:${house.status === 'Rebalance' ? 'var(--red)' : 'var(--teal)'};">${house.status}</span></td>
            <td class="admin-only" style="text-align: right;">
                <button onclick="deleteHousehold('${house.id}')" style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:14px; padding: 5px;">
                   ✕
                </button>
            </td>
          `;
          listContainer.appendChild(row);
      });
  }

  function applyFilters() {
      const searchInput = document.getElementById('client-search');
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      const activeChip = document.querySelector('.filter-chip.active');
      const activeId = activeChip ? activeChip.id : 'filter-all';

      const filtered = allHouseholds.filter(h => {
          const name = h.name || "";
          const matchesSearch = name.toLowerCase().includes(searchTerm);
          if (activeId === 'filter-attention') return matchesSearch && (['Fearful', 'Worried', 'Concerned'].includes(h.sentiment) || h.drift > 3);
          if (activeId === 'filter-rebalance') return matchesSearch && h.status === 'Rebalance';
          return matchesSearch; 
      });
      renderTable(filtered);
  }

  // 5. INITIALIZATION
  document.addEventListener('DOMContentLoaded', () => {
      // This is the new function name! 
      // Ensure 'checkUser' is deleted and replaced with this:
      checkAdminStatus();

      const searchBox = document.getElementById('client-search');
      if (searchBox) searchBox.addEventListener('input', applyFilters);

      document.addEventListener('click', (e) => {
          const chip = e.target.closest('.filter-chip');
          if (chip) {
              document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
              chip.classList.add('active');
              applyFilters();
          }
      });
  });
