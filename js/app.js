// --- 1. CONFIGURATION ---
const SUPABASE_URL = 'https://rytmoxxpoegllfbusykt.supabase.co';
const SUPABASE_KEY = 'sb_publishable_r86loDzli-AOYkWFDKbe9A_X9-uATdk';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- 2. GLOBAL UI INJECTION (Draws the menu on every page) ---
function injectNavBar() {
    // 1. GLOBAL STYLE INJECTION
    const style = document.createElement('style');
    style.innerHTML = `
        /* This targets the avatar specifically to stop the extra bold flash */
        #user-avatar { 
            font-weight: 600 !important; 
        }
        /* This fixes all other bold elements globally */
        b, strong, h1, h2, h3, .bold-text { 
            font-weight: 600 !important; 
            letter-spacing: -0.01em; 
        }
        .menu-item:hover {
            background-color: #f8f8f8 !important;
        }
    `;
    document.head.appendChild(style);

    const navContainer = document.getElementById('global-nav-auth');
    if (!navContainer) return;

    // 2. CHECK LOCAL MEMORY (Prevents the "JD Flash")
    const savedInitials = localStorage.getItem('user_initials') || 'JD';
    const isAdmin = savedInitials === 'CJ';
    const avatarBg = isAdmin ? '#000' : 'linear-gradient(135deg, rgb(83, 74, 183), rgb(29, 158, 117))';

    // 3. INJECT THE HTML
    navContainer.innerHTML = `
        <div style="position: relative; display: inline-block;">
            <div id="user-avatar" class="avatar" onclick="toggleDropdown(event)" 
                 style="cursor: pointer; display: flex; align-items: center; justify-content: center; background: ${avatarBg}; color: white; width: 40px; height: 40px; border-radius: 50%; font-weight: 600; font-size: 14px;">
                 ${savedInitials}
            </div>
            
            <div id="account-dropdown" style="display: none; position: absolute; top: 50px; right: 0; width: 220px; background: white; border: 1px solid #eee; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 10001; padding: 8px 0; text-align: left;">
                <div style="padding: 12px 16px; border-bottom: 1px solid #f8f8f8; margin-bottom: 4px;">
                    <p id="dropdown-status" style="margin:0; font-size: 11px; color: #999; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
                        ${isAdmin ? 'Admin Access' : 'Demo Mode'}
                    </p>
                    <p id="dropdown-name" style="margin:2px 0 0 0; font-size: 14px; font-weight: 600; color: #333;">
                        ${isAdmin ? 'CJ Browning' : 'James Davidson, CFP'}
                    </p>
                </div>
                
                <div id="login-menu-item" class="menu-item" onclick="showLoginModal()" 
                     style="padding: 10px 16px; cursor: pointer; font-size: 14px; color: #333; display: ${isAdmin ? 'none' : 'block'};">
                     Log In
                </div>
                
                <div id="logout-btn" onclick="handleAdminLogout()" 
                     style="padding: 10px 16px; font-size: 14px; color: #cc0000; cursor: pointer; border-top: 1px solid #f8f8f8; display: ${isAdmin ? 'block' : 'none'};">
                     Log Out
                </div>
            </div>
        </div>

        <div id="login-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 20000; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 16px; width: 320px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
                <h3 style="margin-top: 0; margin-bottom: 20px; font-family: sans-serif; font-weight: 600;">Admin Login</h3>
                <input type="email" id="login-email" placeholder="Email" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 14px;">
                <input type="password" id="login-pass" placeholder="Password" style="width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; box-sizing: border-box; font-size: 14px;">
                <div style="display: flex; gap: 10px;">
                    <button onclick="closeLoginModal()" style="flex: 1; padding: 12px; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; font-size: 14px;">Cancel</button>
                    <button onclick="executeLogin()" style="flex: 1; padding: 12px; background: #000; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">Log In</button>
                </div>
            </div>
        </div>
    `;
}

// --- 3. GLOBAL UI FUNCTIONS ---
function toggleDropdown(e) {
    if (e) e.stopPropagation(); 
    const menu = document.getElementById('account-dropdown');
    if (menu) {
        const isHidden = menu.style.display === 'none' || menu.style.display === '';
        menu.style.display = isHidden ? 'block' : 'none';
    }
}

// Show the Modal
function showLoginModal() {
    document.getElementById('account-dropdown').style.display = 'none';
    document.getElementById('login-modal').style.display = 'flex';
}

// Close the Modal
function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

// Perform the actual Login
async function executeLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-pass').value;

    const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
        alert("Login failed: " + error.message);
    } else {
        // SAVE INITIALS TO LOCAL STORAGE
        localStorage.setItem('user_initials', 'CJ'); 
        window.location.reload();
    }
}

async function handleAdminLogout() {
    await _supabase.auth.signOut();
    localStorage.removeItem('user_initials'); // CLEAR INITIALS
    window.location.reload();
}

async function checkAdminStatus() {
    const { data: { user } } = await _supabase.auth.getUser();
    const avatar = document.getElementById('user-avatar');
    const statusLabel = document.getElementById('dropdown-status');
    const nameLabel = document.getElementById('dropdown-name');

    if (user) {
        // --- LOGGED IN (CJ) ---
        document.body.classList.add('is-admin');
        if(avatar) { avatar.innerText = "CJ"; avatar.style.background = "#000"; }
        if(statusLabel) statusLabel.innerText = "Admin Access";
        if(nameLabel) nameLabel.innerText = "CJ Browning";

        // ADD THESE: Swap the buttons in the menu
        if(document.getElementById('login-menu-item')) document.getElementById('login-menu-item').style.display = 'none';
        if(document.getElementById('logout-btn')) document.getElementById('logout-btn').style.display = 'block';

        // Show all admin buttons/features
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');

    } else {
        // --- LOGGED OUT (Demo) ---
        document.body.classList.remove('is-admin');
        if(avatar) { avatar.innerText = "JD"; avatar.style.background = "linear-gradient(135deg, #534AB7, #1D9E75)"; }
        if(statusLabel) statusLabel.innerText = "Demo Mode";
        if(nameLabel) nameLabel.innerText = "James Davidson, CFP";

        // ADD THESE: Swap the buttons back
        if(document.getElementById('login-menu-item')) document.getElementById('login-menu-item').style.display = 'block';
        if(document.getElementById('logout-btn')) document.getElementById('logout-btn').style.display = 'none';

        // Hide all admin buttons/features
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }
}



// --- 4. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Inject the HTML first
    injectNavBar();      
    
    // 2. Wait a tiny bit (50ms) to ensure the DOM is ready
    setTimeout(async () => {
        await checkAdminStatus();
    }, 50);

    // 3. Click-outside listener
    window.addEventListener('click', (e) => {
        const menu = document.getElementById('account-dropdown');
        const avatar = document.getElementById('user-avatar');
        
        if (menu && menu.style.display === 'block' && 
            !avatar.contains(e.target) && 
            !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });
});
