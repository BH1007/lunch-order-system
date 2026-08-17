const SUPABASE_URL =
    "https://lejzatvsdpkavflhsgxj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_IqJn3zVjqQMJesdjKIG5Ww__g0yg2IU";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
const restaurantSelect =
    document.getElementById("restaurant-select");

const saveButton =
    document.getElementById("save-restaurant");

const currentRestaurant =
    document.getElementById("current-restaurant");


function showCurrentRestaurant() {

    const restaurant =
        localStorage.getItem("todayRestaurant");

    if (restaurant) {

        currentRestaurant.innerHTML =
            `<h3> 今日餐廳：${restaurant}</h3>`;

        restaurantSelect.value = restaurant;

    } else {

        currentRestaurant.innerHTML =
            "<p>目前還沒設定今日餐廳</p>";
    }
}


saveButton.addEventListener("click", function () {

    const restaurant = restaurantSelect.value;

    if (restaurant === "") {
        alert("請先選擇餐廳");
        return;
    }

    localStorage.setItem(
        "todayRestaurant",
        restaurant
    );

    showCurrentRestaurant();

    alert("今日餐廳設定成功！");
});


showCurrentRestaurant();
// ========================
// 顯示今日訂單
// ========================

const ordersContainer =
    document.getElementById("orders");


async function showOrders() {

    const { data: orders, error } =
        await supabaseClient
            .from("orders")
            .select("*")
            .order("created_at", {
                ascending: false
            });


    if (error) {

        console.error(error);

        ordersContainer.innerHTML =
            "<p>讀取訂單失敗。</p>";

        return;
    }


    if (orders.length === 0) {

        ordersContainer.innerHTML =
            "<p>目前還沒有訂單。</p>";

        return;
    }


    ordersContainer.innerHTML = "";


    orders.forEach(function(order) {

        const orderCard =
            document.createElement("div");

        orderCard.className = "order-card";


        let itemsHTML = "";


        order.items.forEach(function(item) {

            itemsHTML += `
                <p>
                    ${item.name}
                    × ${item.quantity}
                    — $${item.price * item.quantity}
                </p>
            `;

        });


        const orderTime =
            new Date(
                order.created_at
            ).toLocaleString("zh-TW");


        orderCard.innerHTML = `

            <h3>👤 ${order.customer_name}</h3>

            <p>
                <strong>餐廳：</strong>
                ${order.restaurant}
            </p>

            <hr>

            ${itemsHTML}

            <hr>

            <p>
                <strong>備註：</strong>
                ${order.note || "無"}
            </p>

            <p>
                <strong>總金額：</strong>
                $${order.total}
            </p>

            <p>
                <strong>下單時間：</strong>
                ${orderTime}
            </p>
        `;


        ordersContainer.appendChild(orderCard);

    });

}


showOrders();


// ========================
// 今日訂餐統計
// ========================

const orderSummary =
    document.getElementById("order-summary");


async function showOrderSummary() {

    const { data: orders, error } =
        await supabaseClient
            .from("orders")
            .select("*");


    if (error) {

        console.error(error);

        orderSummary.innerHTML =
            "<p>讀取統計資料失敗。</p>";

        return;
    }


    if (orders.length === 0) {

        orderSummary.innerHTML =
            "<p>目前還沒有統計資料。</p>";

        return;
    }


    const itemSummary = {};

    let totalMeals = 0;
    let totalPrice = 0;


    orders.forEach(function(order) {

        totalPrice += order.total;

        order.items.forEach(function(item) {

            totalMeals += item.quantity;

            if (itemSummary[item.name]) {

                itemSummary[item.name] += item.quantity;

            } else {

                itemSummary[item.name] = item.quantity;

            }

        });

    });


    let summaryHTML = "";


    Object.keys(itemSummary).forEach(function(itemName) {

        summaryHTML += `
            <div class="summary-item">
                <span>${itemName}</span>
                <strong>× ${itemSummary[itemName]}</strong>
            </div>
        `;

    });


    summaryHTML += `
        <hr>

        <p>
            <strong>訂餐人數：</strong>
            ${orders.length} 人
        </p>

        <p>
            <strong>餐點總份數：</strong>
            ${totalMeals} 份
        </p>

        <p>
            <strong>總金額：</strong>
            $${totalPrice}
        </p>
    `;


    orderSummary.innerHTML = summaryHTML;
}


showOrderSummary();