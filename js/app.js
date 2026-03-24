// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://rytmoxxpoegllfbusykt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r86loDzli-AOYkWFDKbe9A_X9-uATdk';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. GLOBAL UI INJECTION (Draws the menu on every page) ---
function injectNavBar() {
    const navContainer = document.getElementById('global-nav-auth');
    if (!navContainer) return;

    navContainer.innerHTML = `
        <div style="position: relative; display: inline-block;">
            <div id="user-avatar" class="avatar" onclick="toggleDropdown()" style="cursor: pointer; display: flex; align-items: center; justify-content: center;">JD</div>
            <div id="account-dropdown" style="display: none; position: absolute; top: 50px; right: 0; width: 220px; background: white; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 10001; padding: 8px 0; text-align: left;">
                <div style="padding: 12px 16px; border-bottom: 1px solid #f8f8f8; margin-bottom: 4px;">
                    <p id="dropdown-status" style="margin:0; font-size: 11px; color: #999; font-weight: 700; text-transform: uppercase;">Demo Mode</p>
                    <p id="dropdown-name" style="margin:2px 0 0 0; font-size: 14px; font-weight: 600; color: #333;">James Davidson, CFP</p>
                </div>
                <div class="menu-item" onclick="toggleAdminModal()" style="padding: 10px 16px; cursor: pointer; font-size: 14px; color: #333;">Log In</div>
                <div id="logout-btn" style="padding: 10px 16px; font-size: 14px; color: #ccc; cursor: not-allowed; border-top: 1px solid #f8f8f8;" onclick="handleAdminLogout()">Log Out</div>
            </div>
        </div>
    `;
}

// --- 3. GLOBAL UI FUNCTIONS ---
function toggleDropdown() {
    const menu = document.getElementById('account-dropdown');
    if (menu) menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
}

async function toggleAdminModal() {
    const email = prompt("Enter Admin Email:");
    const password = prompt("Enter Admin Password:");
    if (email && password) {
        const { error } = await _supabase.auth.signInWithPassword({ email, password });
        if (error) alert("Login failed: " + error.message);
        else window.location.reload();
    }
}

async function handleAdminLogout() {
    await _supabase.auth.signOut();
    window.location.reload();
}

async function checkAdminStatus() {
    const { data: { user } } = await _supabase.auth.getUser();
    const avatar = document.getElementById('user-avatar');
    const statusLabel = document.getElementById('dropdown-status');
    const nameLabel = document.getElementById('dropdown-name');

    if (user) {
        document.body.classList.add('is-admin');
        if(avatar) { avatar.innerText = "CJ"; avatar.style.background = "#000"; }
        if(statusLabel) statusLabel.innerText = "Admin Access";
        if(nameLabel) nameLabel.innerText = "CJ Browning";
    } else {
        document.body.classList.remove('is-admin');
        if(avatar) { avatar.innerText = "JD"; avatar.style.background = "linear-gradient(135deg, #534AB7, #1D9E75)"; }
    }
}

// Initialize Global UI on every page
document.addEventListener('DOMContentLoaded', () => {
    injectNavBar();
    checkAdminStatus();
});
