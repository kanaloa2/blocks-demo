// 1. Initialize the client (Make sure these match your Supabase Settings)
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Use 'const' to ensure the name isn't overwritten elsewhere
const sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadClients() {
    console.log("Attempting to fetch households...");
    
    // Use the new variable name 'sbClient' to avoid conflicts
    const { data, error } = await sbClient
        .from('households')
        .select('*');

    if (error) {
        console.error('Supabase Error:', error.message);
        return;
    }

    console.log('Success! Database connected. Found:', data);

    const tableBody = document.getElementById('clients-list');
    if (!tableBody) {
        console.error("Could not find table body with ID 'clients-list'");
        return;
    }

    tableBody.innerHTML = ''; // Clear existing sample data

    data.forEach(house => {
        const row = `
            <tr class="border-b hover:bg-slate-50">
                <td class="p-4 font-bold text-slate-800">${house.name}</td>
                <td class="p-4">
                    ${house.tags ? house.tags.map(tag => 
                        `<span class="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-1">${tag}</span>`
                    ).join('') : ''}
                </td>
                <td class="p-4"><span class="text-green-600">● Active</span></td>
                <td class="p-4 text-right">
                    <button class="text-blue-600 hover:underline">Manage</button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

// Run the function
loadClients();
