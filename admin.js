const SUPABASE_URL = "https://lejzatvsdpkavflhsgxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_IqJn3zVjqQMJesdjKIG5Ww__g0yg2IU";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function getTodayRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}

const restaurantSelect = document.getElementById("restaurant-select");
const saveButton = document.getElementById("save-restaurant");
const currentRestaurant = document.getElementById("current-restaurant");
const ordersContainer = document.getElementById("orders");
const orderSummary = document.getElementById("order-summary");
const clearOrdersButton = document.getElementById("clear-orders");

async function showCurrentRestaurant() {
    try {
        const { data, error } = await supabaseClient
            .from("settings")
            .select("value")
            .eq("key", "todayRestaurant")
            .single();

        if (data && data.value) {
            currentRestaurant.innerHTML = `
                <div class="tag-status active"><i class="fa-solid fa-circle-check"></i> Active Today: <strong>${data.value}</strong></div>
            `;
            restaurantSelect.value = data.value;
            localStorage.setItem("todayRestaurant", data.value);
            return;
        }
    } catch (e) {}

    const localVal = localStorage.getItem("todayRestaurant");
    if (localVal) {
        currentRestaurant.innerHTML = `
            <div class="tag-status active"><i class="fa-solid fa-circle-check"></i> Active Today (Local): <strong>${localVal}</strong></div>
        `;
        restaurantSelect.value = localVal;
    } else {
        currentRestaurant.innerHTML = `<p class="empty-state">No restaurant configured for today.</p>`;
    }
}

saveButton.addEventListener("click", async function () {
    const restaurant = restaurantSelect.value;
    if (!restaurant) {
        alert("⚠️ Please select a restaurant first.");
        return;
    }

    localStorage.setItem("todayRestaurant", restaurant);

    try {
        await supabaseClient
            .from("settings")
            .upsert({ key: "todayRestaurant", value: restaurant });
    } catch (e) {
        console.warn("Settings table optional fallback:", e);
    }

    showCurrentRestaurant();
    alert("✅ Restaurant set successfully!");
});

async function showOrders() {
    const { start, end } = getTodayRange();

    const { data: orders, error } = await supabaseClient
        .from("orders")
        .select("*")
        .gte("created_at", start)
        .lt("created_at", end)
        .order("created_at", { ascending: false });

    if (error) {
        console.error(error);
        ordersContainer.innerHTML = `<p class="error-text">❌ Failed to retrieve orders.</p>`;
        return;
    }

    if (!orders || orders.length === 0) {
        ordersContainer.innerHTML = `<p class="empty-state">No orders received for today.</p>`;
        return;
    }

    ordersContainer.innerHTML = "";

    orders.forEach((order) => {
        const orderCard = document.createElement("div");
        orderCard.className = "desk-order-card";

        let itemsHTML = order.items.map(item => `
            <div class="order-line-item">
                <span>${item.name} <strong class="qty">× ${item.quantity}</strong></span>
                <span>NT$ ${item.price * item.quantity}</span>
            </div>
        `).join("");

        const orderTime = new Date(order.created_at).toLocaleTimeString("en-GB", {
            hour: '2-digit',
            minute: '2-digit'
        });

        orderCard.innerHTML = `
            <div class="desk-order-header">
                <div class="user-badge"><i class="fa-solid fa-user-tag"></i> ${order.customer_name}</div>
                <div class="order-timestamp"><i class="fa-regular fa-clock"></i> ${orderTime}</div>
            </div>
            <div class="desk-order-body">
                <div class="order-restaurant-tag">${order.restaurant}</div>
                <div class="order-items-list">${itemsHTML}</div>
                ${order.note ? `<div class="order-note-bubble"><i class="fa-solid fa-comment-dots"></i> "${order.note}"</div>` : ""}
            </div>
            <div class="desk-order-footer">
                <span>Total Amount:</span>
                <span class="order-price-val">NT$ ${order.total}</span>
            </div>
        `;

        ordersContainer.appendChild(orderCard);
    });
}

async function showOrderSummary() {
    const { start, end } = getTodayRange();

    const { data: orders, error } = await supabaseClient
        .from("orders")
        .select("*")
        .gte("created_at", start)
        .lt("created_at", end);

    if (error || !orders || orders.length === 0) {
        orderSummary.innerHTML = `
            <div class="kpi-grid">
                <div class="kpi-card"><div class="kpi-label">Total Colleagues</div><div class="kpi-val">0</div></div>
                <div class="kpi-card"><div class="kpi-label">Total Meals</div><div class="kpi-val">0</div></div>
                <div class="kpi-card"><div class="kpi-label">Gross Amount</div><div class="kpi-val">NT$ 0</div></div>
            </div>
            <p class="empty-state" style="margin-top:15px;">No items ordered yet.</p>
        `;
        return;
    }

    const itemSummary = {};
    let totalMeals = 0;
    let totalPrice = 0;

    orders.forEach(order => {
        totalPrice += order.total;
        order.items.forEach(item => {
            totalMeals += item.quantity;
            itemSummary[item.name] = (itemSummary[item.name] || 0) + item.quantity;
        });
    });

    let itemsBreakdown = Object.keys(itemSummary).map(name => `
        <div class="summary-breakdown-row">
            <span>${name}</span>
            <span class="badge-qty">× ${itemSummary[name]}</span>
        </div>
    `).join("");

    orderSummary.innerHTML = `
        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-label">Total Colleagues</div>
                <div class="kpi-val">${orders.length}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Total Meals</div>
                <div class="kpi-val">${totalMeals}</div>
            </div>
            <div class="kpi-card highlight">
                <div class="kpi-label">Gross Amount</div>
                <div class="kpi-val">NT$ ${totalPrice.toLocaleString()}</div>
            </div>
        </div>
        <div class="item-breakdown-container">
            <h4><i class="fa-solid fa-chart-simple"></i> Item Quantities Breakdown</h4>
            <div class="breakdown-list">${itemsBreakdown}</div>
        </div>
    `;
}

if (clearOrdersButton) {
    clearOrdersButton.addEventListener("click", async function () {
        const confirmed = confirm("⚠️ Are you sure you want to delete all today's orders?\nThis action cannot be undone.");
        if (!confirmed) return;

        const { start, end } = getTodayRange();
        const { error } = await supabaseClient
            .from("orders")
            .delete()
            .gte("created_at", start)
            .lt("created_at", end);

        if (error) {
            alert("❌ Failed to clear orders.");
            return;
        }

        alert("✅ Today's order records have been cleared.");
        await showOrders();
        await showOrderSummary();
    });
}

showCurrentRestaurant();
showOrders();
showOrderSummary();
