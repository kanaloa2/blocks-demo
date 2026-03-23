async function loadDashboard() {
    const { data, error } = await supabase
        .from('households')
        .select('*');

    if (error) {
        console.error("Database Error:", error.message);
        return;
    }

    console.log("Found Households:", data);
    
    // This part finds your table and injects the Miller Family
    const tableBody = document.querySelector('#clients-list');
    if (tableBody && data.length > 0) {
        tableBody.innerHTML = data.map(house => `
            <tr class="border-b">
                <td class="p-4 font-bold">${house.name}</td>
                <td class="p-4">${house.tags.join(', ')}</td>
                <td class="p-4"><span class="text-green-600">● Active</span></td>
            </tr>
        `).join('');
    }
}

// Kick off the fetch
loadDashboard();
