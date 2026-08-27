const SUPABASE_URL = "https://lejzatvsdpkavflhsgxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_IqJn3zVjqQMJesdjKIG5Ww__g0yg2IU";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const restaurants = {
    "菜菜優纖": [
        { name: "農夫野菜費塔乳酪沙拉", price: 135 },
        { name: "烤綜合蔬菜羽衣甘藍蘿蔓沙拉", price: 200 },
        { name: "香料時蔬乾咖哩飯", price: 165 },
        { name: "南法普羅旺斯燉時蔬飯", price: 150 },
        { name: "托斯卡尼烤甜椒燉時蔬飯", price: 180 },
        { name: "韓式經典拌飯", price: 150 },
        { name: "黑松露綜合野菇拌飯", price: 200 }
    ],
    "樂天皇朝": [
        { name: "菠蘿咕嚕肉", price: 250 },
        { name: "黑胡椒牛肉", price: 250 },
        { name: "蒜香排骨", price: 250 },
        { name: "宮爆雞丁", price: 230 },
        { name: "糖醋魚片", price: 220 },
        { name: "豆干肉絲", price: 180 },
        { name: "素什錦", price: 220 }
    ],
    "餃子の王將": [
        { name: "自選拼盤", price: 788 },
        { name: "餃子の王將拼盤", price: 688 },
        { name: "超值拼盤", price: 458 },
        { name: "韭菜炒豬肝便當", price: 218 },
        { name: "麻婆豆腐便當", price: 218 },
        { name: "回鍋肉便當", price: 218 },
        { name: "黑醋排骨便當", price: 218 },
        { name: "滑蛋木須肉便當", price: 218 },
        { name: "麻婆茄子便當", price: 218 },
        { name: "炒飯便當", price: 218 }
    ],
    "大戶屋": [
        { name: "炭烤鯖魚便當", price: 280 },
        { name: "炸腰內肉便當", price: 290 },
        { name: "豬里肌便當", price: 270 },
        { name: "炭烤雞肉香橘醋便當", price: 270 },
        { name: "炭烤青醬雞排便當", price: 260 },
        { name: "大戶屋招牌便當", price: 240 },
        { name: "什蔬燴黑醋醬便當", price: 240 },
        { name: "雞肉蔬菜燴黑醋醬便當", price: 260 },
        { name: "豬排蛋蓋飯便當", price: 260 },
        { name: "炭烤雞肉蛋蓋飯便當", price: 250 }
    ],
    "TGI FRIDAYS": [
        { name: "清新香橘雞肉沙拉", price: 230, cropClass: "crop-1" },
        { name: "雙醬炭烤豬肋排飯", price: 390, cropClass: "crop-2" },
        { name: "野菇起司漢堡排蓋飯", price: 290, cropClass: "crop-3" },
        { name: "蕃茄炭烤雞肉筆尖麵", price: 290, cropClass: "crop-4" },
        { name: "蕃茄酥炸魚柳筆尖麵", price: 290, cropClass: "crop-5" },
        { name: "經典美式起司漢堡", price: 290, cropClass: "crop-6" }
    ],
    "開飯川食堂": [
        { name: "清酸帶鹹開胃便當", price: 200 },
        { name: "肉香四溢過癮便當", price: 200 },
        { name: "辛香彈牙涮嘴便當", price: 200 },
        { name: "川味鳳冠雙絲", price: 80 },
        { name: "泡椒皮蛋豆腐", price: 120 },
        { name: "黃瓜愛裝蒜", price: 80 },
        { name: "爽脆醃蘿蔔", price: 80 },
        { name: "煙燻豆皮拌脆芽", price: 80 },
        { name: "醬燒小魚苦瓜", price: 80 },
        { name: "梅香蜜地瓜", price: 80 },
        { name: "冰釀綠茶（無糖）", price: 90 },
        { name: "老舖紅茶", price: 90 },
        { name: "翡翠冬瓜露", price: 90 },
        { name: "仙楂烏梅湯", price: 90 }
    ],
    "大心": [
        { name: "歡心鮮蝦棒（1支）", price: 99 },
        { name: "蝦醬雞翅", price: 75 },
        { name: "爽脆泡菜", price: 45 },
        { name: "涼拌雲耳", price: 35 },
        { name: "涼拌小黃瓜", price: 35 },
        { name: "泰式蝦醬薯條", price: 69 },
        { name: "酥炸蝦醬爆米花", price: 85 },
        { name: "青木瓜沙律", price: 85 },
        { name: "泰式蝦醬雞翅（6支）", price: 225 },
        { name: "泰式蝦醬雞翅（9支）", price: 335 },
        { name: "泰式珍珠奶茶", price: 95 },
        { name: "泰國奶茶", price: 75 },
        { name: "青檸可樂", price: 65 },
        { name: "勝獅啤酒", price: 99 },
        { name: "香檸酸柑水", price: 70 }
    ]
};

const restaurantInfo = document.getElementById("restaurant-info");
const menuContainer = document.getElementById("menu");
const todayRestaurant = localStorage.getItem("todayRestaurant");

if (!todayRestaurant) {
    restaurantInfo.innerHTML = `
        <h3>還沒設定餐廳等一下喔</h3>
        <p>請等待管理員設定今天的餐廳。</p>
    `;
    menuContainer.innerHTML = "<p>目前還沒有菜單。</p>";
} else {
    restaurantInfo.innerHTML = `
        <h3> ${todayRestaurant}</h3>
        <p>以下是今天可以選擇的餐點</p>
    `;
    showMenu(todayRestaurant);
}

let cart = [];

function showMenu(restaurantName) {
    const menu = restaurants[restaurantName];
    menuContainer.innerHTML = "";

    menu.forEach(function (item) {
        const card = document.createElement("div");
        card.className = "menu-item";

        // 如果有 cropClass，就產生對應的圖片視窗
        const imageHTML = item.cropClass 
            ? `<div class="sprite-thumb ${item.cropClass}"></div>` 
            : "";

        card.innerHTML = `
            ${imageHTML}
            <div class="menu-info">
                <h3>${item.name}</h3>
                <p>$${item.price}</p>
            </div>
            <button class="add-button">
                加入購物車
            </button>
        `;

        const button = card.querySelector(".add-button");
        button.addEventListener("click", function () {
            addToCart(item);
        });

        menuContainer.appendChild(card);
    });
}

function addToCart(item) {
    const existingItem = cart.find(function (cartItem) {
        return cartItem.name === item.name;
    });

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: item.name,
            price: item.price,
            quantity: 1
        });
    }

    updateCart();
}

function updateCart() {
    const cartContainer = document.getElementById("cart");
    const totalElement = document.getElementById("total");

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>購物車目前是空的。</p>";
        totalElement.textContent = "0";
        return;
    }

    cartContainer.innerHTML = "";
    let total = 0;

    cart.forEach(function (item, index) {
        total += item.price * item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <span>$${item.price}</span>
            </div>

            <div class="quantity-control">
                <button onclick="decreaseQuantity(${index})">−</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
                <button class="delete-button" onclick="removeItem(${index})">刪除</button>
            </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalElement.textContent = total;
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    cart[index].quantity--;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

const submitOrderButton = document.getElementById("submit-order");

submitOrderButton.addEventListener("click", async function () {
    const customerName = document.getElementById("customer-name").value.trim();
    const note = document.getElementById("order-note").value.trim();

    if (customerName === "") {
        alert("請輸入姓名");
        return;
    }

    if (cart.length === 0) {
        alert("購物車是空的，請先選擇餐點");
        return;
    }

    let totalPrice = 0;
    cart.forEach(function (item) {
        totalPrice += item.price * item.quantity;
    });

    const { error } = await supabaseClient
        .from("orders")
        .insert({
            customer_name: customerName,
            restaurant: todayRestaurant,
            items: cart,
            note: note,
            total: totalPrice
        });

    if (error) {
        console.error(error);
        alert("訂單送出失敗，請再試一次");
        return;
    }

    alert("訂單送出成功！");

    cart = [];
    updateCart();

    document.getElementById("customer-name").value = "";
    document.getElementById("order-note").value = "";
});
