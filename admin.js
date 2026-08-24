

const SUPABASE_URL =
    "https://lejzatvsdpkavflhsgxj.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_IqJn3zVjqQMJesdjKIG5Ww__g0yg2IU";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );




function getTodayRange() {

    const now = new Date();

    const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0, 0, 0
    );

    const end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0, 0, 0
    );

    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}




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
            `<h3>🍴 今日餐廳：${restaurant}</h3>`;

        restaurantSelect.value = restaurant;

    } else {

        currentRestaurant.innerHTML =
            "<p>目前還沒設定今日餐廳。</p>";
    }
}


saveButton.addEventListener(
    "click",
    function () {

        const restaurant =
            restaurantSelect.value;

        if (restaurant === "") {

            alert("請先選擇餐廳");

            return;
        }

        localStorage.setItem(
            "todayRestaurant",
            restaurant
        );

        showCurrentRestaurant();

        alert("✅ 今日餐廳設定成功！");
    }
);


showCurrentRestaurant();




const ordersContainer =
    document.getElementById("orders");


async function showOrders() {

    const { start, end } =
        getTodayRange();


    const { data: orders, error } =
        await supabaseClient
            .from("orders")
            .select("*")
            .gte("created_at", start)
            .lt("created_at", end)
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(error);

        ordersContainer.innerHTML =
            "<p>❌ 讀取訂單失敗。</p>";

        return;
    }


    if (orders.length === 0) {

        ordersContainer.innerHTML =
            "<p>目前還沒有訂單。</p>";

        return;
    }


    ordersContainer.innerHTML = "";


    orders.forEach(function (order) {

        const orderCard =
            document.createElement("div");

        orderCard.className =
            "order-card";


        let itemsHTML = "";


        order.items.forEach(
            function (item) {

                const itemTotal =
                    item.price *
                    item.quantity;

                itemsHTML += `
                    <p>
                        ${item.name}
                        × ${item.quantity}
                        — $${itemTotal}
                    </p>
                `;
            }
        );


        const orderTime =
            new Date(
                order.created_at
            ).toLocaleString(
                "zh-TW"
            );


        orderCard.innerHTML = `

            <h3>
                👤 ${order.customer_name}
            </h3>

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


        ordersContainer.appendChild(
            orderCard
        );
    });
}




const orderSummary =
    document.getElementById(
        "order-summary"
    );


async function showOrderSummary() {

    const { start, end } =
        getTodayRange();


    const { data: orders, error } =
        await supabaseClient
            .from("orders")
            .select("*")
            .gte("created_at", start)
            .lt("created_at", end);


    if (error) {

        console.error(error);

        orderSummary.innerHTML =
            "<p>❌ 讀取統計資料失敗。</p>";

        return;
    }


    if (orders.length === 0) {

        orderSummary.innerHTML =
            `
            <p>目前還沒有統計資料。</p>

            <p>
                <strong>訂餐人數：</strong>
                0 人
            </p>

            <p>
                <strong>餐點總份數：</strong>
                0 份
            </p>

            <p>
                <strong>總金額：</strong>
                $0
            </p>
            `;

        return;
    }


    const itemSummary = {};

    let totalMeals = 0;
    let totalPrice = 0;


    orders.forEach(function (order) {

        totalPrice += order.total;


        order.items.forEach(
            function (item) {

                totalMeals +=
                    item.quantity;


                if (
                    itemSummary[item.name]
                ) {

                    itemSummary[
                        item.name
                    ] += item.quantity;

                } else {

                    itemSummary[
                        item.name
                    ] = item.quantity;
                }
            }
        );
    });


    let summaryHTML = "";


    Object.keys(
        itemSummary
    ).forEach(
        function (itemName) {

            summaryHTML += `
                <div class="summary-item">

                    <span>
                        ${itemName}
                    </span>

                    <strong>
                        × ${itemSummary[itemName]}
                    </strong>

                </div>
            `;
        }
    );


    summaryHTML += `

        <hr>

        <p>
            <strong>
                訂餐人數：
            </strong>

            ${orders.length} 人
        </p>

        <p>
            <strong>
                餐點總份數：
            </strong>

            ${totalMeals} 份
        </p>

        <p>
            <strong>
                總金額：
            </strong>

            $${totalPrice}
        </p>
    `;


    orderSummary.innerHTML =
        summaryHTML;
}



const clearOrdersButton =
    document.getElementById(
        "clear-orders"
    );


if (clearOrdersButton) {

    clearOrdersButton.addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    "⚠️ 確定要清空今天所有訂單嗎？\n\n刪除後無法復原。"
                );


            if (!confirmed) {

                return;
            }


            const { start, end } =
                getTodayRange();


            const { error } =
                await supabaseClient
                    .from("orders")
                    .delete()
                    .gte(
                        "created_at",
                        start
                    )
                    .lt(
                        "created_at",
                        end
                    );


            if (error) {

                console.error(error);

                alert(
                    "❌ 清除失敗"
                );

                return;
            }


            alert(
                "✅ 今日訂單已清空"
            );


           
            await showOrders();

            await showOrderSummary();
        }
    );
}




showOrders();

showOrderSummary();